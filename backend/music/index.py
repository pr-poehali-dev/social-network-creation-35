"""
Музыка: список треков, presigned upload URL, подтверждение загрузки, удаление
?action=list|presign|confirm|delete
"""
import json
import os
import uuid
import psycopg2
import boto3
from botocore.config import Config

SCHEMA = os.environ["MAIN_DB_SCHEMA"]
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

GRADIENTS = [
    "from-purple-600 to-pink-500",
    "from-blue-500 to-cyan-400",
    "from-orange-500 to-red-500",
    "from-green-500 to-teal-400",
    "from-yellow-500 to-orange-400",
    "from-violet-600 to-indigo-500",
]

CONTENT_TYPES = {
    "mp3": "audio/mpeg",
    "m4a": "audio/mp4",
    "ogg": "audio/ogg",
    "wav": "audio/wav",
    "aac": "audio/aac",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        config=Config(signature_version="s3v4"),
        region_name="us-east-1",
    )


def get_user_from_token(token: str):
    if not token:
        return None
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"""SELECT u.id, u.name FROM {SCHEMA}.sessions s
            JOIN {SCHEMA}.users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    row = cur.fetchone()
    conn.close()
    return {"id": row[0], "name": row[1]} if row else None


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    headers_in = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    token = headers_in.get("x-auth-token", "")

    # GET ?action=list
    if action == "list" and method == "GET":
        user = get_user_from_token(token)
        if not user:
            return _err(401, "Требуется авторизация")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT id, title, artist, url, duration, genre, cover_color, uploader_name, plays, uploaded_by
                FROM {SCHEMA}.tracks ORDER BY created_at DESC"""
        )
        rows = cur.fetchall()
        conn.close()
        tracks = [
            {
                "id": r[0], "title": r[1], "artist": r[2], "url": r[3],
                "duration": r[4] or "?:??", "genre": r[5] or "Другое",
                "cover_color": r[6], "uploader_name": r[7],
                "plays": r[8], "is_mine": r[9] == user["id"],
                "cover": (r[2] or r[1] or "?")[:2].upper(),
            }
            for r in rows
        ]
        return _ok({"tracks": tracks})

    # POST ?action=presign — получить URL для прямой загрузки в S3
    if action == "presign" and method == "POST":
        user = get_user_from_token(token)
        if not user:
            return _err(401, "Требуется авторизация")

        body = _parse_body(event)
        file_name = body.get("file_name", "track.mp3")
        ext = file_name.rsplit(".", 1)[-1].lower() if "." in file_name else "mp3"
        if ext not in CONTENT_TYPES:
            return _err(400, "Поддерживаются: mp3, m4a, ogg, wav, aac")

        key = f"music/{uuid.uuid4()}.{ext}"
        content_type = CONTENT_TYPES[ext]

        s3 = get_s3()
        presigned_url = s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": "files", "Key": key, "ContentType": content_type},
            ExpiresIn=300,
        )
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return _ok({"upload_url": presigned_url, "key": key, "cdn_url": cdn_url, "content_type": content_type})

    # POST ?action=confirm — сохранить трек в БД после загрузки
    if action == "confirm" and method == "POST":
        user = get_user_from_token(token)
        if not user:
            return _err(401, "Требуется авторизация")

        body = _parse_body(event)
        title = (body.get("title") or "").strip()
        artist = (body.get("artist") or user["name"]).strip()
        genre = body.get("genre", "Другое")
        cdn_url = body.get("cdn_url", "")
        duration = body.get("duration", "")

        if not title or not cdn_url:
            return _err(400, "Нужны title и cdn_url")

        grad_idx = user["id"] % len(GRADIENTS)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.tracks (title, artist, url, duration, genre, cover_color, uploaded_by, uploader_name)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (title, artist, cdn_url, duration, genre, GRADIENTS[grad_idx], user["id"], user["name"])
        )
        track_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return _ok({"ok": True, "track_id": track_id})

    # DELETE ?action=delete&id=<track_id>
    if action == "delete" and method == "DELETE":
        user = get_user_from_token(token)
        if not user:
            return _err(401, "Требуется авторизация")
        try:
            track_id = int(qs.get("id", ""))
        except (ValueError, TypeError):
            return _err(400, "Нужен параметр ?id=")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT uploaded_by, url FROM {SCHEMA}.tracks WHERE id = %s", (track_id,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return _err(404, "Трек не найден")
        if row[0] != user["id"]:
            conn.close()
            return _err(403, "Нельзя удалить чужой трек")
        try:
            s3_key = row[1].split("/bucket/")[-1]
            get_s3().delete_object(Bucket="files", Key=s3_key)
        except Exception:
            pass
        cur.execute(f"DELETE FROM {SCHEMA}.tracks WHERE id = %s", (track_id,))
        conn.commit()
        conn.close()
        return _ok({"ok": True})

    return _err(404, "Не найдено. Укажи ?action=list|presign|confirm|delete")


def _parse_body(event: dict) -> dict:
    try:
        return json.loads(event.get("body") or "{}")
    except Exception:
        return {}


def _ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}


def _err(code: int, msg: str) -> dict:
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

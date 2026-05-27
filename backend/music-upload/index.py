"""
Загрузка аудио файлов чанками (multipart S3 upload).
Обходит лимит шлюза в 6 МБ — каждый чанк < 5 МБ.

Шаги:
1. POST ?action=start  → {upload_id, key}
2. POST ?action=chunk&upload_id=...&key=...&part=1  body: base64 chunk → {etag}
3. POST ?action=finish  body: {upload_id, key, parts, title, artist, genre, duration} → {track_id}
"""
import json
import os
import base64
import uuid
import psycopg2
import boto3
from botocore.config import Config

SCHEMA = os.environ["MAIN_DB_SCHEMA"]
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

    user = get_user_from_token(token)
    if not user:
        return _err(401, "Требуется авторизация")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            return _err(400, "Неверный JSON")

    s3 = get_s3()

    # 1. Начать multipart upload
    if action == "start" and method == "POST":
        file_name = body.get("file_name", "track.mp3")
        ext = file_name.rsplit(".", 1)[-1].lower() if "." in file_name else "mp3"
        if ext not in CONTENT_TYPES:
            return _err(400, "Поддерживаются: mp3, m4a, ogg, wav, aac")
        key = f"music/{uuid.uuid4()}.{ext}"
        ct = CONTENT_TYPES[ext]
        resp = s3.create_multipart_upload(Bucket="files", Key=key, ContentType=ct)
        return _ok({"upload_id": resp["UploadId"], "key": key})

    # 2. Загрузить чанк
    if action == "chunk" and method == "POST":
        upload_id = qs.get("upload_id", "")
        key = qs.get("key", "")
        part_number = int(qs.get("part", "1"))
        chunk_b64 = body.get("data", "")
        if not upload_id or not key or not chunk_b64:
            return _err(400, "Нужны upload_id, key, data")
        chunk_bytes = base64.b64decode(chunk_b64)
        resp = s3.upload_part(
            Bucket="files", Key=key,
            UploadId=upload_id, PartNumber=part_number, Body=chunk_bytes
        )
        return _ok({"etag": resp["ETag"], "part": part_number})

    # 3. Завершить upload и сохранить трек в БД
    if action == "finish" and method == "POST":
        upload_id = body.get("upload_id", "")
        key = body.get("key", "")
        parts = body.get("parts", [])  # [{part: 1, etag: "..."}, ...]
        title = (body.get("title") or "").strip()
        artist = (body.get("artist") or user["name"]).strip()
        genre = body.get("genre", "Другое")
        duration = body.get("duration", "")

        if not upload_id or not key or not parts or not title:
            return _err(400, "Нужны upload_id, key, parts, title")

        # Завершаем multipart upload в S3
        s3.complete_multipart_upload(
            Bucket="files", Key=key,
            UploadId=upload_id,
            MultipartUpload={"Parts": [{"PartNumber": p["part"], "ETag": p["etag"]} for p in parts]}
        )

        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
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
        return _ok({"ok": True, "track_id": track_id, "url": cdn_url})

    return _err(404, "Укажи ?action=start|chunk|finish")


def _ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}


def _err(code: int, msg: str) -> dict:
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

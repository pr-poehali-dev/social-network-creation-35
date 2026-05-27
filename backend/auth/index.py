"""
Авторизация: login, logout, me, change-password, seed
action передаётся через query: ?action=login
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ["MAIN_DB_SCHEMA"]
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    salt = "volna_salt_2025"
    return hashlib.sha256((password + salt).encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(32)


def get_user_from_token(token: str):
    if not token:
        return None
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"""SELECT u.id, u.name, u.username, u.email, u.avatar, u.bio
            FROM {SCHEMA}.sessions s
            JOIN {SCHEMA}.users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    return {"id": row[0], "name": row[1], "username": row[2], "email": row[3], "avatar": row[4], "bio": row[5]}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    headers_in = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    token = headers_in.get("x-auth-token", "")

    # POST ?action=login
    if action == "login" and method == "POST":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        if not email or not password:
            return _err(400, "Email и пароль обязательны")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, username, email, avatar, bio FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s AND is_closed = FALSE",
            (email, hash_password(password))
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return _err(401, "Неверный email или пароль")

        user_id, name, username, email_db, avatar, bio = row
        tok = make_token()
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
            (user_id, tok)
        )
        conn.commit()
        conn.close()
        return _ok({"token": tok, "user": {"id": user_id, "name": name, "username": username, "email": email_db, "avatar": avatar, "bio": bio}})

    # GET ?action=me
    if action == "me" and method == "GET":
        user = get_user_from_token(token)
        if not user:
            return _err(401, "Токен недействителен")
        return _ok({"user": user})

    # POST ?action=change-password
    if action == "change-password" and method == "POST":
        new_password = body.get("new_password", "")
        user = get_user_from_token(token)
        if not user:
            return _err(401, "Требуется авторизация")
        if len(new_password) < 6:
            return _err(400, "Пароль минимум 6 символов")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.users SET password_hash = %s WHERE id = %s",
            (hash_password(new_password), user["id"])
        )
        conn.commit()
        conn.close()
        return _ok({"ok": True})

    # POST ?action=logout
    if action == "logout" and method == "POST":
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"DELETE FROM {SCHEMA}.sessions WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return _ok({"ok": True})

    # POST ?action=seed — создаёт 5 аккаунтов (идемпотентно)
    if action == "seed" and method == "POST":
        accounts = [
            ("Владелец", "@owner", "owner@volna.app", "Volna2025#owner"),
            ("Друг Один", "@friend1", "friend1@volna.app", "Volna2025#f1"),
            ("Друг Два", "@friend2", "friend2@volna.app", "Volna2025#f2"),
            ("Друг Три", "@friend3", "friend3@volna.app", "Volna2025#f3"),
            ("Друг Четыре", "@friend4", "friend4@volna.app", "Volna2025#f4"),
        ]
        conn = get_conn()
        cur = conn.cursor()
        created = []
        for name, uname, email, pwd in accounts:
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
            if not cur.fetchone():
                cur.execute(
                    f"INSERT INTO {SCHEMA}.users (name, username, email, password_hash) VALUES (%s, %s, %s, %s)",
                    (name, uname, email, hash_password(pwd))
                )
                created.append({"name": name, "email": email, "password": pwd})
        conn.commit()
        conn.close()
        return _ok({"created": created, "total": len(created)})

    return _err(404, "Не найдено. Укажи ?action=login|me|logout|change-password|seed")


def _ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}


def _err(code: int, msg: str) -> dict:
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

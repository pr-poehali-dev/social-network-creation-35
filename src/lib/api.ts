const AUTH_URL = "https://functions.poehali.dev/75adb14b-1802-4ce8-bfc0-104f73f4c0de";
const MUSIC_URL = "https://functions.poehali.dev/1448140c-439c-40e5-9420-a59f52efce05";
const UPLOAD_URL = "https://functions.poehali.dev/3207a58e-b528-4b7b-89c1-da9fc2bba545";

const CHUNK_SIZE = 4 * 1024 * 1024; // 4 МБ — меньше лимита шлюза

function getToken(): string {
  return localStorage.getItem("volna_token") || "";
}

function authHeaders(): Record<string, string> {
  return { "Content-Type": "application/json", "X-Auth-Token": getToken() };
}

export const api = {
  async login(email: string, password: string) {
    const r = await fetch(`${AUTH_URL}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Ошибка входа");
    return data as { token: string; user: AuthUser };
  },

  async me() {
    const r = await fetch(`${AUTH_URL}?action=me`, { headers: authHeaders() });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Ошибка");
    return data.user as AuthUser;
  },

  async logout() {
    await fetch(`${AUTH_URL}?action=logout`, { method: "POST", headers: authHeaders() });
  },

  async changePassword(newPassword: string) {
    const r = await fetch(`${AUTH_URL}?action=change-password`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ new_password: newPassword }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Ошибка");
    return data;
  },

  async listTracks() {
    const r = await fetch(`${MUSIC_URL}?action=list`, { headers: authHeaders() });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Ошибка");
    return data.tracks as Track[];
  },

  async uploadTrack(
    file: File,
    meta: { title: string; artist: string; genre: string; duration: string },
    onProgress?: (pct: number) => void,
  ) {
    // Шаг 1: начинаем multipart upload
    const r1 = await fetch(`${UPLOAD_URL}?action=start`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ file_name: file.name }),
    });
    const { upload_id, key } = await r1.json();
    if (!r1.ok || !upload_id) throw new Error("Ошибка начала загрузки");

    // Шаг 2: шлём файл чанками по 4 МБ
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const parts: { part: number; etag: string }[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const chunk = file.slice(start, start + CHUNK_SIZE);
      const arrayBuf = await chunk.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));

      const r = await fetch(
        `${UPLOAD_URL}?action=chunk&upload_id=${encodeURIComponent(upload_id)}&key=${encodeURIComponent(key)}&part=${i + 1}`,
        { method: "POST", headers: authHeaders(), body: JSON.stringify({ data: b64 }) }
      );
      const res = await r.json();
      if (!r.ok) throw new Error(res.error || `Ошибка чанка ${i + 1}`);
      parts.push({ part: i + 1, etag: res.etag });
      onProgress?.(Math.round(((i + 1) / totalChunks) * 90));
    }

    // Шаг 3: завершаем upload и сохраняем трек в БД
    const r3 = await fetch(`${UPLOAD_URL}?action=finish`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ upload_id, key, parts, ...meta }),
    });
    const result = await r3.json();
    if (!r3.ok) throw new Error(result.error || "Ошибка завершения загрузки");
    onProgress?.(100);
    return result;
  },

  async deleteTrack(id: number) {
    const r = await fetch(`${MUSIC_URL}?action=delete&id=${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Ошибка");
    return data;
  },
};

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: string;
  genre: string;
  cover_color: string;
  cover: string;
  uploader_name: string;
  plays: number;
  is_mine: boolean;
}
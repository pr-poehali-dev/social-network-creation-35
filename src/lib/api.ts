const AUTH_URL = "https://functions.poehali.dev/75adb14b-1802-4ce8-bfc0-104f73f4c0de";
const MUSIC_URL = "https://functions.poehali.dev/1448140c-439c-40e5-9420-a59f52efce05";

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

  async uploadTrack(payload: {
    title: string;
    artist: string;
    genre: string;
    file_data: string;
    file_name: string;
    duration: string;
  }) {
    const r = await fetch(`${MUSIC_URL}?action=upload`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Ошибка загрузки");
    return data;
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

CREATE TABLE t_p84076168_social_network_creat.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_closed BOOLEAN DEFAULT FALSE
);

CREATE TABLE t_p84076168_social_network_creat.tracks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT NOT NULL,
  duration TEXT,
  genre TEXT,
  cover_color TEXT DEFAULT 'from-purple-600 to-pink-500',
  uploaded_by INTEGER REFERENCES t_p84076168_social_network_creat.users(id),
  uploader_name TEXT,
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p84076168_social_network_creat.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p84076168_social_network_creat.users(id),
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

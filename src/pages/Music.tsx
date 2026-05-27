import { useState, useRef, useEffect, useCallback } from "react";
import { api, type Track } from "@/lib/api";
import Icon from "@/components/ui/icon";

const GENRES = ["Pop", "Rock", "Electronic", "Hip-Hop", "Jazz", "Lo-Fi", "Chill", "Indie", "Acoustic", "Другое"];

const playlists = [
  { id: 1, name: "Мои любимые", cover: "МЛ", gradient: "from-purple-600 to-pink-500" },
  { id: 2, name: "Вечерний дрифт", cover: "ВД", gradient: "from-blue-600 to-cyan-400" },
  { id: 3, name: "Для работы", cover: "ДР", gradient: "from-green-500 to-teal-400" },
  { id: 4, name: "Утро", cover: "УТ", gradient: "from-orange-500 to-yellow-400" },
];

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [audioLoading, setAudioLoading] = useState(false);
  const [tab, setTab] = useState<"tracks" | "playlists" | "upload">("tracks");

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadArtist, setUploadArtist] = useState("");
  const [uploadGenre, setUploadGenre] = useState("Другое");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTracks = useCallback(async () => {
    setLoadingTracks(true);
    try {
      const list = await api.listTracks();
      setTracks(list);
    } catch { /* ignore */ }
    finally { setLoadingTracks(false); }
  }, []);

  useEffect(() => { fetchTracks(); }, [fetchTracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onDur = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false); setProgress(0); setCurrentTime(0);
      if (currentTrack) {
        const idx = tracks.findIndex(t => t.id === currentTrack.id);
        if (idx < tracks.length - 1) playTrack(tracks[idx + 1]);
      }
    };
    const onCanPlay = () => setAudioLoading(false);
    const onWaiting = () => setAudioLoading(true);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDur);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("waiting", onWaiting);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDur);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("waiting", onWaiting);
    };
  }, [currentTrack, tracks]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.id === track.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
      return;
    }
    setCurrentTrack(track); setAudioLoading(true);
    audio.src = track.url; audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play(); setIsPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const skipNext = () => {
    if (!currentTrack) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx < tracks.length - 1) playTrack(tracks[idx + 1]);
  };

  const skipPrev = () => {
    if (!currentTrack) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) playTrack(tracks[idx - 1]);
  };

  const deleteTrack = async (id: number) => {
    try {
      await api.deleteTrack(id);
      if (currentTrack?.id === id) { audioRef.current?.pause(); setCurrentTrack(null); setIsPlaying(false); }
      setTracks(prev => prev.filter(t => t.id !== id));
    } catch { /* ignore */ }
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
    setUploadError(""); setUploadSuccess(false);
    if (file && !uploadTitle) setUploadTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) { setUploadError("Выбери файл и введи название"); return; }
    setUploading(true); setUploadError("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(uploadFile);
      });
      const dur = await new Promise<string>((resolve) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(uploadFile);
        audio.onloadedmetadata = () => { resolve(fmt(audio.duration)); URL.revokeObjectURL(audio.src); };
        audio.onerror = () => resolve("");
      });
      await api.uploadTrack({ title: uploadTitle.trim(), artist: uploadArtist.trim(), genre: uploadGenre, file_data: base64, file_name: uploadFile.name, duration: dur });
      setUploadSuccess(true);
      setUploadTitle(""); setUploadArtist(""); setUploadFile(null); setUploadGenre("Другое");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchTracks();
      setTimeout(() => { setUploadSuccess(false); setTab("tracks"); }, 1500);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-4 pb-28">
      <audio ref={audioRef} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Музыка</h1>
        <button onClick={() => setTab("upload")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-bg text-white text-sm font-medium">
          <Icon name="Upload" size={15} />
          Загрузить
        </button>
      </div>

      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {([["tracks", "Треки"], ["playlists", "Плейлисты"], ["upload", "Загрузить"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "tracks" && (
        <div className="space-y-1">
          {loadingTracks ? (
            <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Icon name="Loader" size={32} className="animate-spin opacity-40" />
              <p className="text-sm">Загружаю треки...</p>
            </div>
          ) : tracks.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Icon name="Music" size={48} className="opacity-20" />
              <p className="text-sm">Музыки пока нет</p>
              <button onClick={() => setTab("upload")} className="text-sm text-primary hover:text-accent transition-colors">Загрузить первый трек →</button>
            </div>
          ) : (
            tracks.map(track => {
              const active = currentTrack?.id === track.id;
              return (
                <div key={track.id} className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${active ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/50"}`}>
                  <div onClick={() => playTrack(track)} className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${track.cover_color || "from-purple-600 to-pink-500"} flex items-center justify-center text-sm font-bold text-white flex-shrink-0 cursor-pointer`}>
                    {active && audioLoading ? <Icon name="Loader" size={16} className="animate-spin text-white" />
                      : active && isPlaying ? <Icon name="Pause" size={16} className="text-white" />
                        : active ? <Icon name="Play" size={16} className="text-white" />
                          : track.cover}
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => playTrack(track)}>
                    <p className={`font-medium text-sm truncate ${active ? "text-primary" : ""}`}>{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}{track.genre ? ` · ${track.genre}` : ""}</p>
                    <p className="text-xs text-muted-foreground/50 truncate">Загрузил: {track.uploader_name}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{track.duration}</span>
                    {track.is_mine && (
                      <button onClick={() => deleteTrack(track.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1" title="Удалить">
                        <Icon name="Trash2" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "playlists" && (
        <div className="grid grid-cols-2 gap-3">
          {playlists.map(pl => (
            <div key={pl.id} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all">
              <div className={`h-24 bg-gradient-to-br ${pl.gradient} flex items-center justify-center text-3xl font-bold text-white`}>{pl.cover}</div>
              <div className="p-3">
                <p className="font-semibold text-sm">{pl.name}</p>
                <p className="text-xs text-muted-foreground">{tracks.length} треков</p>
              </div>
            </div>
          ))}
          <div className="bg-card border border-dashed border-border rounded-2xl flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary/50 transition-all text-muted-foreground hover:text-primary">
            <Icon name="Plus" size={24} />
            <p className="text-xs mt-1">Новый плейлист</p>
          </div>
        </div>
      )}

      {tab === "upload" && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 max-w-lg">
          <h2 className="font-semibold">Загрузить трек</h2>
          <p className="text-xs text-muted-foreground">Все участники увидят его в общей библиотеке. Форматы: mp3, m4a, wav, ogg, aac. Макс. 30 МБ.</p>

          {uploadError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
              <Icon name="AlertCircle" size={15} />{uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-3 py-2.5">
              <Icon name="CheckCircle" size={15} />Трек загружен! Переключаю на список...
            </div>
          )}

          <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${uploadFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40"}`}>
            <input ref={fileInputRef} type="file" accept=".mp3,.m4a,.ogg,.wav,.aac,audio/*" className="hidden" onChange={handleFileChange} />
            <Icon name={uploadFile ? "FileMusic" : "Upload"} size={28} className={`mx-auto mb-2 ${uploadFile ? "text-primary" : "text-muted-foreground"}`} />
            {uploadFile ? (
              <div>
                <p className="text-sm font-medium">{uploadFile.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{(uploadFile.size / 1024 / 1024).toFixed(1)} МБ</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Нажми или перетащи файл</p>
                <p className="text-xs text-muted-foreground mt-0.5">mp3, m4a, wav, ogg, aac</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Название трека *</label>
            <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Название песни"
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Исполнитель</label>
            <input value={uploadArtist} onChange={e => setUploadArtist(e.target.value)} placeholder="Необязательно"
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Жанр</label>
            <select value={uploadGenre} onChange={e => setUploadGenre(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors">
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <button onClick={handleUpload} disabled={uploading || !uploadFile || !uploadTitle.trim()}
            className="w-full py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2">
            {uploading && <Icon name="Loader" size={16} className="animate-spin" />}
            {uploading ? "Загружаю..." : "Загрузить трек"}
          </button>
        </div>
      )}

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3 z-30">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTrack.cover_color || "from-purple-600 to-pink-500"} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                {audioLoading ? <Icon name="Loader" size={16} className="animate-spin text-white" /> : currentTrack.cover}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist || currentTrack.uploader_name}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs text-muted-foreground hidden sm:block w-8 text-right">{fmt(currentTime)}</span>
                <button onClick={skipPrev} className="text-muted-foreground hover:text-foreground p-1"><Icon name="SkipBack" size={18} /></button>
                <button onClick={togglePlay} className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                  {audioLoading ? <Icon name="Loader" size={16} className="animate-spin text-white" /> : <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white" />}
                </button>
                <button onClick={skipNext} className="text-muted-foreground hover:text-foreground p-1"><Icon name="SkipForward" size={18} /></button>
                <span className="text-xs text-muted-foreground hidden sm:block w-8">{fmt(duration)}</span>
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <Icon name="Volume2" size={14} className="text-muted-foreground" />
                  <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-16 accent-purple-500" />
                </div>
              </div>
            </div>
            <div className="h-1 bg-secondary rounded-full cursor-pointer" onClick={seek}>
              <div className="h-full gradient-bg rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

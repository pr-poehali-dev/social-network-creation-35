import { useState, useRef, useEffect } from "react";
import { TRACKS, type Track } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const playlists = [
  { id: 1, name: "Мои любимые", cover: "МЛ", tracks: 24, gradient: "from-purple-600 to-pink-500" },
  { id: 2, name: "Вечерний дрифт", cover: "ВД", tracks: 32, gradient: "from-blue-600 to-cyan-400" },
  { id: 3, name: "Для работы", cover: "ДР", tracks: 18, gradient: "from-green-500 to-teal-400" },
  { id: 4, name: "Утро", cover: "УТ", tracks: 12, gradient: "from-orange-500 to-yellow-400" },
];

export default function Music() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tab, setTab] = useState<"tracks" | "playlists" | "recommended">("tracks");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      // авто-следующий трек
      if (currentTrack) {
        const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
        if (idx < TRACKS.length - 1) playTrack(TRACKS[idx + 1]);
      }
    };
    const onCanPlay = () => setLoading(false);
    const onWaiting = () => setLoading(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("waiting", onWaiting);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("waiting", onWaiting);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.id === track.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
      return;
    }
    setCurrentTrack(track);
    setLoading(true);
    audio.src = track.url;
    audio.load();
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
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const skipNext = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    if (idx < TRACKS.length - 1) playTrack(TRACKS[idx + 1]);
  };

  const skipPrev = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) playTrack(TRACKS[idx - 1]);
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 pb-28">
      <audio ref={audioRef} />

      <h1 className="text-2xl font-bold">Музыка</h1>

      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {([["tracks", "Треки"], ["playlists", "Плейлисты"], ["recommended", "Для тебя"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "tracks" && (
        <div className="space-y-1">
          {TRACKS.map((track) => {
            const active = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  active ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/50"
                }`}
              >
                <div className="relative w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {active && loading
                    ? <Icon name="Loader" size={16} className="animate-spin text-white" />
                    : active && isPlaying
                      ? <Icon name="Pause" size={16} className="text-white" />
                      : active
                        ? <Icon name="Play" size={16} className="text-white" />
                        : track.cover
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${active ? "text-primary" : ""}`}>{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist} · {track.genre}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">{(track.plays / 1000).toFixed(0)}K</span>
                  <span className="text-xs text-muted-foreground">{track.duration}</span>
                  <button
                    onClick={e => e.stopPropagation()}
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Icon name="Heart" size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "playlists" && (
        <div className="grid grid-cols-2 gap-3">
          {playlists.map(pl => (
            <div key={pl.id} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all">
              <div className={`h-24 bg-gradient-to-br ${pl.gradient} flex items-center justify-center text-3xl font-bold text-white`}>
                {pl.cover}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm">{pl.name}</p>
                <p className="text-xs text-muted-foreground">{pl.tracks} треков</p>
              </div>
            </div>
          ))}
          <div className="bg-card border border-dashed border-border rounded-2xl flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary/50 transition-all text-muted-foreground hover:text-primary">
            <Icon name="Plus" size={24} />
            <p className="text-xs mt-1">Новый плейлист</p>
          </div>
        </div>
      )}

      {tab === "recommended" && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
            <Icon name="Sparkles" size={14} className="text-accent" />
            Подборка для тебя
          </h3>
          <p className="text-xs text-muted-foreground mb-3">На основе твоих прослушиваний</p>
          <div className="space-y-2">
            {TRACKS.slice(0, 4).map(track => {
              const active = currentTrack?.id === track.id;
              return (
                <div key={track.id} onClick={() => playTrack(track)} className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
                  <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {active && isPlaying ? <Icon name="Pause" size={14} className="text-white" /> : track.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${active ? "text-primary" : ""}`}>{track.title}</p>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{track.duration}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Player bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3 z-30">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {loading ? <Icon name="Loader" size={16} className="animate-spin text-white" /> : currentTrack.cover}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-3">
                <span className="text-xs text-muted-foreground hidden sm:block">{fmt(currentTime)}</span>
                <button onClick={skipPrev} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <Icon name="SkipBack" size={18} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0"
                >
                  {loading
                    ? <Icon name="Loader" size={16} className="animate-spin text-white" />
                    : <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white" />
                  }
                </button>
                <button onClick={skipNext} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <Icon name="SkipForward" size={18} />
                </button>
                <span className="text-xs text-muted-foreground hidden sm:block">{fmt(duration)}</span>
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <Icon name="Volume2" size={14} className="text-muted-foreground" />
                  <input
                    type="range" min={0} max={1} step={0.01} value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="w-16 accent-purple-500"
                  />
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div
              className="h-1 bg-secondary rounded-full cursor-pointer"
              onClick={seek}
            >
              <div
                className="h-full gradient-bg rounded-full transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

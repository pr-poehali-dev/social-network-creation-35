import { useState } from "react";
import { TRACKS } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const playlists = [
  { id: 1, name: "Мои любимые", cover: "МЛ", tracks: 24, gradient: "from-purple-600 to-pink-500" },
  { id: 2, name: "Вечерний дрифт", cover: "ВД", tracks: 32, gradient: "from-blue-600 to-cyan-400" },
  { id: 3, name: "Для работы", cover: "ДР", tracks: 18, gradient: "from-green-500 to-teal-400" },
  { id: 4, name: "Утро", cover: "УТ", tracks: 12, gradient: "from-orange-500 to-yellow-400" },
];

export default function Music() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tab, setTab] = useState<"tracks" | "playlists" | "recommended">("tracks");
  const [progress, setProgress] = useState(35);

  const playTrack = (id: number) => {
    if (currentTrack === id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(id);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const current = TRACKS.find(t => t.id === currentTrack);

  return (
    <div className="space-y-4 pb-24">
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
        <div className="space-y-2">
          {TRACKS.map((track, i) => (
            <div
              key={track.id}
              onClick={() => playTrack(track.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                currentTrack === track.id ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/50"
              }`}
            >
              <div className="relative w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {currentTrack === track.id && isPlaying ? (
                  <div className="flex gap-0.5 items-end h-4">
                    {[1, 2, 3].map(b => (
                      <div key={b} className="w-1 bg-white rounded-full animate-bounce" style={{ height: `${Math.random() * 10 + 6}px`, animationDelay: `${b * 0.15}s` }} />
                    ))}
                  </div>
                ) : (
                  track.cover
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${currentTrack === track.id ? "text-primary" : ""}`}>{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist} · {track.genre}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">{(track.plays / 1000).toFixed(0)}K</span>
                <span className="text-xs text-muted-foreground">{track.duration}</span>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon name="Heart" size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "playlists" && (
        <div className="grid grid-cols-2 gap-3">
          {playlists.map(pl => (
            <div key={pl.id} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all group">
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
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
              <Icon name="Sparkles" size={14} className="text-accent" />
              Подборка для тебя
            </h3>
            <p className="text-xs text-muted-foreground mb-3">На основе твоих прослушиваний</p>
            <div className="space-y-2">
              {TRACKS.slice(0, 4).map(track => (
                <div key={track.id} onClick={() => playTrack(track.id)} className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
                  <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {track.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player */}
      {currentTrack && current && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {current.cover}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{current.title}</p>
                <p className="text-xs text-muted-foreground truncate">{current.artist}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="SkipBack" size={18} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white" />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="SkipForward" size={18} />
                </button>
              </div>
            </div>
            <div className="mt-2 h-1 bg-secondary rounded-full cursor-pointer" onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
            }}>
              <div className="h-full gradient-bg rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

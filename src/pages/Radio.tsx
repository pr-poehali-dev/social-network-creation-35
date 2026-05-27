import { useState, useRef, useEffect } from "react";
import { RADIO_STATIONS, type RadioStation } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const genres = ["Все", "Pop / Hits", "Electronic / Dance", "Electronic / Techno", "Разговорное / Хиты", "Новости", "Развлекательное"];

const gradients = [
  "from-purple-600 to-pink-500",
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-red-500",
  "from-green-500 to-teal-400",
  "from-yellow-500 to-orange-400",
  "from-red-500 to-pink-600",
];

export default function Radio() {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGenre, setActiveGenre] = useState("Все");
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onCanPlay = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => { setLoading(false); setIsPlaying(true); };
    const onError = () => setLoading(false);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playStation = (station: RadioStation) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentStation?.id === station.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
      return;
    }

    setCurrentStation(station);
    setLoading(true);
    setIsPlaying(false);
    audio.src = station.url;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setLoading(false));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().then(() => setIsPlaying(true)); }
  };

  const filtered = RADIO_STATIONS.filter(s => activeGenre === "Все" || s.genre === activeGenre);

  return (
    <div className="space-y-5 pb-28">
      <audio ref={audioRef} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Радио</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Icon name="Radio" size={14} className="text-primary" />
          {RADIO_STATIONS.reduce((acc, s) => acc + s.listeners, 0).toLocaleString()} слушают сейчас
        </div>
      </div>

      {/* Genre filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {genres.map(g => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              activeGenre === g ? "gradient-bg text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Stations grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((station, i) => {
          const active = currentStation?.id === station.id;
          const playing = active && isPlaying;
          return (
            <button
              key={station.id}
              onClick={() => playStation(station)}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all border ${
                active ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/40 bg-card"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} ${active ? "opacity-15" : "opacity-5"} transition-opacity`} />
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center font-bold text-white text-lg mb-3`}>
                {active && loading
                  ? <Icon name="Loader" size={20} className="animate-spin text-white" />
                  : playing
                    ? <Icon name="Pause" size={20} className="text-white" />
                    : active
                      ? <Icon name="Play" size={20} className="text-white" />
                      : station.cover
                }
              </div>
              <p className="relative font-semibold text-sm truncate">{station.name}</p>
              <p className="relative text-xs text-muted-foreground truncate">{station.genre}</p>
              <div className="relative flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Icon name="Headphones" size={11} />
                {station.listeners.toLocaleString()}
                {playing && <span className="ml-1 text-green-400 font-medium">● В эфире</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Player bar */}
      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3 z-30">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[RADIO_STATIONS.findIndex(s => s.id === currentStation.id) % gradients.length]} flex items-center justify-center font-bold text-white flex-shrink-0`}>
              {loading
                ? <Icon name="Loader" size={16} className="animate-spin text-white" />
                : currentStation.cover
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{currentStation.name}</p>
              <p className="text-xs text-muted-foreground">
                {loading ? "Загрузка..." : isPlaying ? "● В эфире" : "Пауза"} · {currentStation.listeners.toLocaleString()} слушателей
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Icon name="Volume2" size={16} className="text-muted-foreground" />
                <input
                  type="range" min={0} max={1} step={0.01} value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-20 accent-purple-500"
                />
              </div>
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center"
              >
                {loading
                  ? <Icon name="Loader" size={16} className="animate-spin text-white" />
                  : <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white" />
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { RADIO_STATIONS } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const genres = ["Все", "Pop / Hits", "Lo-Fi / Ambient", "Electronic / Techno", "Indie / Alternative", "Jazz / Soul", "Rock / Metal"];

const gradients = [
  "from-purple-600 to-pink-500",
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-red-500",
  "from-green-500 to-teal-400",
  "from-yellow-500 to-orange-400",
  "from-red-500 to-pink-600",
];

export default function Radio() {
  const [stations, setStations] = useState(RADIO_STATIONS);
  const [currentStation, setCurrentStation] = useState<number | null>(null);
  const [activeGenre, setActiveGenre] = useState("Все");
  const [volume, setVolume] = useState(70);

  const playStation = (id: number) => {
    setStations(prev => prev.map(s => ({ ...s, isPlaying: s.id === id ? !s.isPlaying : false })));
    setCurrentStation(id === currentStation ? null : id);
  };

  const filtered = stations.filter(s => activeGenre === "Все" || s.genre === activeGenre);
  const current = stations.find(s => s.id === currentStation);

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Радио</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Icon name="Radio" size={14} className="text-primary" />
          {stations.reduce((acc, s) => acc + s.listeners, 0).toLocaleString()} слушают сейчас
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
        {filtered.map((station, i) => (
          <button
            key={station.id}
            onClick={() => playStation(station.id)}
            className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all border ${
              station.isPlaying ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/40 bg-card"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} ${station.isPlaying ? "opacity-20" : "opacity-5"} transition-opacity`} />
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center font-bold text-white text-lg mb-3`}>
              {station.isPlaying ? (
                <div className="flex gap-0.5 items-end h-5">
                  {[1, 2, 3, 4].map(b => (
                    <div
                      key={b}
                      className="w-0.5 bg-white rounded-full animate-bounce"
                      style={{ height: `${Math.random() * 8 + 6}px`, animationDelay: `${b * 0.1}s` }}
                    />
                  ))}
                </div>
              ) : station.cover}
            </div>
            <p className="relative font-semibold text-sm truncate">{station.name}</p>
            <p className="relative text-xs text-muted-foreground truncate">{station.genre}</p>
            <div className="relative flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Icon name="Headphones" size={11} />
              {station.listeners.toLocaleString()}
            </div>
          </button>
        ))}
      </div>

      {/* Player */}
      {currentStation && current && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3 z-30">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[stations.indexOf(current) % gradients.length]} flex items-center justify-center`}>
              <div className="flex gap-0.5 items-end h-4">
                {[1, 2, 3].map(b => (
                  <div key={b} className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: `${b * 4}px`, animationDelay: `${b * 0.15}s` }} />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{current.name}</p>
              <p className="text-xs text-muted-foreground">{current.genre} · {current.listeners.toLocaleString()} слушателей</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Icon name="Volume2" size={16} className="text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-20 accent-primary"
                />
              </div>
              <button
                onClick={() => playStation(currentStation)}
                className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center"
              >
                <Icon name={current.isPlaying ? "Square" : "Play"} size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

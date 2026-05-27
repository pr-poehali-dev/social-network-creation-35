import { useState } from "react";
import { COMMUNITIES } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const categories = ["Все", "Творчество", "Технологии", "Музыка", "Спорт", "Образ жизни"];

export default function Communities() {
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [tab, setTab] = useState<"all" | "my">("all");

  const toggleJoin = (id: number) => {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined } : c));
  };

  const filtered = communities
    .filter(c => tab === "my" ? c.joined : true)
    .filter(c => activeCategory === "Все" || c.category === activeCategory);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Сообщества</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {([["all", "Все сообщества"], ["my", "Мои сообщества"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              activeCategory === cat ? "gradient-bg text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Icon name="Users" size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Сообществ не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
              <div className="h-16 gradient-bg opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="p-4 -mt-6">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center font-bold text-white text-lg mb-3 border-2 border-card">
                  {c.avatar}
                </div>
                <h3 className="font-semibold text-sm">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-muted-foreground">
                    <Icon name="Users" size={12} className="inline mr-1" />
                    {(c.members / 1000).toFixed(1)}K участников
                  </div>
                  <button
                    onClick={() => toggleJoin(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      c.joined ? "border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" : "gradient-bg text-white"
                    }`}
                  >
                    {c.joined ? "Выйти" : "Вступить"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import Icon from "@/components/ui/icon";
import { RECOMMENDED_USERS, COMMUNITIES, CHANNELS } from "@/data/mockData";

const categories = ["Все", "Люди", "Сообщества", "Каналы", "Посты", "Музыка"];

const trending = ["#TypeScript", "#ai2025", "#дизайн", "#музыка", "#спорт", "#путешествия", "#кино", "#мода"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Поиск</h1>

      {/* Search input */}
      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Люди, сообщества, посты..."
          className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeCategory === cat ? "gradient-bg text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {!query ? (
        <div className="space-y-5">
          {/* Trending */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              В тренде сейчас
            </h3>
            <div className="flex flex-wrap gap-2">
              {trending.map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 bg-secondary rounded-xl text-sm hover:bg-primary/20 hover:text-primary transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* People */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Icon name="Users" size={16} className="text-accent" />
              Популярные люди
            </h3>
            <div className="space-y-3">
              {RECOMMENDED_USERS.map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.bio} · {(user.followers / 1000).toFixed(1)}K подписчиков</p>
                  </div>
                  <button className="text-xs px-3 py-1.5 gradient-bg text-white rounded-lg font-medium">
                    {user.isFollowing ? "Подписан" : "Подписаться"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Communities */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Icon name="Globe" size={16} className="text-primary" />
              Популярные сообщества
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMUNITIES.slice(0, 4).map(c => (
                <div key={c.id} className="bg-secondary rounded-xl p-3 cursor-pointer hover:bg-primary/10 transition-all">
                  <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-xs font-bold text-white mb-2">
                    {c.avatar}
                  </div>
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{(c.members / 1000).toFixed(1)}K участников</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Результаты по запросу «{query}»:</p>
          {RECOMMENDED_USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase())).map(user => (
            <div key={user.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.username} · {user.bio}</p>
              </div>
            </div>
          ))}
          {COMMUNITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map(c => (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-sm font-bold text-white">
                {c.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">Сообщество · {(c.members / 1000).toFixed(1)}K участников</p>
              </div>
            </div>
          ))}
          {CHANNELS.filter(ch => ch.name.toLowerCase().includes(query.toLowerCase())).map(ch => (
            <div key={ch.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-sm font-bold text-white">
                {ch.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{ch.name}</p>
                <p className="text-xs text-muted-foreground">Канал · {(ch.subscribers / 1000).toFixed(1)}K подписчиков</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

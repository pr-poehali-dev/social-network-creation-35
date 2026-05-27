import { useState } from "react";
import { CHANNELS } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const channelPosts = [
  { id: 1, channel: "TechWave", avatar: "TW", text: "GPT-5 уже меняет разработку сильнее, чем мы думали. 10 кейсов где AI написал код лучше джуна 🤖", time: "1 час назад", views: 12400, likes: 1023 },
  { id: 2, channel: "Волна Музыка", avatar: "ВМ", text: "Новый плейлист «Вечерний дрифт» уже доступен! 32 трека для ночных поездок 🌙", time: "30 мин назад", views: 8900, likes: 567 },
  { id: 3, channel: "Новости мира", avatar: "НМ", text: "Главные события дня: технологии, экономика, культура — всё за 5 минут чтения 📰", time: "5 мин назад", views: 45600, likes: 2341 },
];

export default function Channels() {
  const [channels, setChannels] = useState(CHANNELS.map(c => ({ ...c, subscribed: false })));
  const [tab, setTab] = useState<"feed" | "catalog">("feed");

  const toggleSub = (id: number) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, subscribed: !c.subscribed } : c));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Каналы</h1>

      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {([["feed", "Лента каналов"], ["catalog", "Каталог"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <div className="space-y-3">
          {channelPosts.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-xs font-bold text-white">
                  {post.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{post.channel}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                <span className="flex items-center gap-1"><Icon name="Eye" size={13} />{(post.views / 1000).toFixed(1)}K</span>
                <span className="flex items-center gap-1"><Icon name="Heart" size={13} />{post.likes.toLocaleString()}</span>
                <button className="ml-auto text-muted-foreground hover:text-primary transition-colors">
                  <Icon name="Share2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "catalog" && (
        <div className="space-y-3">
          {channels.map(ch => (
            <div key={ch.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center font-bold text-white flex-shrink-0">
                {ch.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm">{ch.name}</p>
                  {ch.verified && <Icon name="BadgeCheck" size={14} className="text-accent" />}
                </div>
                <p className="text-xs text-muted-foreground">{ch.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{(ch.subscribers / 1000).toFixed(0)}K подписчиков · {ch.lastPost}</p>
              </div>
              <button
                onClick={() => toggleSub(ch.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                  ch.subscribed ? "border border-border hover:bg-secondary" : "gradient-bg text-white"
                }`}
              >
                {ch.subscribed ? "Отписаться" : "Подписаться"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

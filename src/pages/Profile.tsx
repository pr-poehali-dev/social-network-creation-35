import { useState } from "react";
import Icon from "@/components/ui/icon";
import { POSTS } from "@/data/mockData";

const tabs = ["Посты", "Медиа", "Лайки", "Подписки", "Подписчики"] as const;
type Tab = typeof tabs[number];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("Посты");
  const [following, setFollowing] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Cover */}
      <div className="relative">
        <div className="h-36 rounded-2xl gradient-bg opacity-60" />
        <div className="absolute -bottom-6 left-4">
          <div className="w-20 h-20 rounded-full gradient-bg border-4 border-background flex items-center justify-center text-2xl font-bold text-white">
            АИ
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <button className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-foreground flex items-center gap-1.5">
            <Icon name="Edit3" size={13} />
            Редактировать
          </button>
        </div>
      </div>

      {/* Profile info */}
      <div className="pt-8 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Алекс Иванов</h1>
            <p className="text-muted-foreground text-sm">@alexivan</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors">
              <Icon name="Share2" size={16} />
            </button>
            <button
              onClick={() => setFollowing(!following)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${following ? "border border-border hover:bg-secondary" : "gradient-bg text-white"}`}
            >
              {following ? "Подписан" : "Подписаться"}
            </button>
          </div>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">
          Фронтенд разработчик, люблю дизайн и музыку 🎨 Снимаю видео и пишу код каждый день ✨
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Icon name="MapPin" size={14} />Москва</span>
          <span className="flex items-center gap-1"><Icon name="Link" size={14} />alexivan.dev</span>
          <span className="flex items-center gap-1"><Icon name="Calendar" size={14} />С апреля 2024</span>
        </div>

        {/* Stats */}
        <div className="flex gap-6 pt-1">
          {[
            { label: "Постов", value: "142" },
            { label: "Подписчиков", value: "2.4K" },
            { label: "Подписок", value: "318" },
          ].map(stat => (
            <button key={stat.label} className="text-left hover:opacity-70 transition-opacity">
              <span className="font-bold text-base">{stat.value}</span>
              <span className="text-sm text-muted-foreground ml-1.5">{stat.label}</span>
            </button>
          ))}
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          {["Ранний пользователь", "Активный автор", "Топ-50"].map(badge => (
            <span key={badge} className="text-xs px-2.5 py-1 rounded-full gradient-border text-foreground/80">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts tab */}
      {activeTab === "Посты" && (
        <div className="space-y-3">
          {POSTS.slice(0, 3).map(post => (
            <div key={post.id} className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <p className="text-sm leading-relaxed">{post.content}</p>
              {post.tags && (
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.map(tag => <span key={tag} className="text-xs text-primary">#{tag}</span>)}
                </div>
              )}
              <div className="flex gap-4 text-xs text-muted-foreground pt-1 border-t border-border">
                <span className="flex items-center gap-1"><Icon name="Heart" size={13} />{post.likes}</span>
                <span className="flex items-center gap-1"><Icon name="MessageCircle" size={13} />{post.comments}</span>
                <span className="flex items-center gap-1"><Icon name="Repeat2" size={13} />{post.reposts}</span>
                <span className="ml-auto">{post.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab !== "Посты" && (
        <div className="py-16 text-center text-muted-foreground">
          <Icon name="Package" size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Здесь пока ничего нет</p>
        </div>
      )}
    </div>
  );
}

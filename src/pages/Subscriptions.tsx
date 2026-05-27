import { useState } from "react";
import { RECOMMENDED_USERS } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const allUsers = [
  ...RECOMMENDED_USERS,
  { id: 5, name: "Дима Фото", username: "@dimaphoto", avatar: "ДФ", followers: 7800, isFollowing: true, bio: "Пейзажная фотография" },
  { id: 6, name: "Маша Кук", username: "@mashacook", avatar: "МК", followers: 15600, isFollowing: true, bio: "Рецепты и гастрономия" },
  { id: 7, name: "Артём Music", username: "@artemmusic", avatar: "АМ", followers: 42000, isFollowing: true, bio: "Музыкант, продюсер" },
  { id: 8, name: "Vlog Life", username: "@vloglife", avatar: "VL", followers: 93400, isFollowing: false, bio: "Влогер, путешественник" },
];

export default function Subscriptions() {
  const [users, setUsers] = useState(allUsers);
  const [tab, setTab] = useState<"following" | "followers" | "recommended">("following");

  const toggle = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
  };

  const following = users.filter(u => u.isFollowing);
  const recommended = users.filter(u => !u.isFollowing);

  const displayed = tab === "following" ? following : tab === "followers" ? [...following].reverse() : recommended;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Подписки</h1>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {([
          ["following", `Подписки (${following.length})`],
          ["followers", `Подписчики (${following.length})`],
          ["recommended", "Рекомендации"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              tab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Icon name="UserX" size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Здесь пока никого нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(user => (
            <div key={user.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center font-bold text-white flex-shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.username}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user.bio} · {(user.followers / 1000).toFixed(1)}K подписчиков</p>
              </div>
              <button
                onClick={() => toggle(user.id)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                  user.isFollowing ? "border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" : "gradient-bg text-white"
                }`}
              >
                {user.isFollowing ? "Отписаться" : "Подписаться"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

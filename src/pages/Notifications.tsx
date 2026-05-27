import { useState } from "react";
import { NOTIFICATIONS, type Notification } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const avatarColors: Record<string, string> = {
  КС: "from-pink-500 to-purple-600",
  ДП: "from-blue-500 to-cyan-400",
  МВ: "from-orange-500 to-red-500",
  TW: "from-cyan-500 to-blue-600",
  АК: "from-green-500 to-teal-400",
  SL: "from-lime-500 to-green-500",
  КД: "from-violet-500 to-indigo-500",
};

const notifIcon: Record<Notification["type"], { icon: string; color: string }> = {
  like: { icon: "Heart", color: "text-red-500" },
  follow: { icon: "UserPlus", color: "text-blue-400" },
  comment: { icon: "MessageCircle", color: "text-green-400" },
  repost: { icon: "Repeat2", color: "text-cyan-400" },
  mention: { icon: "AtSign", color: "text-yellow-400" },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = filter === "unread" ? notifs.filter(n => !n.read) : notifs;
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Уведомления</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full gradient-bg text-xs font-bold text-white">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary hover:text-accent transition-colors">
            Прочитать все
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {([["all", "Все"], ["unread", "Непрочитанные"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${filter === key ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Icon name="Bell" size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Нет уведомлений</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(notif => {
            const { icon, color } = notifIcon[notif.type];
            return (
              <button
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left hover:border-primary/30 ${
                  !notif.read ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[notif.avatar] ?? "from-violet-500 to-purple-600"} flex items-center justify-center text-sm font-bold text-white`}>
                    {notif.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center ${color}`}>
                    <Icon name={icon} size={11} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{notif.user}</span>
                    {" "}{notif.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import Icon from "@/components/ui/icon";

const myGroups = [
  { id: 1, name: "Команда фронтенда", avatar: "КФ", members: 12, type: "Закрытая", lastActivity: "5 мин назад", unread: 3 },
  { id: 2, name: "Дизайн-клуб", avatar: "ДК", members: 8, type: "Закрытая", lastActivity: "1 час назад", unread: 0 },
  { id: 3, name: "Утренние пробежки", avatar: "УП", members: 24, type: "Открытая", lastActivity: "2 часа назад", unread: 1 },
];

const suggestedGroups = [
  { id: 4, name: "React Developers", avatar: "РД", members: 156, type: "Открытая", description: "Обсуждаем React, хуки и всё такое" },
  { id: 5, name: "Книжный клуб", avatar: "КК", members: 43, type: "Закрытая", description: "Читаем и обсуждаем книги вместе" },
  { id: 6, name: "Мемы и юмор", avatar: "МЮ", members: 289, type: "Открытая", description: "Делимся смешным контентом" },
];

export default function Groups() {
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Группы</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold"
        >
          <Icon name="Plus" size={16} />
          Создать группу
        </button>
      </div>

      {/* Create group form */}
      {showCreate && (
        <div className="bg-card border border-primary/30 rounded-2xl p-4 space-y-3">
          <h3 className="font-semibold text-sm">Новая группа</h3>
          <input
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="Название группы..."
            className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-secondary transition-colors">
              Отмена
            </button>
            <button className="px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold disabled:opacity-40" disabled={!groupName.trim()}>
              Создать
            </button>
          </div>
        </div>
      )}

      {/* My groups */}
      <div>
        <h2 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">Мои группы</h2>
        <div className="space-y-2">
          {myGroups.map(g => (
            <div key={g.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all cursor-pointer">
              <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center font-bold text-white flex-shrink-0">
                {g.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{g.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${g.type === "Закрытая" ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                    {g.type === "Закрытая" ? <Icon name="Lock" size={10} className="inline mr-1" /> : <Icon name="Globe" size={10} className="inline mr-1" />}
                    {g.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{g.members} участников · {g.lastActivity}</p>
              </div>
              {g.unread > 0 && (
                <span className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-white">
                  {g.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested */}
      <div>
        <h2 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">Возможно интересно</h2>
        <div className="space-y-2">
          {suggestedGroups.map(g => (
            <div key={g.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all">
              <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center font-bold text-white flex-shrink-0">
                {g.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{g.name}</p>
                <p className="text-xs text-muted-foreground">{g.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{g.members} участников · {g.type}</p>
              </div>
              <button className="px-3 py-1.5 rounded-xl text-xs gradient-bg text-white font-semibold flex-shrink-0">
                Вступить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

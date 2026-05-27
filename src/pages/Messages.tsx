import { useState } from "react";
import { MESSAGES } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const avatarColors: Record<string, string> = {
  КС: "from-pink-500 to-purple-600",
  ДП: "from-blue-500 to-cyan-400",
  МВ: "from-orange-500 to-red-500",
  TW: "from-cyan-500 to-blue-600",
  АК: "from-green-500 to-teal-400",
};

const chatMessages = [
  { id: 1, from: "them", text: "Привет! Видел твой пост про дизайн?", time: "14:20" },
  { id: 2, from: "me", text: "Да! Долго делал, но результат понравился 😊", time: "14:21" },
  { id: 3, from: "them", text: "Ого, это просто огонь! 🔥 Покажешь процесс?", time: "14:22" },
  { id: 4, from: "me", text: "Конечно, сделаю пост с разбором", time: "14:23" },
];

export default function Messages() {
  const [selected, setSelected] = useState<number | null>(null);
  const [input, setInput] = useState("");

  const selectedUser = MESSAGES.find(m => m.id === selected);

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Conversations list */}
      <div className={`${selected ? "hidden md:flex" : "flex"} flex-col w-full md:w-72 flex-shrink-0 bg-card border border-border rounded-2xl overflow-hidden`}>
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-base">Сообщения</h2>
          <div className="relative mt-3">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Поиск..." className="w-full bg-secondary rounded-xl pl-8 pr-3 py-2 text-sm outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MESSAGES.map(msg => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors ${selected === msg.id ? "bg-secondary" : ""}`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[msg.avatar] ?? "from-violet-500 to-purple-600"} flex items-center justify-center text-sm font-bold text-white`}>
                  {msg.avatar}
                </div>
                {msg.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{msg.name}</span>
                  <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">{msg.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{msg.lastMessage}</p>
              </div>
              {msg.unread > 0 && (
                <span className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  {msg.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {selected && selectedUser ? (
        <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <button onClick={() => setSelected(null)} className="md:hidden text-muted-foreground hover:text-foreground mr-1">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div className="relative">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[selectedUser.avatar] ?? "from-violet-500 to-purple-600"} flex items-center justify-center text-sm font-bold text-white`}>
                {selectedUser.avatar}
              </div>
              {selectedUser.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />}
            </div>
            <div>
              <p className="font-semibold text-sm">{selectedUser.name}</p>
              <p className="text-xs text-green-500">{selectedUser.online ? "онлайн" : "был(а) недавно"}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground">
                <Icon name="Phone" size={16} />
              </button>
              <button className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground">
                <Icon name="Video" size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${msg.from === "me" ? "gradient-bg text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-white/60 text-right" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-border">
            <button className="text-muted-foreground hover:text-primary transition-colors p-1">
              <Icon name="Paperclip" size={18} />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Написать сообщение..."
              className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={e => e.key === "Enter" && setInput("")}
            />
            <button className="text-muted-foreground hover:text-primary transition-colors p-1">
              <Icon name="Smile" size={18} />
            </button>
            <button
              className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
              disabled={!input.trim()}
              onClick={() => setInput("")}
            >
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-card border border-border rounded-2xl">
          <div className="text-center text-muted-foreground">
            <Icon name="MessageCircle" size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Выбери диалог, чтобы начать общение</p>
          </div>
        </div>
      )}
    </div>
  );
}

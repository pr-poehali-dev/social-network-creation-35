import { useState } from "react";
import Icon from "@/components/ui/icon";
import { POSTS } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const tabs = ["Посты", "Медиа", "Лайки", "Подписки", "Подписчики", "Настройки"] as const;
type Tab = typeof tabs[number];

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Посты");
  const [following, setFollowing] = useState(false);

  // Смена пароля
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPassword2) { setPwdError("Пароли не совпадают"); return; }
    if (newPassword.length < 6) { setPwdError("Минимум 6 символов"); return; }
    setPwdLoading(true); setPwdError(""); setPwdSuccess(false);
    try {
      await api.changePassword(newPassword);
      setPwdSuccess(true);
      setNewPassword(""); setNewPassword2("");
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err: unknown) {
      setPwdError(err instanceof Error ? err.message : "Ошибка");
    } finally { setPwdLoading(false); }
  };

  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";
  const displayName = user?.name ?? "Пользователь";
  const displayUsername = user?.username ?? "@user";

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Cover */}
      <div className="relative">
        <div className="h-36 rounded-2xl gradient-bg opacity-60" />
        <div className="absolute -bottom-6 left-4">
          <div className="w-20 h-20 rounded-full gradient-bg border-4 border-background flex items-center justify-center text-2xl font-bold text-white">
            {initials}
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
            <h1 className="text-xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground text-sm">{displayUsername}</p>
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

      {activeTab === "Настройки" && (
        <div className="max-w-sm space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Icon name="Lock" size={15} className="text-primary" />
              Сменить пароль
            </h3>
            {pwdError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                <Icon name="AlertCircle" size={14} />{pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-3 py-2">
                <Icon name="CheckCircle" size={14} />Пароль успешно изменён!
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Новый пароль</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="w-full bg-secondary border border-border rounded-xl px-3 pr-10 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Icon name={showPass ? "EyeOff" : "Eye"} size={15} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Повтори пароль</label>
                <input type={showPass ? "text" : "password"} value={newPassword2} onChange={e => setNewPassword2(e.target.value)}
                  placeholder="Повтори новый пароль"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground" />
              </div>
              <button type="submit" disabled={pwdLoading || !newPassword || !newPassword2}
                className="w-full py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2">
                {pwdLoading && <Icon name="Loader" size={15} className="animate-spin" />}
                {pwdLoading ? "Сохраняю..." : "Сохранить пароль"}
              </button>
            </form>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
            <h3 className="font-semibold text-sm">Аккаунт</h3>
            <p className="text-xs text-muted-foreground">Email: {user?.email}</p>
            <p className="text-xs text-muted-foreground">Имя пользователя: {user?.username}</p>
          </div>
        </div>
      )}

      {activeTab !== "Посты" && activeTab !== "Настройки" && (
        <div className="py-16 text-center text-muted-foreground">
          <Icon name="Package" size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Здесь пока ничего нет</p>
        </div>
      )}
    </div>
  );
}
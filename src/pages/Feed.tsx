import { useState } from "react";
import { POSTS, RECOMMENDED_USERS, type Post } from "@/data/mockData";
import Icon from "@/components/ui/icon";

const avatarColors: Record<string, string> = {
  КС: "from-pink-500 to-purple-600",
  ДП: "from-blue-500 to-cyan-400",
  ВМ: "from-purple-600 to-pink-500",
  МВ: "from-orange-500 to-red-500",
  АК: "from-green-500 to-teal-400",
  TW: "from-cyan-500 to-blue-600",
};

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const gradient = avatarColors[initials] ?? "from-violet-500 to-purple-600";
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

function PostCard({ post, onLike }: { post: Post; onLike: (id: number) => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3 hover:border-primary/30 transition-all duration-200">
      {post.isRecommended && (
        <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
          <Icon name="Sparkles" size={12} />
          Рекомендуем
        </div>
      )}
      <div className="flex items-start gap-3">
        <Avatar initials={post.avatar} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{post.author}</span>
            <span className="text-xs text-muted-foreground">{post.username}</span>
            <span className="text-xs text-muted-foreground ml-auto">{post.time}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{post.content}</p>
          {post.tags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-primary cursor-pointer hover:text-accent transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 pt-1 border-t border-border">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 text-xs transition-all hover:scale-105 ${post.liked ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`}
        >
          <Icon name={post.liked ? "Heart" : "Heart"} size={16} className={post.liked ? "fill-current" : ""} />
          {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
          <Icon name="MessageCircle" size={16} />
          {post.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors">
          <Icon name="Repeat2" size={16} />
          {post.reposts}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary ml-auto transition-colors">
          <Icon name="Share2" size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [activeTab, setActiveTab] = useState<"all" | "recommended" | "subscriptions">("all");
  const [postText, setPostText] = useState("");

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const filteredPosts = activeTab === "recommended"
    ? posts.filter(p => p.isRecommended)
    : activeTab === "subscriptions"
      ? posts.filter(p => !p.isRecommended)
      : posts;

  return (
    <div className="flex gap-6">
      {/* Main feed */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* New post */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              АИ
            </div>
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="Что происходит? Поделись с волной..."
              className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground min-h-[60px]"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex gap-3">
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Image" size={18} />
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Smile" size={18} />
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="MapPin" size={18} />
              </button>
            </div>
            <button
              className="px-4 py-1.5 rounded-xl text-sm font-semibold gradient-bg text-white disabled:opacity-40 transition-opacity"
              disabled={!postText.trim()}
            >
              Опубликовать
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
          {([["all", "Все"], ["recommended", "Рекомендации"], ["subscriptions", "Подписки"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>

      {/* Right sidebar */}
      <aside className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0">
        {/* Trending */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            В тренде
          </h3>
          <div className="space-y-3">
            {["#TypeScript", "#ai2025", "#дизайн", "#музыка", "#спорт"].map((tag, i) => (
              <div key={tag} className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-xs text-muted-foreground">#{i + 1} в тренде</p>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{tag}</p>
                </div>
                <span className="text-xs text-muted-foreground">{(Math.random() * 10 + 1).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended users */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Icon name="UserPlus" size={16} className="text-accent" />
            Рекомендуем подписаться
          </h3>
          <div className="space-y-3">
            {RECOMMENDED_USERS.map(user => (
              <div key={user.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
                </div>
                <button className={`text-xs px-2 py-1 rounded-lg font-medium transition-all ${user.isFollowing ? "bg-secondary text-foreground" : "gradient-bg text-white"}`}>
                  {user.isFollowing ? "Подписан" : "Подписаться"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

import { useState } from "react";
import { POSTS, type Post } from "@/data/mockData";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

function PostCard({ post, onLike }: { post: Post; onLike: (id: number) => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {post.avatar}
        </div>
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
                <span key={tag} className="text-xs text-primary cursor-pointer hover:text-accent transition-colors">#{tag}</span>
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
          <Icon name="Heart" size={16} className={post.liked ? "fill-current" : ""} />
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
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [postText, setPostText] = useState("");

  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: user?.name ?? "Пользователь",
      username: user?.username ?? "@user",
      avatar: initials,
      time: "только что",
      content: postText.trim(),
      likes: 0,
      comments: 0,
      reposts: 0,
      liked: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setPostText("");
  };

  return (
    <div className="space-y-4 max-w-xl">
      {/* Форма нового поста */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <textarea
            value={postText}
            onChange={e => setPostText(e.target.value)}
            placeholder="Что происходит? Поделись с друзьями..."
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
          </div>
          <button
            onClick={handlePost}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold gradient-bg text-white disabled:opacity-40 transition-opacity"
            disabled={!postText.trim()}
          >
            Опубликовать
          </button>
        </div>
      </div>

      {/* Посты */}
      {posts.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-muted-foreground">
          <Icon name="Feather" size={48} className="opacity-20" />
          <p className="text-sm font-medium">Лента пуста</p>
          <p className="text-xs text-center">Напиши первый пост — и все друзья его увидят</p>
        </div>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} onLike={handleLike} />)
      )}
    </div>
  );
}

export interface Post {
  id: number;
  author: string;
  username: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
  liked: boolean;
  isRecommended?: boolean;
  tags?: string[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  isFollowing: boolean;
  bio?: string;
}

export interface Message {
  id: number;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Notification {
  id: number;
  type: "like" | "follow" | "comment" | "repost" | "mention";
  user: string;
  avatar: string;
  text: string;
  time: string;
  read: boolean;
}

export const POSTS: Post[] = [
  {
    id: 1,
    author: "Кира Смирнова",
    username: "@kira_s",
    avatar: "КС",
    time: "2 мин назад",
    content: "Только что закончила новый арт! Это был долгий процесс, но результат стоит каждой потраченной минуты 🎨✨ Что думаете?",
    likes: 248,
    comments: 34,
    reposts: 12,
    liked: false,
    tags: ["арт", "иллюстрация", "творчество"],
  },
  {
    id: 2,
    author: "Даниил Петров",
    username: "@danpetrov",
    avatar: "ДП",
    time: "15 мин назад",
    content: "Лайфхак дня: если хочешь прокрастинировать с пользой — слушай подкасты. За неделю прошёл курс по дизайну просто на фоне 🎧",
    likes: 512,
    comments: 67,
    reposts: 89,
    liked: true,
    isRecommended: true,
    tags: ["лайфхак", "саморазвитие"],
  },
  {
    id: 3,
    author: "Волна Музыка",
    username: "@volna_music",
    avatar: "ВМ",
    time: "1 час назад",
    content: "Новый плейлист «Вечерний дрифт» уже доступен! 32 трека для ночных поездок и задумчивых вечеров 🌙",
    likes: 1204,
    comments: 156,
    reposts: 341,
    liked: false,
    isRecommended: true,
    tags: ["музыка", "плейлист", "атмосфера"],
  },
  {
    id: 4,
    author: "Максим Волков",
    username: "@mxwolf",
    avatar: "МВ",
    time: "2 часа назад",
    content: "Вопрос к разработчикам: используете TypeScript в 2025? Или всё ещё на чистом JS? Спорим в комментах 👇",
    likes: 87,
    comments: 203,
    reposts: 15,
    liked: false,
    tags: ["разработка", "typescript", "js"],
  },
  {
    id: 5,
    author: "Аня Козлова",
    username: "@annakoz",
    avatar: "АК",
    time: "3 часа назад",
    content: "Сегодня впервые попробовала сёрфинг. Упала раз 20, встала 21 🏄‍♀️ Жизнь — как волна, главное не бояться нырять!",
    likes: 634,
    comments: 45,
    reposts: 28,
    liked: false,
    tags: ["спорт", "сёрфинг", "жизнь"],
  },
  {
    id: 6,
    author: "TechWave канал",
    username: "@techwave",
    avatar: "TW",
    time: "5 часов назад",
    content: "GPT-5 уже меняет разработку сильнее, чем мы думали. Собрал 10 кейсов, где AI написал код лучше джуна 🤖 Тред ниже:",
    likes: 2341,
    comments: 412,
    reposts: 678,
    liked: false,
    isRecommended: true,
    tags: ["ai", "разработка", "технологии"],
  },
];

export const RECOMMENDED_USERS: User[] = [
  { id: 1, name: "Кира Арт", username: "@kira_art", avatar: "КА", followers: 12400, isFollowing: false, bio: "Художник, иллюстратор" },
  { id: 2, name: "SportLife", username: "@sportlife", avatar: "SL", followers: 8900, isFollowing: false, bio: "Фитнес и здоровье" },
  { id: 3, name: "Коля Dev", username: "@kolyacode", avatar: "КД", followers: 5600, isFollowing: true, bio: "Full-stack разработчик" },
  { id: 4, name: "Лена Фото", username: "@lenaphoto", avatar: "ЛФ", followers: 34200, isFollowing: false, bio: "Фотограф, путешествия" },
];

export const MESSAGES: Message[] = [
  { id: 1, name: "Кира Смирнова", username: "@kira_s", avatar: "КС", lastMessage: "Ого, это просто огонь! 🔥", time: "2 мин", unread: 2, online: true },
  { id: 2, name: "Даниил Петров", username: "@danpetrov", avatar: "ДП", lastMessage: "Ты видел новый дроп?", time: "14 мин", unread: 0, online: true },
  { id: 3, name: "Максим Волков", username: "@mxwolf", avatar: "МВ", lastMessage: "Окей, созвонимся завтра", time: "1 час", unread: 0, online: false },
  { id: 4, name: "TechWave", username: "@techwave", avatar: "TW", lastMessage: "Спасибо за репост!", time: "2 часа", unread: 1, online: false },
  { id: 5, name: "Аня Козлова", username: "@annakoz", avatar: "АК", lastMessage: "Хочешь на серфинг?", time: "вчера", unread: 0, online: true },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "like", user: "Кира Смирнова", avatar: "КС", text: "оценила твой пост", time: "2 мин назад", read: false },
  { id: 2, type: "follow", user: "Даниил Петров", avatar: "ДП", text: "подписался на тебя", time: "10 мин назад", read: false },
  { id: 3, type: "comment", user: "Максим Волков", avatar: "МВ", text: "прокомментировал: «Согласен на 100%!»", time: "25 мин назад", read: false },
  { id: 4, type: "repost", user: "TechWave", avatar: "TW", text: "сделал репост твоей записи", time: "1 час назад", read: false },
  { id: 5, type: "mention", user: "Аня Козлова", avatar: "АК", text: "упомянула тебя в посте", time: "2 часа назад", read: true },
  { id: 6, type: "like", user: "SportLife", avatar: "SL", text: "оценил твой пост", time: "3 часа назад", read: true },
  { id: 7, type: "follow", user: "Коля Dev", avatar: "КД", text: "подписался на тебя", time: "вчера", read: true },
];

export const COMMUNITIES = [
  { id: 1, name: "Дизайн & Арт", avatar: "ДА", members: 45200, description: "Творчество без границ", joined: true, category: "Творчество" },
  { id: 2, name: "Технологии", avatar: "ТХ", members: 128000, description: "IT, AI и будущее", joined: true, category: "Технологии" },
  { id: 3, name: "Музыкальный клуб", avatar: "МК", members: 23400, description: "Для меломанов", joined: false, category: "Музыка" },
  { id: 4, name: "Путешествия", avatar: "ПТ", members: 67800, description: "Весь мир — дом", joined: false, category: "Образ жизни" },
  { id: 5, name: "Фитнес & Спорт", avatar: "ФС", members: 34500, description: "Активная жизнь", joined: false, category: "Спорт" },
  { id: 6, name: "Фото & Видео", avatar: "ФВ", members: 89200, description: "Визуальный контент", joined: true, category: "Творчество" },
];

export const CHANNELS = [
  { id: 1, name: "TechWave", avatar: "TW", subscribers: 128000, description: "Технологии и IT", verified: true, lastPost: "1 час назад" },
  { id: 2, name: "Волна Музыка", avatar: "ВМ", subscribers: 56000, description: "Музыка и плейлисты", verified: true, lastPost: "30 мин назад" },
  { id: 3, name: "Дейли Дизайн", avatar: "ДД", subscribers: 34000, description: "Вдохновение каждый день", verified: false, lastPost: "2 часа назад" },
  { id: 4, name: "Новости мира", avatar: "НМ", subscribers: 890000, description: "Главное за день", verified: true, lastPost: "5 мин назад" },
];

export const TRACKS = [
  { id: 1, title: "Neon Dreams", artist: "SynthWave", duration: "3:42", cover: "НД", genre: "Synthwave", plays: 145000 },
  { id: 2, title: "Midnight City", artist: "Urban Beat", duration: "4:15", cover: "МС", genre: "Electronic", plays: 234000 },
  { id: 3, title: "Волны", artist: "Кира Смирнова", duration: "3:28", cover: "ВЛ", genre: "Indie Pop", plays: 89000 },
  { id: 4, title: "Digital Rain", artist: "CodeMusic", duration: "5:01", cover: "ДР", genre: "Ambient", plays: 67000 },
  { id: 5, title: "Солнечный бриз", artist: "Lo-Fi Lab", duration: "2:55", cover: "СБ", genre: "Lo-Fi", plays: 312000 },
  { id: 6, title: "Aurora", artist: "NightSky", duration: "4:33", cover: "АР", genre: "Chill", plays: 198000 },
];

export const RADIO_STATIONS = [
  { id: 1, name: "Волна FM", genre: "Pop / Hits", listeners: 12400, cover: "ВФ", isPlaying: false },
  { id: 2, name: "Chill Zone", genre: "Lo-Fi / Ambient", listeners: 8900, cover: "ЧЗ", isPlaying: false },
  { id: 3, name: "Tech Beats", genre: "Electronic / Techno", listeners: 5600, cover: "ТБ", isPlaying: false },
  { id: 4, name: "Indie Space", genre: "Indie / Alternative", listeners: 3400, cover: "ИС", isPlaying: false },
  { id: 5, name: "Jazz Café", genre: "Jazz / Soul", listeners: 7800, cover: "ДК", isPlaying: false },
  { id: 6, name: "Rock Radio", genre: "Rock / Metal", listeners: 9200, cover: "РР", isPlaying: false },
];

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

export const POSTS: Post[] = [];

export const RECOMMENDED_USERS: User[] = [];

export const MESSAGES: Message[] = [];

export const NOTIFICATIONS: Notification[] = [];

export const COMMUNITIES = [];

export const CHANNELS = [];

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  genre: string;
  plays: number;
  url: string;
}

export interface RadioStation {
  id: number;
  name: string;
  genre: string;
  listeners: number;
  cover: string;
  isPlaying: boolean;
  url: string;
}

// Бесплатные треки с открытой лицензией CC (bensound.com)
export const TRACKS: Track[] = [
  { id: 1, title: "Acoustic Breeze", artist: "Benjamin Tissot", duration: "2:37", cover: "АБ", genre: "Acoustic", plays: 145000, url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3" },
  { id: 2, title: "Sunny", artist: "Benjamin Tissot", duration: "2:20", cover: "СН", genre: "Pop", plays: 234000, url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3" },
  { id: 3, title: "Creative Minds", artist: "Benjamin Tissot", duration: "2:48", cover: "КМ", genre: "Electronic", plays: 89000, url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3" },
  { id: 4, title: "Ukulele", artist: "Benjamin Tissot", duration: "2:06", cover: "УК", genre: "Indie", plays: 67000, url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3" },
  { id: 5, title: "Once Again", artist: "Benjamin Tissot", duration: "3:24", cover: "ОА", genre: "Chill", plays: 312000, url: "https://www.bensound.com/bensound-music/bensound-onceagain.mp3" },
  { id: 6, title: "Sweet", artist: "Benjamin Tissot", duration: "2:50", cover: "СВ", genre: "Pop", plays: 198000, url: "https://www.bensound.com/bensound-music/bensound-sweet.mp3" },
];

// Реальные российские онлайн-радиостанции (публичные mp3-стримы)
export const RADIO_STATIONS: RadioStation[] = [
  { id: 1, name: "Европа Плюс", genre: "Pop / Hits", listeners: 12400, cover: "ЕП", isPlaying: false, url: "https://ep256.hostingradio.ru/europaplus256.mp3" },
  { id: 2, name: "DFM", genre: "Electronic / Dance", listeners: 9200, cover: "ДФ", isPlaying: false, url: "https://dfm.hostingradio.ru/dfm96.aacp" },
  { id: 3, name: "Радио Рекорд", genre: "Electronic / Techno", listeners: 8100, cover: "РР", isPlaying: false, url: "https://radiorecord.hostingradio.ru/rr96.aacp" },
  { id: 4, name: "Радио Маяк", genre: "Разговорное / Хиты", listeners: 7800, cover: "МЯ", isPlaying: false, url: "https://icecast-vgtrk.cdnvideo.ru/mayakfm_mp3_128kbps" },
  { id: 5, name: "Вести FM", genre: "Новости", listeners: 5600, cover: "ВФ", isPlaying: false, url: "https://icecast-vgtrk.cdnvideo.ru/vestifm_mp3_128kbps" },
  { id: 6, name: "Юмор FM", genre: "Развлекательное", listeners: 4300, cover: "ЮФ", isPlaying: false, url: "https://humor.hostingradio.ru/humor96.aacp" },
];
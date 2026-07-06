export interface Author {
  name: string;
  role: string;
  avatar: string;
  slug?: string;
}

export interface AuthorItem {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  avatar: string;
  slug: string;
  articles?: number;
}

export interface LiveBlogItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  publishedAt: string;
}

export interface RedirectItem {
  id: string;
  fromPath: string;
  toPath: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  authorName: string;
  avatar: string;
  content: string;
  publishedAt: string;
}

export interface Article {
  id: string;
  slug?: string; // Dynamic SEO-friendly URL slug
  title: string;
  subtitle: string;
  content: string[];
  author: Author;
  publishedAt: string;
  readTime: string;
  category: string;
  tag: string;
  imageUrl: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isEditorsChoice?: boolean;
  isOpinion?: boolean;
  likes: number;
  aiInsights: string[];
  comments: Comment[];
}

export interface ShortItem {
  id: string;
  title: string;
  description: string;
  summary: string;
  videoUrl: string;
  imageUrl: string;
  duration: string;
  createdAt: string;
  views?: number;
  likes?: number;
}

export type Category = 
  | 'Home'
  | 'World'
  | 'Politics'
  | 'Business'
  | 'Technology'
  | 'Health'
  | 'Science'
  | 'Sports'
  | 'Culture'
  | 'Opinion'
  | 'Profile'
  | 'About'
  | 'Contact'
  | 'Privacy'
  | 'Terms'
  | 'Cookies'
  | 'Sitemap';

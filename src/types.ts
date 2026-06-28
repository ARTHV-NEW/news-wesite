export interface Author {
  name: string;
  role: string;
  avatar: string;
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

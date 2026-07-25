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

export interface CommentModerationItem {
  id: string;
  user: string;
  email: string;
  article: string;
  text: string;
  status: 'Pending' | 'Approved' | 'Spam' | 'Deleted';
  timestamp: string;
  createdAt: string;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  segment: string;
  content: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  sentToCount?: number;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  time: string;
  createdAt: string;
}

export interface BackupItem {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  size?: string;
  downloadUrl?: string;
}

export interface HomepageSettings {
  layout: string;
  breakingId: string;
  showLatest: boolean;
  updatedAt: string;
}

export interface SeoSettings {
  siteName: string;
  siteKeywords: string;
  updatedAt: string;
}

export interface NotificationSettings {
  slackIntegration: boolean;
  breakingWebPush: boolean;
  commentFlagReports: boolean;
  updatedAt: string;
}

export interface DailyDigestSubscriber {
  id: string;
  email: string;
  categories: string[];
  deliveryTime: string;
  format: string;
  createdAt: string;
}


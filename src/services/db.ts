import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { INITIAL_ARTICLES } from '../data/articles';
import { Article, Category } from '../types';

export interface MenuItem {
  id: string;
  label: string;
  link: string;
  order: number;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: string;
  createdAt: string;
}

export interface PageContent {
  id: string; // 'About' | 'Contact' | 'Privacy' | 'Terms' | 'Cookies' | 'Sitemap'
  title: string;
  content: string;
}

export interface AdBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  type: 'top' | 'sidebar' | 'inline';
  isActive: boolean;
}

export interface GeneralSettings {
  siteName: string;
  siteLogoText: string;
  siteSubtitle: string;
  tickerItems: string[];
  breakingNewsId?: string;
}

export interface ReaderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  bio?: string;
  avatarUrl?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
}

export interface TagItem {
  id: string;
  name: string;
}

// 1. Database Seeding Function
export async function seedDatabaseIfEmpty() {
  try {
    const articlesSnap = await getDocs(collection(db, 'articles'));
    if (!articlesSnap.empty) {
      console.log('Database already seeded. Checking for missing articles to sync...');
      const existingIds = new Set(articlesSnap.docs.map(d => d.id));
      for (const article of INITIAL_ARTICLES) {
        if (!existingIds.has(article.id)) {
          console.log(`Syncing missing article: ${article.title}`);
          await setDoc(doc(db, 'articles', article.id), article);
        }
      }
      return;
    }

    console.log('Seeding database with initial data...');

    // Seed Articles
    for (const article of INITIAL_ARTICLES) {
      await setDoc(doc(db, 'articles', article.id), article);
    }

    // Seed Menus
    const initialMenus: MenuItem[] = [
      { id: 'home', label: 'Home', link: 'Home', order: 1 },
      { id: 'world', label: 'World', link: 'World', order: 2 },
      { id: 'politics', label: 'Politics', link: 'Politics', order: 3 },
      { id: 'business', label: 'Business', link: 'Business', order: 4 },
      { id: 'technology', label: 'Technology', link: 'Technology', order: 5 },
      { id: 'health', label: 'Health', link: 'Health', order: 6 },
      { id: 'science', label: 'Science', link: 'Science', order: 7 },
      { id: 'sports', label: 'Sports', link: 'Sports', order: 8 },
      { id: 'culture', label: 'Culture', link: 'Culture', order: 9 },
      { id: 'opinion', label: 'Opinion', link: 'Opinion', order: 10 }
    ];
    for (const menu of initialMenus) {
      await setDoc(doc(db, 'menu', menu.id), menu);
    }

    // Seed Static Pages
    const initialPages: PageContent[] = [
      {
        id: 'About',
        title: 'About Us',
        content: 'PulseNews is an independent global media organization dedicated to objective, rigorous, and deep investigative journalism. We cover the stories that alter policy, drive economies, and shape future societies. Founded by visionary journalists, we believe in truth and accountability.'
      },
      {
        id: 'Contact',
        title: 'Contact Us',
        content: 'We would love to hear from you. For general inquiries, email info@pulsenews.com. For tips and news leads, securely contact tips@pulsenews.com. Our global headquarters is located in London, UK.'
      },
      {
        id: 'Privacy',
        title: 'Privacy Policy',
        content: 'Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and share information about you when you interact with PulseNews. We do not sell your personal data to third parties.'
      },
      {
        id: 'Terms',
        title: 'Terms of Use',
        content: 'By accessing or using PulseNews, you agree to be bound by these Terms of Use. All content on this platform is the property of PulseNews Media Group and is protected by international copyright laws.'
      },
      {
        id: 'Cookies',
        title: 'Cookie Settings',
        content: 'PulseNews uses cookies to improve your experience and deliver personalized content. You can manage your cookie preferences through your browser settings.'
      },
      {
        id: 'Sitemap',
        title: 'Sitemap',
        content: 'Navigate through PulseNews: Home, World, Politics, Business, Technology, Science, Sports, Culture, Opinion.'
      }
    ];
    for (const page of initialPages) {
      await setDoc(doc(db, 'pages', page.id), page);
    }

    // Seed Ads
    const initialAds: AdBanner[] = [
      {
        id: 'ad-sidebar',
        title: 'Pulse Premium Access',
        description: 'Unlock unlimited access to award-winning deep investigation and breaking newsletters.',
        imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&auto=format&fit=crop&q=80',
        targetUrl: '#',
        type: 'sidebar',
        isActive: true
      },
      {
        id: 'ad-top',
        title: 'Global Markets Premium Newsletter',
        description: 'Subscribe today and get 50% off of annual membership.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        targetUrl: '#',
        type: 'top',
        isActive: true
      }
    ];
    for (const ad of initialAds) {
      await setDoc(doc(db, 'ads', ad.id), ad);
    }

    // Seed Categories
    const initialCategories: CategoryItem[] = [
      { id: 'World', name: 'World', description: 'Global developments, international affairs and geopolitical events.' },
      { id: 'Politics', name: 'Politics', description: 'Government updates, policy debates, elections, and national decisions.' },
      { id: 'Business', name: 'Business', description: 'Financial markets, commerce trends, corporate decisions, and macroeconomics.' },
      { id: 'Technology', name: 'Technology', description: 'AI innovations, software, device launches, cyber security, and tech giants.' },
      { id: 'Health', name: 'Health', description: 'Medical research, healthcare systems, wellness updates, and clinical breakthroughs.' },
      { id: 'Science', name: 'Science', description: 'Space exploration, physics, environmental studies, and scientific research.' },
      { id: 'Sports', name: 'Sports', description: 'International tournaments, regional championships, matches, and athlete profiles.' },
      { id: 'Culture', name: 'Culture', description: 'Literature, fine arts, music, visual culture, reviews, and lifestyle trends.' },
      { id: 'Opinion', name: 'Opinion', description: 'Editorials, essays, columns, and debates from guest writers.' }
    ];
    for (const cat of initialCategories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // Seed Tags
    const initialTags: TagItem[] = [
      { id: 'Breaking', name: 'Breaking' },
      { id: 'Research', name: 'Research' },
      { id: 'Special Report', name: 'Special Report' },
      { id: 'Editorial', name: 'Editorial' },
      { id: 'Markets', name: 'Markets' },
      { id: 'Analysis', name: 'Analysis' }
    ];
    for (const tag of initialTags) {
      await setDoc(doc(db, 'tags', tag.id), tag);
    }

    // Seed Media
    const initialMedia: MediaAsset[] = [
      {
        id: 'media-carbon',
        title: 'Emergency UN Summit Geneva',
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
        type: 'image/jpeg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'media-ai',
        title: 'Oncology Diagnostic Screen',
        url: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800&auto=format&fit=crop&q=80',
        type: 'image/jpeg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'media-markets',
        title: 'Financial Indices Board',
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        type: 'image/jpeg',
        createdAt: new Date().toISOString()
      }
    ];
    for (const med of initialMedia) {
      await setDoc(doc(db, 'media', med.id), med);
    }

    // Seed Settings
    const initialSettings: GeneralSettings = {
      siteName: 'Morning Pulse',
      siteLogoText: 'PULSE',
      siteSubtitle: 'The News of Today, Analyzed for Tomorrow',
      tickerItems: [
        'WORLD LEADERS CONVENE FOR CARBON EMISSIONS EMERGENCY SUMMIT IN GENEVA',
        'AI OUTPERFORMS HUMAN RADIOLOGISTS IN NEW ONCOLOGY TRIALS',
        'FEDERAL RESERVE CUTS INTEREST RATES BY 25 BASIS POINTS AS INFLATION COOLS'
      ],
      breakingNewsId: 'world-leaders-carbon-summit'
    };
    await setDoc(doc(db, 'settings', 'general'), initialSettings);

    console.log('Database seeding successfully finished!');
  } catch (error) {
    console.error('Error seeding database: ', error);
  }
}

// 2. Real-Time Subscribers (onSnapshot hooks)
export function subscribeArticles(callback: (articles: Article[]) => void) {
  const q = query(collection(db, 'articles'), orderBy('publishedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list: Article[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as Article);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to articles:', err);
  });
}

export function subscribeMenu(callback: (menu: MenuItem[]) => void) {
  const q = query(collection(db, 'menu'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const list: MenuItem[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as MenuItem);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to menu:', err);
  });
}

export function subscribeMedia(callback: (media: MediaAsset[]) => void) {
  const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list: MediaAsset[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as MediaAsset);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to media:', err);
  });
}

export function subscribePages(callback: (pages: PageContent[]) => void) {
  return onSnapshot(collection(db, 'pages'), (snapshot) => {
    const list: PageContent[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as PageContent);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to pages:', err);
  });
}

export function subscribeAds(callback: (ads: AdBanner[]) => void) {
  return onSnapshot(collection(db, 'ads'), (snapshot) => {
    const list: AdBanner[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as AdBanner);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to ads:', err);
  });
}

export function subscribeSettings(callback: (settings: GeneralSettings | null) => void) {
  return onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as GeneralSettings);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error('Error subscribing to settings:', err);
  });
}

export function subscribeReaders(callback: (readers: ReaderUser[]) => void) {
  return onSnapshot(collection(db, 'users'), (snapshot) => {
    const list: ReaderUser[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as ReaderUser);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to users:', err);
  });
}

export function subscribeCategories(callback: (categories: CategoryItem[]) => void) {
  return onSnapshot(collection(db, 'categories'), (snapshot) => {
    const list: CategoryItem[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as CategoryItem);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to categories:', err);
  });
}

export function subscribeTags(callback: (tags: TagItem[]) => void) {
  return onSnapshot(collection(db, 'tags'), (snapshot) => {
    const list: TagItem[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as TagItem);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to tags:', err);
  });
}

// 3. Mutator/CRUD Actions
// Articles
export async function saveArticle(article: Article) {
  await setDoc(doc(db, 'articles', article.id), article);
}
export async function deleteArticle(id: string) {
  await deleteDoc(doc(db, 'articles', id));
}

// Menu Items
export async function saveMenuItem(menuItem: MenuItem) {
  await setDoc(doc(db, 'menu', menuItem.id), menuItem);
}
export async function deleteMenuItem(id: string) {
  await deleteDoc(doc(db, 'menu', id));
}

// Media Assets
export async function addMediaAsset(asset: Omit<MediaAsset, 'id'>) {
  const id = 'media-' + Date.now();
  const fullAsset: MediaAsset = { id, ...asset };
  await setDoc(doc(db, 'media', id), fullAsset);
}
export async function deleteMediaAsset(id: string) {
  await deleteDoc(doc(db, 'media', id));
}

// Pages
export async function savePageContent(page: PageContent) {
  await setDoc(doc(db, 'pages', page.id), page);
}

// Ads
export async function saveAdBanner(ad: AdBanner) {
  await setDoc(doc(db, 'ads', ad.id), ad);
}
export async function deleteAdBanner(id: string) {
  await deleteDoc(doc(db, 'ads', id));
}

// General Settings
export async function updateGeneralSettings(settings: Partial<GeneralSettings>) {
  await updateDoc(doc(db, 'settings', 'general'), settings);
}

// Reader Users (Toggle admin or edit bio/avatar)
export async function updateReaderUser(userId: string, data: Partial<ReaderUser>) {
  await updateDoc(doc(db, 'users', userId), data);
}
export async function deleteReaderUser(userId: string) {
  await deleteDoc(doc(db, 'users', userId));
}

// Categories & Tags
export async function saveCategoryItem(cat: CategoryItem) {
  await setDoc(doc(db, 'categories', cat.id), cat);
}
export async function deleteCategoryItem(id: string) {
  await deleteDoc(doc(db, 'categories', id));
}

export async function saveTagItem(tag: TagItem) {
  await setDoc(doc(db, 'tags', tag.id), tag);
}
export async function deleteTagItem(id: string) {
  await deleteDoc(doc(db, 'tags', id));
}

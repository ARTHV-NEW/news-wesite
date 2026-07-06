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
  limit,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { INITIAL_ARTICLES } from '../data/articles';
import { Article, Category, AuthorItem, LiveBlogItem, RedirectItem, ShortItem } from '../types';

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
  slug: string;
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
  slug: string;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
}

// SEO URL SLUG ROUTING HELPERS
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric, non-space, non-hyphen
    .replace(/[\s_-]+/g, '-')  // replace spaces/underscores/hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // trim leading/trailing hyphens
}

export async function checkSlugUnique(collName: string, slug: string, excludeDocId?: string): Promise<boolean> {
  const q = query(collection(db, collName), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return true;
  if (excludeDocId && snap.docs.length === 1 && snap.docs[0].id === excludeDocId) {
    return true;
  }
  return false;
}

export async function getUniqueSlug(collName: string, baseSlug: string, excludeDocId?: string): Promise<string> {
  let slug = baseSlug || 'untitled';
  let isUnique = await checkSlugUnique(collName, slug, excludeDocId);
  let counter = 1;
  const originalBase = slug;
  while (!isUnique) {
    const candidate = `${originalBase}-${counter}`;
    isUnique = await checkSlugUnique(collName, candidate, excludeDocId);
    if (isUnique) {
      slug = candidate;
      break;
    }
    counter++;
  }
  return slug;
}

export async function handleSlugChange(
  type: 'articles' | 'pages' | 'categories' | 'tags' | 'authors' | 'liveblogs', 
  oldSlug: string, 
  newSlug: string
) {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;
  const prefixMap = {
    articles: '/articles',
    pages: '',
    categories: '/category',
    tags: '/tag',
    authors: '/author',
    liveblogs: '/liveblog'
  };
  const prefix = prefixMap[type];
  const fromPath = prefix ? `${prefix}/${oldSlug}` : `/${oldSlug}`;
  const toPath = prefix ? `${prefix}/${newSlug}` : `/${newSlug}`;

  // Check if redirect already exists to avoid cycle or duplicates
  const redirectId = generateSlug(fromPath);
  await setDoc(doc(db, 'redirects', redirectId), {
    id: redirectId,
    fromPath,
    toPath,
    createdAt: new Date().toISOString()
  });

  // Automatically update internal links referencing this path
  await updateInternalLinks(fromPath, toPath);
}

export async function updateInternalLinks(oldPath: string, newPath: string) {
  try {
    // 1. Update Articles content
    const articlesSnap = await getDocs(collection(db, 'articles'));
    for (const docSnap of articlesSnap.docs) {
      const data = docSnap.data() as Article;
      if (data.content) {
        let modified = false;
        const newContent = data.content.map(para => {
          if (para.includes(oldPath)) {
            modified = true;
            return para.replaceAll(oldPath, newPath);
          }
          return para;
        });
        if (modified) {
          await updateDoc(doc(db, 'articles', docSnap.id), { content: newContent });
        }
      }
    }

    // 2. Update Menu Items links
    const menuSnap = await getDocs(collection(db, 'menu'));
    for (const docSnap of menuSnap.docs) {
      const data = docSnap.data() as MenuItem;
      if (data.link === oldPath) {
        await updateDoc(doc(db, 'menu', docSnap.id), { link: newPath });
      }
    }

    // 3. Update Static Pages content
    const pagesSnap = await getDocs(collection(db, 'pages'));
    for (const docSnap of pagesSnap.docs) {
      const data = docSnap.data() as PageContent;
      if (data.content && data.content.includes(oldPath)) {
        await updateDoc(doc(db, 'pages', docSnap.id), { 
          content: data.content.replaceAll(oldPath, newPath) 
        });
      }
    }
  } catch (error) {
    console.error('Failed to update internal links:', error);
  }
}

// 1. Database Seeding Function
export async function seedDatabaseIfEmpty() {
  try {
    const articlesSnap = await getDocs(collection(db, 'articles'));
    if (!articlesSnap.empty) {
      return;
      for (const d of articlesSnap.docs) {
        const data = d.data();
        if (!data.slug) {
          await updateDoc(doc(db, 'articles', d.id), { slug: generateSlug(data.title || d.id) });
        }
      }
      // Same check for pages
      const pagesSnap = await getDocs(collection(db, 'pages'));
      for (const d of pagesSnap.docs) {
        const data = d.data() as PageContent;
        if (!data.slug) {
          await updateDoc(doc(db, 'pages', d.id), { slug: generateSlug(data.title || d.id) });
        }
      }
      // Same check for categories
      const catsSnap = await getDocs(collection(db, 'categories'));
      for (const d of catsSnap.docs) {
        const data = d.data() as CategoryItem;
        if (!data.slug) {
          await updateDoc(doc(db, 'categories', d.id), { slug: generateSlug(data.name || d.id) });
        }
      }
      // Same check for tags
      const tagsSnap = await getDocs(collection(db, 'tags'));
      for (const d of tagsSnap.docs) {
        const data = d.data() as TagItem;
        if (!data.slug) {
          await updateDoc(doc(db, 'tags', d.id), { slug: generateSlug(data.name || d.id) });
        }
      }

      // Check if authors exist, if not seed them
      const authorsSnap = await getDocs(collection(db, 'authors'));
      if (authorsSnap.empty) {
        const initialAuthors: AuthorItem[] = [
          { id: 'sarah-jenkins', name: 'Sarah Jenkins', role: 'Politics Editor', email: 's.jenkins@pulsenews.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=60', slug: 'sarah-jenkins' },
          { id: 'david-chen', name: 'David Chen', role: 'Business Correspondent', email: 'd.chen@pulsenews.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=60', slug: 'david-chen' },
          { id: 'michael-t', name: 'Michael T.', role: 'Culture & Entertainment Desk', email: 'm.t@pulsenews.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=60', slug: 'michael-t' },
          { id: 'leah-al-fayed', name: 'Leah Al-Fayed', role: 'Geopolitics Writer', email: 'l.alfayed@pulsenews.com', status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=60', slug: 'leah-al-fayed' }
        ];
        for (const author of initialAuthors) {
          await setDoc(doc(db, 'authors', author.id), author);
        }
      }

      // Check if live blogs exist, if not seed them
      const liveBlogsSnap = await getDocs(collection(db, 'liveblogs'));
      if (liveBlogsSnap.empty) {
        const initialLiveBlogs: LiveBlogItem[] = [
          { id: 'live-geneva-climate-panel', title: 'Live: Geneva Climate Accord Panel Discussion', slug: 'live-geneva-climate-panel', content: 'Discussion on implementation of the Geneva Restoration Pact and green energy fund updates.', category: 'World', publishedAt: new Date().toISOString() },
          { id: 'live-fed-press-conference', title: 'Live Updates: Federal Reserve Press Conference', slug: 'live-fed-press-conference', content: 'Updates on inflation data and 25 basis points rate cuts direct from the press conference.', category: 'Business', publishedAt: new Date().toISOString() }
        ];
        for (const liveblog of initialLiveBlogs) {
          await setDoc(doc(db, 'liveblogs', liveblog.id), liveblog);
        }
      }
      // Check if shorts exist, if not seed them
      const shortsSnap = await getDocs(collection(db, 'shorts'));
      if (shortsSnap.empty) {
        const initialShorts: ShortItem[] = [
          {
            id: 'short-1',
            title: 'Netanyahu: Israel Won\'t Leave Lebanon As long As...',
            description: 'Israel PM Netanyahu visits troops stationed in Lebanon.',
            summary: 'Prime Minister Benjamin Netanyahu visited Israeli forces stationed in Lebanon, reaffirming the military presence and commitment to security operations in the region.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&auto=format&fit=crop&q=80',
            duration: '0:55',
            createdAt: new Date().toISOString(),
            views: 1205,
            likes: 45
          },
          {
            id: 'short-2',
            title: 'US Supreme Court Upholds Birthright Citizenship, Big...',
            description: 'Major ruling by US Supreme Court on citizenship.',
            summary: 'The US Supreme Court has upheld birthright citizenship in a landmark ruling, preserving a long-standing constitutional right.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80',
            duration: '1:00',
            createdAt: new Date().toISOString(),
            views: 840,
            likes: 30
          },
          {
            id: 'short-3',
            title: 'PM Modi To Travel To US For G20 Summit, Says...',
            description: 'PM Modi to attend G20 summit 2026 in US: Ambassador Sergio Gor.',
            summary: 'Prime Minister Narendra Modi is scheduled to travel to the United States to attend the G20 Summit in 2026, as confirmed by US Ambassador Sergio Gor.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&auto=format&fit=crop&q=80',
            duration: '0:14',
            createdAt: new Date().toISOString(),
            views: 2400,
            likes: 120
          },
          {
            id: 'short-4',
            title: 'Moment 71-Year-Old Woman Is Pulled From Building In...',
            description: 'Moment 71-year-old woman is pulled from Venezuela quake rubble.',
            summary: 'In a miraculous rescue, a 71-year-old woman was successfully pulled alive from the rubble of a collapsed building following a devastating earthquake in Venezuela.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            imageUrl: 'https://images.unsplash.com/photo-1498677231914-50deb6ba4217?w=400&auto=format&fit=crop&q=80',
            duration: '0:16',
            createdAt: new Date().toISOString(),
            views: 3100,
            likes: 215
          },
          {
            id: 'short-5',
            title: 'Araghchi Says Iran Alone Will Oversee Reopening Of...',
            description: 'Araghchi: Iran alone will oversee Hormuz reopening, warns against interference.',
            summary: 'Iranian Foreign Minister Abbas Araghchi stated that Iran will independently oversee the reopening of the Strait of Hormuz and warned foreign powers against any interference.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            imageUrl: 'https://images.unsplash.com/photo-1532384816664-01b8b7238c8d?w=400&auto=format&fit=crop&q=80',
            duration: '0:48',
            createdAt: new Date().toISOString(),
            views: 1560,
            likes: 80
          },
          {
            id: 'short-6',
            title: 'On Camera, Debris Falls Off Beijing\'s Tallest Building Aft...',
            description: 'Video shows debris falling after small plane crashes Beijing\'s tallest building.',
            summary: 'Shocking camera footage captured debris falling from Beijing\'s tallest skyscraper after a small plane crashed into the structure.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=400&auto=format&fit=crop&q=80',
            duration: '1:05',
            createdAt: new Date().toISOString(),
            views: 4500,
            likes: 310
          }
        ];
        for (const short of initialShorts) {
          await setDoc(doc(db, 'shorts', short.id), short);
        }
      }
      return;
    }

    console.log('Seeding database with initial data...');

    // Seed Articles
    for (const article of INITIAL_ARTICLES) {
      const artWithSlug = { ...article, slug: generateSlug(article.title) };
      await setDoc(doc(db, 'articles', article.id), artWithSlug);
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
        content: 'PulseNews is an independent global media organization dedicated to objective, rigorous, and deep investigative journalism. We cover the stories that alter policy, drive economies, and shape future societies. Founded by visionary journalists, we believe in truth and accountability.',
        slug: 'about'
      },
      {
        id: 'Contact',
        title: 'Contact Us',
        content: 'We would love to hear from you. For general inquiries, email info@pulsenews.com. For tips and news leads, securely contact tips@pulsenews.com. Our global headquarters is located in London, UK.',
        slug: 'contact'
      },
      {
        id: 'Privacy',
        title: 'Privacy Policy',
        content: 'Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and share information about you when you interact with PulseNews. We do not sell your personal data to third parties.',
        slug: 'privacy'
      },
      {
        id: 'Terms',
        title: 'Terms of Use',
        content: 'By accessing or using PulseNews, you agree to be bound by these Terms of Use. All content on this platform is the property of PulseNews Media Group and is protected by international copyright laws.',
        slug: 'terms'
      },
      {
        id: 'Cookies',
        title: 'Cookie Settings',
        content: 'PulseNews uses cookies to improve your experience and deliver personalized content. You can manage your cookie preferences through your browser settings.',
        slug: 'cookies'
      },
      {
        id: 'Sitemap',
        title: 'Sitemap',
        content: 'Navigate through PulseNews: Home, World, Politics, Business, Technology, Science, Sports, Culture, Opinion.',
        slug: 'sitemap'
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
      { id: 'World', name: 'World', description: 'Global developments, international affairs and geopolitical events.', slug: 'world' },
      { id: 'Politics', name: 'Politics', description: 'Government updates, policy debates, elections, and national decisions.', slug: 'politics' },
      { id: 'Business', name: 'Business', description: 'Financial markets, commerce trends, corporate decisions, and macroeconomics.', slug: 'business' },
      { id: 'Technology', name: 'Technology', description: 'AI innovations, software, device launches, cyber security, and tech giants.', slug: 'technology' },
      { id: 'Health', name: 'Health', description: 'Medical research, healthcare systems, wellness updates, and clinical breakthroughs.', slug: 'health' },
      { id: 'Science', name: 'Science', description: 'Space exploration, physics, environmental studies, and scientific research.', slug: 'science' },
      { id: 'Sports', name: 'Sports', description: 'International tournaments, regional championships, matches, and athlete profiles.', slug: 'sports' },
      { id: 'Culture', name: 'Culture', description: 'Literature, fine arts, music, visual culture, reviews, and lifestyle trends.', slug: 'culture' },
      { id: 'Opinion', name: 'Opinion', description: 'Editorials, essays, columns, and debates from guest writers.', slug: 'opinion' }
    ];
    for (const cat of initialCategories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // Seed Tags
    const initialTags: TagItem[] = [
      { id: 'Breaking', name: 'Breaking', slug: 'breaking' },
      { id: 'Research', name: 'Research', slug: 'research' },
      { id: 'Special Report', name: 'Special Report', slug: 'special-report' },
      { id: 'Editorial', name: 'Editorial', slug: 'editorial' },
      { id: 'Markets', name: 'Markets', slug: 'markets' },
      { id: 'Analysis', name: 'Analysis', slug: 'analysis' }
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

    // Seed Authors
    const initialAuthors: AuthorItem[] = [
      { id: 'sarah-jenkins', name: 'Sarah Jenkins', role: 'Politics Editor', email: 's.jenkins@pulsenews.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=60', slug: 'sarah-jenkins' },
      { id: 'david-chen', name: 'David Chen', role: 'Business Correspondent', email: 'd.chen@pulsenews.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=60', slug: 'david-chen' },
      { id: 'michael-t', name: 'Michael T.', role: 'Culture & Entertainment Desk', email: 'm.t@pulsenews.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=60', slug: 'michael-t' },
      { id: 'leah-al-fayed', name: 'Leah Al-Fayed', role: 'Geopolitics Writer', email: 'l.alfayed@pulsenews.com', status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=60', slug: 'leah-al-fayed' }
    ];
    for (const author of initialAuthors) {
      await setDoc(doc(db, 'authors', author.id), author);
    }

    // Seed Live Blogs
    const initialLiveBlogs: LiveBlogItem[] = [
      { id: 'live-geneva-climate-panel', title: 'Live: Geneva Climate Accord Panel Discussion', slug: 'live-geneva-climate-panel', content: 'Discussion on implementation of the Geneva Restoration Pact and green energy fund updates.', category: 'World', publishedAt: new Date().toISOString() },
      { id: 'live-fed-press-conference', title: 'Live Updates: Federal Reserve Press Conference', slug: 'live-fed-press-conference', content: 'Updates on inflation data and 25 basis points rate cuts direct from the press conference.', category: 'Business', publishedAt: new Date().toISOString() }
    ];
    for (const liveblog of initialLiveBlogs) {
      await setDoc(doc(db, 'liveblogs', liveblog.id), liveblog);
    }

    // Mark seeding as complete
    await setDoc(doc(db, 'settings', 'general'), {
      siteName: 'Pulse News',
      siteLogoText: 'PULSE',
      siteSubtitle: 'Global Reporting',
      tickerItems: ['BREAKING', 'LIVE UPDATES']
    });

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
export async function deletePageContent(id: string) {
  await deleteDoc(doc(db, 'pages', id));
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

// Authors
export function subscribeAuthors(callback: (authors: AuthorItem[]) => void) {
  return onSnapshot(collection(db, 'authors'), (snapshot) => {
    const list: AuthorItem[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as AuthorItem);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to authors:', err);
  });
}
export async function saveAuthorItem(author: AuthorItem) {
  await setDoc(doc(db, 'authors', author.id), author);
}
export async function deleteAuthorItem(id: string) {
  await deleteDoc(doc(db, 'authors', id));
}

// Live Blogs
export function subscribeLiveBlogs(callback: (liveblogs: LiveBlogItem[]) => void) {
  return onSnapshot(collection(db, 'liveblogs'), (snapshot) => {
    const list: LiveBlogItem[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as LiveBlogItem);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to liveblogs:', err);
  });
}
export async function saveLiveBlogItem(liveblog: LiveBlogItem) {
  await setDoc(doc(db, 'liveblogs', liveblog.id), liveblog);
}
export async function deleteLiveBlogItem(id: string) {
  await deleteDoc(doc(db, 'liveblogs', id));
}

// Redirects
export function subscribeRedirects(callback: (redirects: RedirectItem[]) => void) {
  return onSnapshot(collection(db, 'redirects'), (snapshot) => {
    const list: RedirectItem[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as RedirectItem);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to redirects:', err);
  });
}
export async function addRedirect(fromPath: string, toPath: string) {
  const id = generateSlug(fromPath);
  await setDoc(doc(db, 'redirects', id), {
    id,
    fromPath,
    toPath,
    createdAt: new Date().toISOString()
  });
}
export async function deleteRedirect(id: string) {
  await deleteDoc(doc(db, 'redirects', id));
}

// Shorts
export function subscribeShorts(callback: (shorts: ShortItem[]) => void) {
  const q = query(collection(db, 'shorts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list: ShortItem[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as ShortItem);
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to shorts:', err);
  });
}
export async function saveShortItem(short: ShortItem) {
  await setDoc(doc(db, 'shorts', short.id), short);
}
export async function deleteShortItem(id: string) {
  await deleteDoc(doc(db, 'shorts', id));
}

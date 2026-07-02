import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Heart, MessageSquare, Clock, ArrowRight, Share2, 
  Sparkles, CheckCircle2, AlertCircle, X, ShieldCheck, Mail, CreditCard,
  Rss, ChevronRight, Volume2, User, Facebook, Twitter, Instagram, Youtube, Linkedin,
  Play, FileText
} from 'lucide-react';
import Header from './components/Header';
import TrendingTicker from './components/TrendingTicker';
import SavedArticlesDrawer from './components/SavedArticlesDrawer';
import ArticleView from './components/ArticleView';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProfileView from './components/ProfileView';
import StaticPageView from './components/StaticPageView';
import HeroCarousel from './components/HeroCarousel';
import VisualArticleGrid from './components/VisualArticleGrid';
import { Article, Category } from './types';
import { INITIAL_ARTICLES } from './data/articles';
import { 
  subscribeArticles, 
  subscribeMenu, 
  subscribeAds, 
  subscribeSettings, 
  GeneralSettings, 
  MenuItem, 
  AdBanner 
} from './services/db';

export default function App() {
  // Navigation & Filtering
  const [activeCategory, setActiveCategory] = useState<Category>('Home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  // Data State
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  // Real-time CMS State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [ads, setAds] = useState<AdBanner[]>([]);

  // Selected Article for Reader
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Layout UI Overlays
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);

  // Subscribe Form State
  const [subTier, setSubTier] = useState<'weekly' | 'monthly' | 'annual'>('monthly');
  const [subEmail, setSubEmail] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load saved articles from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pulse_news_bookmarks');
      if (stored) {
        const parsedIds = JSON.parse(stored) as string[];
        const matched = INITIAL_ARTICLES.filter(art => parsedIds.includes(art.id));
        setSavedArticles(matched);
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
  }, []);

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubArticles = subscribeArticles((liveArticles) => {
      if (liveArticles.length > 0) {
        setArticles(liveArticles);
      }
    });

    const unsubMenu = subscribeMenu((liveMenu) => {
      setMenuItems(liveMenu);
    });

    const unsubSettings = subscribeSettings((liveSettings) => {
      setGeneralSettings(liveSettings);
    });

    const unsubAds = subscribeAds((liveAds) => {
      setAds(liveAds);
    });

    return () => {
      unsubArticles();
      unsubMenu();
      unsubSettings();
      unsubAds();
    };
  }, []);

  // Save articles to LocalStorage on change
  const syncBookmarksToStorage = (updatedList: Article[]) => {
    try {
      const ids = updatedList.map(a => a.id);
      localStorage.setItem('pulse_news_bookmarks', JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to sync bookmarks', e);
    }
  };

  // Toggle Bookmark logic
  const handleToggleBookmark = (article: Article) => {
    const exists = savedArticles.some(item => item.id === article.id);
    let updated: Article[];
    if (exists) {
      updated = savedArticles.filter(item => item.id !== article.id);
    } else {
      updated = [...savedArticles, article];
    }
    setSavedArticles(updated);
    syncBookmarksToStorage(updated);
  };

  // Toggle Like logic
  const handleToggleLike = (articleId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        return {
          ...art,
          likes: art.likes + 1 // increment locally
        };
      }
      return art;
    }));
  };

  // Clear all bookmarks
  const handleClearAllBookmarks = () => {
    setSavedArticles([]);
    localStorage.removeItem('pulse_news_bookmarks');
  };

  // Subscription Submission
  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim() || !subEmail.includes('@')) {
      alert("Please provide a valid email address.");
      return;
    }
    if (cardNumber.trim().length < 12) {
      alert("Please provide a valid simulation payment card.");
      return;
    }

    setSubStatus('success');
    setTimeout(() => {
      setSubStatus('idle');
      setIsSubscribeModalOpen(false);
      setSubEmail('');
      setCardNumber('');
    }, 3500);
  };

  // Filter articles based on search query
  const getFilteredArticles = () => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(art => 
      art.title.toLowerCase().includes(q) || 
      art.subtitle.toLowerCase().includes(q) ||
      art.content.some(para => para.toLowerCase().includes(q)) ||
      art.author.name.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q)
    );
  };

  // Filter articles based on category
  const getCategoryArticles = (catName: Category) => {
    const list = getFilteredArticles();
    if (catName === 'Home') return list;
    return list.filter(art => art.category.toLowerCase() === catName.toLowerCase());
  };

  // Filter helper variables
  const filteredList = getFilteredArticles();
  
  // Categorized groupings for the complex Frontpage layout
  const breakingNews = articles.find(a => a.isBreaking) || articles[0];
  const moreStories = articles.filter(a => !a.isBreaking && !a.isFeatured).slice(0, 6);
  const latestRanked = articles.slice(2, 10);
  const techArticles = articles.filter(a => a.category === 'Technology').slice(0, 5);
  const worldArticles = articles.filter(a => a.category === 'World');
  const worldFeatured = worldArticles.find(a => a.tag === 'Featured') || worldArticles[0];
  const worldSubList = worldArticles.filter(a => a.id !== worldFeatured.id).slice(0, 4);
  const scienceArticles = articles.filter(a => a.category === 'Science');
  const scienceFeatured = scienceArticles.find(a => a.isFeatured || a.tag === 'Research') || scienceArticles[0];
  const scienceList = scienceArticles.filter(a => a.id !== scienceFeatured.id).slice(0, 4);
  const businessList = articles.filter(a => a.category === 'Business').slice(0, 5);
  const sportsList = articles.filter(a => a.category === 'Sports').slice(0, 5);
  const opinionArticles = articles.filter(a => a.isOpinion || a.category === 'Opinion').slice(0, 5);
  const editorsChoices = articles.filter(a => a.isEditorsChoice).slice(0, 5);

  // Paginated Feed stories
  const feedArticles = articles.filter(a => !a.isBreaking && !a.isFeatured);
  const totalPages = Math.ceil(feedArticles.length / itemsPerPage);
  const paginatedFeed = feedArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#c8232c] selection:text-white">
      
      {/* HEADER BAR */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentPage(1); // reset pagination
          setSelectedArticle(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          if (query.trim() !== '') {
            setSelectedArticle(null);
          }
        }}
        savedCount={savedArticles.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
        siteName={generalSettings?.siteName}
        siteLogoText={generalSettings?.siteLogoText}
        menuItems={menuItems}
      />

      {/* TRENDING TICKER LOOP */}
      <TrendingTicker items={generalSettings?.tickerItems} />

      {/* MAIN CONTENT AREA */}
      {['About', 'Contact', 'Privacy', 'Terms', 'Cookies', 'Sitemap'].includes(activeCategory) ? (
        <StaticPageView pageType={activeCategory} onNavigateBack={() => setActiveCategory('Home')} />
      ) : activeCategory === 'Profile' ? (
        <ProfileView onNavigateBack={() => setActiveCategory('Home')} />
      ) : selectedArticle ? (
        <ArticleView
          article={selectedArticle}
          relatedArticles={articles.filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id).slice(0, 3)}
          onClose={() => setSelectedArticle(null)}
          onToggleLike={() => handleToggleLike(selectedArticle.id)}
          onToggleBookmark={() => handleToggleBookmark(selectedArticle)}
          isBookmarked={savedArticles.some(a => a.id === selectedArticle.id)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      ) : (
        <>
          {/* SEARCH OVERLAY RESULTS (If user is searching) */}
          {searchQuery.trim() !== '' && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex-1 w-full animate-fade-in">
          <div className="border-b border-[#1A1A1A] pb-4 mb-8 flex justify-between items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-black tracking-tight">
                Search Results for <span className="italic">"{searchQuery}"</span>
              </h2>
              <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-[0.2em] font-bold">
                Matches Found: {filteredList.length} articles
              </p>
            </div>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-black text-white hover:bg-red-600 text-xs font-bold rounded-none uppercase tracking-wider transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>

          {filteredList.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <p className="font-serif text-lg font-bold text-gray-700">No matching articles found</p>
              <p className="text-xs text-gray-500 mt-2">
                We couldn't find any news story containing "{searchQuery}". Please try adjusting your parameters or browse our main sections.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((art) => (
                <article 
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="bg-white border border-[#E0E0DE] hover:border-[#1A1A1A] rounded-none overflow-hidden shadow-none transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
                    <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#c8232c] text-white text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-none uppercase font-bold">
                        {art.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-wider">{art.publishedAt} · {art.readTime}</span>
                    <h3 className="font-serif text-md font-bold mt-2 leading-snug text-[#1A1A1A] group-hover:text-[#c8232c] transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed flex-1">
                      {art.subtitle}
                    </p>
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E0E0DE]">
                      <div className="flex items-center gap-2">
                        <img src={art.author.avatar} alt={art.author.name} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <span className="text-[10px] font-bold font-sans text-gray-700">{art.author.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#c8232c] hover:underline flex items-center gap-1">
                        Read Story <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {/* CORE HOME VIEW PAGE */}
      {searchQuery.trim() === '' && activeCategory === 'Home' && (
        <main className="flex-1 w-full">
          {/* Section 1: Editorial Hero Layout Grid */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-b border-[#E0E0DE]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-stretch">
              
              {/* Left Side: Major Featured Post (Takes 5 Cols) with responsive premium carousel */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <HeroCarousel 
                  articles={articles} 
                  onSelectArticle={(art) => setSelectedArticle(art)} 
                />

                {/* Horizontal Featured Post matching rough sketch */}
                <div 
                  onClick={() => setSelectedArticle(breakingNews)}
                  className="group cursor-pointer flex gap-4 pt-6 border-t border-[#E0E0DE] items-start"
                  id="featured-spotlight-post"
                >
                  <div className="w-5/12 aspect-[4/3] shrink-0 bg-gray-100 overflow-hidden relative border border-[#E0E0DE]">
                    <img 
                      src={breakingNews.imageUrl} 
                      alt={breakingNews.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full min-h-[110px]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] text-[#ef3a3e] font-black uppercase tracking-wider">
                          {breakingNews.category}
                        </span>
                        <span className="text-gray-300 text-[10px]">•</span>
                        <span className="font-mono text-[9px] text-gray-400">
                          {breakingNews.publishedAt}
                        </span>
                      </div>
                      <h3 className="font-serif text-sm lg:text-base font-bold text-[#1A1A1A] group-hover:text-[#ef3a3e] leading-snug transition-colors line-clamp-2">
                        {breakingNews.title}
                      </h3>
                      <p className="font-sans text-[11px] text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {breakingNews.subtitle}
                      </p>
                    </div>
                    
                    {/* Author details matching 'author pic' */}
                    <div className="flex items-center gap-2 mt-3">
                      <img 
                        src={breakingNews.author.avatar} 
                        alt={breakingNews.author.name} 
                        className="w-5 h-5 rounded-full object-cover border border-[#E0E0DE]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] font-bold text-[#1A1A1A]">
                          {breakingNews.author.name}
                        </span>
                        <span className="font-sans text-[8px] text-gray-400 leading-none">
                          {breakingNews.author.role}
                        </span>
                      </div>
                      <span className="text-gray-300 text-[10px] ml-auto">•</span>
                      <span className="font-mono text-[9px] text-gray-400">
                        {breakingNews.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: More Stories List (Takes 4 Cols) */}
              <div className="lg:col-span-4 border-l border-r border-[#E0E0DE] px-0 lg:px-6 flex flex-col justify-between">
                <div className="flex flex-col h-full justify-between">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-black border-b border-[#E0E0DE] pb-2 mb-3">
                    Analytical Insight →
                  </span>

                  <div className="flex-1 flex flex-col justify-between divide-y divide-[#E0E0DE]">
                    {moreStories.slice(0, 6).map((art) => (
                      <article 
                        key={art.id} 
                        onClick={() => setSelectedArticle(art)}
                        className="py-3 first:pt-0 last:pb-0 flex gap-4 items-center group cursor-pointer"
                      >
                        {/* Beautifully rounded image container with premium shadow and border */}
                        <div className="w-28 h-20 shrink-0 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100 shadow-md group-hover:shadow-lg transition-all duration-300">
                          <img 
                            src={art.imageUrl} 
                            alt={art.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        {/* Right Content Area: Title on top, category and date below */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-sans font-bold text-xs md:text-[13px] lg:text-[13px] text-gray-900 leading-snug tracking-tight group-hover:text-[#ef3a3e] transition-colors line-clamp-2">
                            {art.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-2 text-[9px] font-bold tracking-wider font-sans uppercase">
                            <span className="text-[#ef3a3e]">{art.category}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-400 font-mono tracking-normal normal-case font-medium">{art.publishedAt}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Latest Ranked News (Takes 3 Cols) */}
              <div className="lg:col-span-3 flex flex-col justify-between">
                <div className="flex flex-col h-full justify-between">
                  <span className="font-serif text-base font-black border-b border-[#1A1A1A] pb-2 mb-3">
                    Latest Hotspots
                  </span>

                  <div className="flex-1 flex flex-col justify-between divide-y divide-[#E0E0DE]">
                    {latestRanked.slice(0, 8).map((art, idx) => (
                      <article 
                        key={art.id} 
                        onClick={() => setSelectedArticle(art)}
                        className="py-1.5 flex items-start gap-3 group cursor-pointer first:pt-0 last:pb-0"
                      >
                        <span className="font-mono text-base font-black text-[#ef3a3e]/30 group-hover:text-[#ef3a3e] transition-colors leading-none pt-0.5 shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-sans text-[11px] lg:text-xs font-bold text-[#1A1A1A] leading-snug group-hover:text-[#ef3a3e] transition-colors line-clamp-2">
                            {art.title}
                          </h4>
                          <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mt-0.5 block">{art.category} Desk</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Technology Column - 4 Card Grid */}
          <section className="bg-white py-10 border-b border-[#E0E0DE]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-6">
                <h2 className="font-serif text-xl font-black flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#c8232c]" />
                  Technology Desk
                </h2>
                <button 
                  onClick={() => { setActiveCategory('Technology'); window.scrollTo(0, 0); }}
                  className="font-mono text-[10px] text-[#c8232c] font-black uppercase tracking-wider hover:underline bg-transparent border-none cursor-pointer"
                >
                  View All Technology →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {techArticles.map((art) => (
                  <article 
                    key={art.id} 
                    onClick={() => setSelectedArticle(art)}
                    className="flex flex-col group cursor-pointer"
                  >
                    <div className="w-full h-36 bg-gray-100 overflow-hidden rounded-none relative border border-[#E0E0DE]">
                      <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-black text-white font-mono text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-none uppercase">
                          {art.tag}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3">
                      <h3 className="font-serif text-sm font-bold text-gray-900 group-hover:text-[#c8232c] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400 font-mono font-medium">{art.publishedAt}</span>
                        <span className="text-[10px] text-gray-500 font-bold">{art.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2.5: Visual Showcase Grid (New Competitor-inspired Image Grid) */}
          <VisualArticleGrid 
            articles={articles} 
            onSelectArticle={(art) => setSelectedArticle(art)} 
          />

          {/* Section 3: World Affairs Column - Magazine Style Layout */}
          <section className="py-10 border-b border-[#E0E0DE]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-6">
                <h2 className="font-serif text-xl font-black flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#1a3a5c]" />
                  World Affairs Desk
                </h2>
                <button 
                  onClick={() => { setActiveCategory('World'); window.scrollTo(0, 0); }}
                  className="font-mono text-[10px] text-[#c8232c] font-black uppercase tracking-wider hover:underline bg-transparent border-none cursor-pointer"
                >
                  View All World News →
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Left: Major Featured Sub-Hero */}
                {worldFeatured && (
                  <article 
                    onClick={() => setSelectedArticle(worldFeatured)}
                    className="flex flex-col space-y-3 group cursor-pointer"
                  >
                    <div className="w-full h-60 md:h-72 bg-gray-100 rounded-none overflow-hidden relative border border-[#E0E0DE]">
                      <img src={worldFeatured.imageUrl} alt={worldFeatured.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#1a3a5c] text-white font-mono text-[9px] font-black tracking-widest px-2 py-0.5 rounded-none uppercase">
                          {worldFeatured.tag}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-[#1A1A1A] group-hover:text-[#c8232c] transition-colors leading-tight">
                        {worldFeatured.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-3 leading-relaxed">
                        {worldFeatured.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mt-3.5">
                        <img src={worldFeatured.author.avatar} alt={worldFeatured.author.name} className="w-5.5 h-5.5 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <span className="text-[10px] font-bold font-sans text-gray-700">{worldFeatured.author.name} · {worldFeatured.readTime}</span>
                      </div>
                    </div>
                  </article>
                )}

                {/* Right: Grid of Sub-articles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {worldSubList.map((art) => (
                    <article 
                      key={art.id} 
                      onClick={() => setSelectedArticle(art)}
                      className="flex flex-col group cursor-pointer"
                    >
                      <div className="w-full h-32 bg-gray-100 overflow-hidden rounded-none relative border border-[#E0E0DE]">
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      </div>
                      <div className="pt-2">
                        <h4 className="font-serif text-xs font-bold text-gray-900 group-hover:text-[#c8232c] transition-colors leading-snug line-clamp-2">
                          {art.title}
                        </h4>
                        <span className="text-[9px] font-mono text-gray-400 mt-1 block">{art.publishedAt}</span>
                      </div>
                    </article>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* Section 4: Science & Health Column - Side by Side List */}
          <section className="bg-white py-10 border-b border-[#E0E0DE]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-6">
                <h2 className="font-serif text-xl font-black flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-700" />
                  Science &amp; Health Desk
                </h2>
                <button 
                  onClick={() => { setActiveCategory('Science'); window.scrollTo(0, 0); }}
                  className="font-mono text-[10px] text-[#c8232c] font-black uppercase tracking-wider hover:underline bg-transparent border-none cursor-pointer"
                >
                  View All Science →
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Large wide featured card (Takes 7 Cols) */}
                {scienceFeatured && (
                  <article 
                    onClick={() => setSelectedArticle(scienceFeatured)}
                    className="lg:col-span-7 flex flex-col space-y-3 group cursor-pointer"
                  >
                    <div className="w-full h-64 bg-gray-100 rounded-none overflow-hidden relative border border-[#E0E0DE]">
                      <img src={scienceFeatured.imageUrl} alt={scienceFeatured.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-emerald-700 text-white font-mono text-[9px] font-black tracking-widest px-2 py-0.5 rounded-none uppercase">
                          {scienceFeatured.tag}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#c8232c] transition-colors leading-snug">
                        {scienceFeatured.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {scienceFeatured.subtitle}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-gray-400 font-mono">{scienceFeatured.publishedAt}</span>
                        <span className="text-[10px] font-sans font-bold text-gray-800">{scienceFeatured.author.name} · {scienceFeatured.readTime}</span>
                      </div>
                    </div>
                  </article>
                )}

                {/* Right: List of smaller articles (Takes 5 Cols) */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  {scienceList.map((art) => (
                    <article 
                      key={art.id} 
                      onClick={() => setSelectedArticle(art)}
                      className="flex gap-4 items-start group cursor-pointer pb-3 border-b border-gray-100 last:border-none last:pb-0"
                    >
                      <div className="w-20 h-16 shrink-0 rounded-none bg-gray-200 overflow-hidden border border-[#E0E0DE]">
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-xs font-bold text-gray-950 group-hover:text-[#c8232c] transition-colors leading-snug line-clamp-2">
                          {art.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-mono text-[#c8232c] uppercase font-bold tracking-tight">{art.category}</span>
                          <span className="text-[9px] text-gray-400 font-mono">{art.publishedAt}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* Section 5: Side-by-Side Category Lists (Business & Sports) + Main Feed Feed & Sidebar */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Main News Feed & side lists (Takes 8 Cols) */}
              <div className="lg:col-span-8 flex flex-col space-y-10">
                
                {/* Business vs Sports side-by-side lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Business desk list */}
                  <div>
                    <div className="border-b border-[#1A1A1A] pb-1.5 mb-4 flex justify-between items-center">
                      <h3 className="font-serif text-md font-black tracking-tight flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-[#c8232c]" /> Business Desk
                      </h3>
                      <button 
                        onClick={() => { setActiveCategory('Business'); window.scrollTo(0, 0); }}
                        className="text-[9px] font-mono font-bold text-gray-400 hover:text-black uppercase tracking-wider bg-transparent border-none cursor-pointer"
                      >
                        All →
                      </button>
                    </div>

                    {(() => {
                      const firstArt = businessList[0];
                      const remainingArts = businessList.slice(1);
                      return (
                        <div className="flex flex-col space-y-5">
                          {/* Large featured card matching the top portion of the uploaded image */}
                          {firstArt && (
                            <article
                              onClick={() => setSelectedArticle(firstArt)}
                              className="group cursor-pointer flex flex-col relative w-full overflow-hidden rounded-xl border border-[#E0E0DE] bg-black shadow-sm"
                            >
                              {/* Large 16:10 or 16:9 Image */}
                              <div className="w-full aspect-[16/10] overflow-hidden relative">
                                <img
                                  src={firstArt.imageUrl}
                                  alt={firstArt.title}
                                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                  referrerPolicy="no-referrer"
                                />
                                {/* Vignette/Gradient overlay */}
                                <div 
                                  className="absolute inset-0 z-10 pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
                                  }}
                                />
                                
                                {/* Document/Play Icon Overlay and Title positioned absolutely at bottom */}
                                <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex items-start select-text">
                                  
                                  {/* Title Headline on top of image */}
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-serif text-xs md:text-sm font-extrabold text-white leading-tight tracking-tight group-hover:text-red-400 transition-colors line-clamp-2">
                                      {firstArt.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-gray-300">
                                      <span>{firstArt.publishedAt}</span>
                                      <span>•</span>
                                      <span>{firstArt.readTime}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          )}

                          {/* Small list items below it */}
                          <div className="space-y-4">
                            {remainingArts.map((art, idx) => {
                              return (
                                <article
                                  key={art.id}
                                  onClick={() => setSelectedArticle(art)}
                                  className="flex gap-4 items-center group cursor-pointer"
                                >
                                  {/* Left Thumbnail */}
                                  <div className="w-24 h-18 md:w-28 md:h-20 shrink-0 rounded-lg overflow-hidden relative border border-[#E0E0DE] bg-gray-100 shadow-sm">
                                    <img
                                      src={art.imageUrl}
                                      alt={art.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>

                                  {/* Right Title Content */}
                                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                                    <h4 className="font-sans text-[11px] md:text-xs font-bold text-[#1A1A1A] leading-snug group-hover:text-[#c8232c] transition-colors line-clamp-3">
                                      {art.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 mt-1 text-[9px] text-gray-400 font-mono">
                                      <span className="uppercase tracking-wider font-semibold text-[#ef3a3e]">{art.category}</span>
                                      <span>•</span>
                                      <span>{art.publishedAt}</span>
                                    </div>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Sports desk list */}
                  <div>
                    <div className="border-b border-[#1A1A1A] pb-1.5 mb-4 flex justify-between items-center">
                      <h3 className="font-serif text-md font-black tracking-tight flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-[#1a3a5c]" /> Sports Desk
                      </h3>
                      <button 
                        onClick={() => { setActiveCategory('Sports'); window.scrollTo(0, 0); }}
                        className="text-[9px] font-mono font-bold text-gray-400 hover:text-black uppercase tracking-wider bg-transparent border-none cursor-pointer"
                      >
                        All →
                      </button>
                    </div>

                    {(() => {
                      const firstArt = sportsList[0];
                      const remainingArts = sportsList.slice(1);
                      return (
                        <div className="flex flex-col space-y-5">
                          {/* Large featured card matching the top portion of the uploaded image */}
                          {firstArt && (
                            <article
                              onClick={() => setSelectedArticle(firstArt)}
                              className="group cursor-pointer flex flex-col relative w-full overflow-hidden rounded-xl border border-[#E0E0DE] bg-black shadow-sm"
                            >
                              {/* Large 16:10 or 16:9 Image */}
                              <div className="w-full aspect-[16/10] overflow-hidden relative">
                                <img
                                  src={firstArt.imageUrl}
                                  alt={firstArt.title}
                                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                  referrerPolicy="no-referrer"
                                />
                                {/* Vignette/Gradient overlay */}
                                <div 
                                  className="absolute inset-0 z-10 pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
                                  }}
                                />
                                
                                {/* Document/Play Icon Overlay and Title positioned absolutely at bottom */}
                                <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex items-start select-text">
                                  
                                  {/* Title Headline on top of image */}
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-serif text-xs md:text-sm font-extrabold text-white leading-tight tracking-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                      {firstArt.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-gray-300">
                                      <span>{firstArt.publishedAt}</span>
                                      <span>•</span>
                                      <span>{firstArt.readTime}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          )}

                          {/* Small list items below it */}
                          <div className="space-y-4">
                            {remainingArts.map((art, idx) => {
                              return (
                                <article
                                  key={art.id}
                                  onClick={() => setSelectedArticle(art)}
                                  className="flex gap-4 items-center group cursor-pointer"
                                >
                                  {/* Left Thumbnail */}
                                  <div className="w-24 h-18 md:w-28 md:h-20 shrink-0 rounded-lg overflow-hidden relative border border-[#E0E0DE] bg-gray-100 shadow-sm">
                                    <img
                                      src={art.imageUrl}
                                      alt={art.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>

                                  {/* Right Title Content */}
                                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                                    <h4 className="font-sans text-[11px] md:text-xs font-bold text-[#1A1A1A] leading-snug group-hover:text-[#1a3a5c] transition-colors line-clamp-3">
                                      {art.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 mt-1 text-[9px] text-gray-400 font-mono">
                                      <span className="uppercase tracking-wider font-semibold text-[#1a3a5c]">{art.category}</span>
                                      <span>•</span>
                                      <span>{art.publishedAt}</span>
                                    </div>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Main continuous feed */}
                <div>
                  <div className="border-b border-[#1A1A1A] pb-2 mb-6">
                    <h3 className="font-serif text-xl font-black">
                      Latest Regional Feed
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {paginatedFeed.map((art) => (
                      <article 
                        key={art.id} 
                        onClick={() => setSelectedArticle(art)}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-none border border-[#E0E0DE] hover:border-[#1A1A1A] transition-all duration-200 group cursor-pointer"
                      >
                        <div className="sm:col-span-1 h-32 rounded-none bg-gray-200 overflow-hidden relative border border-[#E0E0DE]">
                          <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                        
                        <div className="sm:col-span-3 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#c8232c] text-white text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded-none uppercase font-bold">
                                {art.category}
                              </span>
                              {art.tag && (
                                <span className="bg-black/10 text-[#1A1A1A] text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded-none uppercase font-bold">
                                  {art.tag}
                                </span>
                              )}
                            </div>

                            <h4 className="font-serif text-md font-bold text-gray-950 mt-2 leading-snug group-hover:text-[#c8232c] transition-colors line-clamp-2">
                              {art.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                              {art.subtitle}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              By {art.author.name} · {art.publishedAt}
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-[#c8232c]">{art.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination triggers */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => { setCurrentPage(page); }}
                          className={`w-9 h-9 border font-mono text-xs font-bold rounded-none flex items-center justify-center cursor-pointer transition-colors ${
                            currentPage === page
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-[#1A1A1A] border-[#E0E0DE] hover:border-black hover:bg-black/5'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Sidebar (Takes 4 Cols) */}
              <aside className="lg:col-span-4 space-y-8">
                
                {/* Editor's Choices widget */}
                <div className="bg-white rounded-none border border-[#E0E0DE] p-5 shadow-none">
                  <div className="border-b border-[#1A1A1A] pb-2.5 mb-4 flex justify-between items-center">
                    <h3 className="font-serif text-sm font-bold text-[#1A1A1A]">
                      Editor's Premium Choices
                    </h3>
                  </div>

                  <div className="divide-y divide-[#E0E0DE]">
                    {editorsChoices.map((art, idx) => (
                      <article 
                        key={art.id} 
                        onClick={() => setSelectedArticle(art)}
                        className="py-3 flex items-start gap-3 group cursor-pointer first:pt-0 last:pb-0"
                      >
                        <span className="font-mono text-xl font-bold text-gray-300 group-hover:text-[#c8232c] leading-none">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-sans text-xs font-bold text-gray-900 leading-snug group-hover:text-[#c8232c] transition-colors line-clamp-3">
                            {art.title}
                          </h4>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Opinion Column widget */}
                <div className="bg-white rounded-none border border-[#E0E0DE] p-5 shadow-none">
                  <div className="border-b border-[#1A1A1A] pb-2.5 mb-4">
                    <h3 className="font-serif text-sm font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#c8232c]" /> Opinion &amp; Analysis
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {opinionArticles.map((art) => (
                      <article 
                        key={art.id} 
                        onClick={() => setSelectedArticle(art)}
                        className="group cursor-pointer pb-3 border-b border-gray-100 last:border-none last:pb-0"
                      >
                        <span className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-wider">{art.tag}</span>
                        <h4 className="font-serif text-xs font-bold text-gray-950 group-hover:text-[#c8232c] mt-1 leading-snug">
                          "{art.title}"
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <img src={art.author.avatar} alt={art.author.name} className="w-4.5 h-4.5 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <span className="text-[10px] text-gray-500 font-sans">By {art.author.name}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Follow Socials Grid */}
                <div className="bg-[#f8f9fb] rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="border-b border-gray-200 pb-3 mb-5">
                    <h3 className="font-serif text-sm font-bold text-gray-900">
                      Follow Our Desks
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Facebook */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-b from-[#1877F2] to-[#145CB8] shadow-inner text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Facebook className="w-5 h-5 fill-current" strokeWidth={0} />
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>

                    {/* Instagram */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-inner text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>

                    {/* Twitter */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-b from-[#1DA1F2] to-[#1283C9] shadow-inner text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Twitter className="w-5 h-5 fill-current" strokeWidth={0} />
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>

                    {/* Snapchat */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-b from-[#FFFC00] to-[#E5E200] shadow-inner text-black flex-shrink-0 group-hover:scale-105 transition-transform">
                        {/* Custom Snapchat icon as we don't have it in lucide by default without importing specific icon pack. Wait, does Lucide have ghost? Yes, Ghost */}
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.12 1.49c-3.14-.09-5.59 2.01-6.19 4.75-.41 1.83.1 3.54 1.5 4.88-.13.3-.23.63-.3 1-.22 1.1-.06 2.02.66 2.7.2.19.46.33.74.45-.16.27-.33.52-.5.77-1.12 1.64-3.19 2.37-4.47 2.66-.46.1-.9.18-1.28.25-1.55.28-2.26 1.05-2.28 2.03-.02.96 1.05 1.5 2.5 1.89 2.63.71 6.17.9 9.53.9 3.39 0 6.94-.2 9.57-.92 1.45-.4 2.53-.94 2.51-1.9-.02-.98-.73-1.74-2.27-2.02-.38-.07-.81-.15-1.27-.24-1.27-.27-3.34-1-4.46-2.62-.17-.25-.33-.5-.49-.75.29-.11.55-.26.75-.46.73-.69.89-1.6.66-2.7-.07-.37-.18-.7-.31-1 1.4-1.34 1.9-3.05 1.49-4.88-.61-2.74-3.07-4.84-6.22-4.75z"/></svg>
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>

                    {/* TikTok */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-b from-[#111111] to-[#000000] shadow-inner text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.37.71-4.75 2.5-6.19 1.45-1.17 3.32-1.6 5.14-1.25v4.06c-1.22-.3-2.58.07-3.35 1.05-.72.84-.96 2.05-.59 3.08.38 1.05 1.25 1.88 2.33 2.12 1.25.26 2.64-.13 3.44-1.12.59-.72.86-1.66.82-2.61-.05-6.52-.03-13.04-.03-19.56z"/></svg>
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>

                    {/* YouTube */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-b from-[#FF0000] to-[#CC0000] shadow-inner text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Youtube className="w-5 h-5 fill-current" strokeWidth={0} />
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>

                    {/* WhatsApp */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-b from-[#25D366] to-[#1DA851] shadow-inner text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.4 1.25 4.84L2 22l5.34-1.21A9.97 9.97 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.1 14.1c-.24.68-1.39 1.27-1.93 1.34-.51.07-1.15.11-3.23-.74-2.52-1.02-4.14-3.58-4.26-3.74-.13-.17-1.02-1.36-1.02-2.6 0-1.23.64-1.84.87-2.07.23-.23.5-.29.66-.29.17 0 .34 0 .48.01.15.01.35-.06.54.41.2.49.69 1.68.75 1.81.06.13.1.28.02.44-.08.17-.12.27-.24.41-.12.14-.25.31-.36.43-.13.12-.27.26-.12.52.15.26.67 1.11 1.44 1.8 1.01.9 1.83 1.18 2.09 1.3.26.12.41.1.57-.08.15-.18.66-.77.84-1.04.18-.27.35-.23.58-.14.23.09 1.47.69 1.72.82.25.13.41.19.47.3.07.11.07.64-.17 1.32z"/></svg>
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>

                    {/* LinkedIn */}
                    <button className="flex items-center h-12 w-full rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all overflow-hidden group">
                      <div className="w-10 h-10 ml-1 rounded-[14px] flex items-center justify-center bg-gradient-to-b from-[#0A66C2] to-[#074b91] shadow-inner text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Linkedin className="w-5 h-5 fill-current" strokeWidth={0} />
                      </div>
                      <span className="ml-3 text-xs font-semibold text-gray-500">/pulsejournal</span>
                    </button>
                  </div>
                </div>

              </aside>

            </div>
          </section>
        </main>
      )}

      {/* CATEGORY SPECIFIC LAYOUT PAGE (If clicking other than Home) */}
      {searchQuery.trim() === '' && activeCategory !== 'Home' && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-1 w-full animate-fade-in">
          
          {/* Category Banner Title */}
          <div className="border-b border-[#1A1A1A] pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-black uppercase flex items-center gap-2 tracking-tight">
                <span className="w-3 h-3 bg-[#c8232c]" />
                {activeCategory} Section
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-1 font-bold uppercase tracking-wider">
                Showing premium coverages for: {activeCategory}
              </p>
            </div>
            
            <button 
              onClick={() => { setActiveCategory('Home'); window.scrollTo(0, 0); }}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer bg-transparent border-none font-sans"
            >
              ← Back to Main Home
            </button>
          </div>

          {/* Category specific Grid */}
          {getCategoryArticles(activeCategory).length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <p className="font-serif text-lg font-bold text-gray-700">No recent articles in {activeCategory}</p>
              <p className="text-xs text-gray-500 mt-2">
                Our correspondents are currently assembling reports for this section. Please review other premium desks like Technology or World Affairs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: List of articles in category */}
              <div className="lg:col-span-8 space-y-6">
                {getCategoryArticles(activeCategory).map((art) => (
                  <article 
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-4 rounded-none border border-[#E0E0DE] hover:border-[#1A1A1A] transition-all duration-200 group cursor-pointer"
                  >
                    <div className="md:col-span-1 h-36 bg-gray-200 overflow-hidden rounded-none relative border border-[#E0E0DE]">
                      <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-[#c8232c] text-white text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded-none uppercase font-bold">
                          {art.tag}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[9px] text-gray-400 font-bold block">{art.publishedAt} · {art.readTime}</span>
                        <h3 className="font-serif text-md font-bold text-[#1A1A1A] mt-1 leading-snug group-hover:text-[#c8232c] transition-colors">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#6b6b6b] mt-1.5 line-clamp-2 leading-relaxed">
                          {art.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img src={art.author.avatar} alt={art.author.name} className="w-5.5 h-5.5 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <span className="text-[10px] font-bold font-sans text-gray-600">{art.author.name}</span>
                        </div>
                        <span className="text-xs font-bold text-[#c8232c] hover:underline flex items-center gap-1">
                          Read Story <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Right Column: Mini Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Section Specific RSS subscription box */}
                <div className="bg-[#1A1A1A] text-white rounded-none p-5 relative overflow-hidden border border-[#E0E0DE]">
                  <div className="absolute top-[-10px] right-[-10px] opacity-10">
                    <Rss className="w-24 h-24 text-white" />
                  </div>
                  <span className="font-mono text-[9px] text-[#c8232c] font-bold uppercase tracking-widest block mb-1">Stay Tuned</span>
                  <h4 className="font-serif text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                    <Rss className="w-4 h-4 text-[#c8232c] shrink-0" />
                    Subscribe to {activeCategory} RSS
                  </h4>
                  <p className="text-xs text-gray-300 leading-normal mb-4">
                    Receive automated notification feeds whenever we publish a breaking dispatch in the {activeCategory} section.
                  </p>
                  <button 
                    onClick={() => console.log(`Subscribed to RSS feed alerts for: ${activeCategory}`)}
                    className="w-full py-2 bg-[#c8232c] hover:bg-red-700 text-white text-xs font-bold uppercase rounded-none tracking-wider cursor-pointer transition-colors duration-150"
                  >
                    Activate Instant RSS
                  </button>
                </div>

                {/* Popular articles in this category */}
                <div className="bg-white rounded-none border border-[#E0E0DE] p-5 shadow-none">
                  <h3 className="font-serif text-sm font-bold border-b border-[#1A1A1A] pb-2 mb-3">Popular in {activeCategory}</h3>
                  <div className="divide-y divide-gray-100">
                    {getCategoryArticles(activeCategory).slice(0, 3).map((art, i) => (
                      <article 
                        key={art.id} 
                        onClick={() => setSelectedArticle(art)}
                        className="py-2.5 first:pt-0 last:pb-0 flex gap-3.5 items-start group cursor-pointer"
                      >
                        <span className="font-mono text-base font-bold text-gray-300 group-hover:text-[#c8232c] leading-none pt-0.5">
                          0{i + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold font-sans text-gray-900 leading-snug group-hover:text-[#c8232c] line-clamp-2">
                            {art.title}
                          </h4>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      )}
      </>
      )}

      {/* EMAIL NEWSLETTER BAR */}
      <Newsletter />

      {/* FOOTER DESKS LIST */}
      <Footer 
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
          setSelectedArticle(null);
          window.scrollTo(0, 0);
        }}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
      />

      {/* SLIDE-OUT READING BOOKMARKS DRAWER */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedArticles={savedArticles}
        onRemove={(id) => {
          const updated = savedArticles.filter(art => art.id !== id);
          setSavedArticles(updated);
          syncBookmarksToStorage(updated);
        }}
        onClearAll={handleClearAllBookmarks}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* SUBSCRIPTION MODAL POPUP (TIERS) */}
      {isSubscribeModalOpen && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#1A1A1A] max-w-md w-full rounded-none shadow-none p-6 relative border border-[#E0E0DE] flex flex-col">
            
            {/* Close Button */}
            <button
              onClick={() => setIsSubscribeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-none border border-[#E0E0DE] hover:bg-gray-100 text-[#1A1A1A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Heading */}
            <div className="text-center pb-4 border-b border-gray-100">
              <span className="font-mono text-[9px] text-[#c8232c] font-black uppercase tracking-widest flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-[#c8232c]" /> Unlock Premium Journal
              </span>
              <h3 className="font-serif text-xl font-black text-gray-900 mt-1">Unlock Unrestricted Access</h3>
              <p className="text-xs text-gray-500 mt-1">Independent investigative dispatches, free from advertisements.</p>
            </div>

            {subStatus === 'success' ? (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-4 animate-scale-up">
                <div className="w-16 h-16 rounded-none bg-emerald-100 flex items-center justify-center text-emerald-500 text-3xl border border-emerald-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 fill-emerald-100 animate-pulse" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gray-900">Subscription Activated!</h4>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Thank you! Your transaction is complete. You now possess full premium clearance. Happy reading!
                </p>
                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 justify-center pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure 256-bit payment node
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-4 pt-4 flex-1">
                {/* Selector Tiers */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSubTier('weekly')}
                    className={`p-3 rounded-none border text-center transition-all cursor-pointer ${
                      subTier === 'weekly' 
                        ? 'border-[#c8232c] bg-red-50/10 text-[#c8232c]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-[9px] font-mono uppercase font-black tracking-wider">Weekly</span>
                    <span className="block font-serif text-base font-black text-gray-950 mt-0.5">$1.99</span>
                    <span className="block text-[8px] text-gray-400 mt-0.5">Billed Weekly</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubTier('monthly')}
                    className={`p-3 rounded-none border text-center transition-all cursor-pointer ${
                      subTier === 'monthly' 
                        ? 'border-[#c8232c] bg-red-50/10 text-[#c8232c]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-[9px] font-mono uppercase font-black tracking-wider">Monthly</span>
                    <span className="block font-serif text-base font-black text-gray-950 mt-0.5">$5.99</span>
                    <span className="block text-[8px] text-gray-400 mt-0.5">Save 15%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubTier('annual')}
                    className={`p-3 rounded-none border text-center transition-all cursor-pointer ${
                      subTier === 'annual' 
                        ? 'border-[#c8232c] bg-red-50/10 text-[#c8232c]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-[9px] font-mono uppercase font-black tracking-wider">Annual</span>
                    <span className="block font-serif text-base font-black text-gray-950 mt-0.5">$24.99</span>
                    <span className="block text-[8px] text-gray-400 mt-0.5">Save 40%</span>
                  </button>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-gray-500 mb-1">
                      Email Address
                    </label>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-none overflow-hidden p-1 focus-within:border-gray-500">
                      <div className="p-2 text-gray-400 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="editor@firm.com"
                        value={subEmail}
                        onChange={(e) => setSubEmail(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-gray-500 mb-1">
                      Simulation Payment Card
                    </label>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-none overflow-hidden p-1 focus-within:border-gray-500">
                      <div className="p-2 text-gray-400 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setCardNumber(val);
                        }}
                        className="w-full bg-transparent border-none outline-none text-xs text-[#1A1A1A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="bg-gray-50 rounded-none p-3 border border-gray-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-700 block">Bank-Grade Secure Encryption</span>
                    <p className="text-[9px] text-gray-500 leading-tight">Payments processed via decentralized secure gateways. Zero card logs stored.</p>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#c8232c] hover:bg-[#a01a22] text-white text-xs font-bold uppercase rounded-none tracking-wider cursor-pointer transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-none mt-3"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Activate Clearance Node</span>
                </button>
              </form>
            )}

            {/* Fine print */}
            <p className="text-[9px] text-gray-400 text-center mt-4 leading-normal">
              Cancel anytime. Billed under standard news subscription codes. By proceeding, you agree to our terms.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

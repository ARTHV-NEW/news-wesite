import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bookmark, Menu, X, User, Cloud, ChevronDown, 
  Facebook, Instagram, Twitter, Youtube, Globe, Sparkles 
} from 'lucide-react';
import { Category } from '../types';
import { useAuth } from '../AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenSubscribe: () => void;
  siteName?: string;
  siteLogoText?: string;
  menuItems?: any[];
}

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  savedCount,
  onOpenSaved,
  onOpenSubscribe,
  siteName,
  siteLogoText,
  menuItems,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();

  // Handle scroll detection for sticky navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
  }, []);

  // Default Categories
  const defaultCategories: Category[] = [
    'Home',
    'World',
    'Politics',
    'Business',
    'Technology',
    'Health',
    'Science',
    'Sports',
    'Culture',
    'Opinion',
  ];

  const categories: Category[] = menuItems && menuItems.length > 0
    ? menuItems.map(item => item.link as Category)
    : defaultCategories;

  // Curate a minimalist layout: Core sections visible directly, others inside "More" dropdown
  // We showcase the first 6 main categories inline, and tuck the rest under "More"
  const primaryCount = categories.length > 6 ? 6 : categories.length;
  const primaryCategories = categories.slice(0, primaryCount);
  const secondaryCategories = categories.slice(primaryCount);

  return (
    <header className="w-full bg-[#F9F9F8] text-[#1A1A1A]">
      
      {/* 1. TOPBAR (Desktop only) */}
      <div className="hidden md:block w-full bg-white text-black py-2.5 px-6 md:px-8 text-xs font-sans border-b border-gray-100 uppercase tracking-widest font-bold text-gray-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Weather and Date */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 font-extrabold text-[#1A1A1A]">
              <Cloud className="w-4 h-4 text-sky-500 fill-sky-100" />
              <span>20.5°C</span>
              <span className="text-gray-300 mx-1">|</span>
              <span>London</span>
            </div>
            <div className="text-gray-400 font-medium">
              {currentTime || 'Saturday, June 27, 2026'}
            </div>
          </div>
          
          {/* Right: Quick Links and Socials */}
          <div className="flex items-center gap-6 text-gray-400 font-extrabold">
            <button 
              onClick={() => setActiveCategory('About')} 
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              About us
            </button>
            <button 
              onClick={() => setActiveCategory('Contact')} 
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Contact us
            </button>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-red-600 transition-colors"><Facebook className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-red-600 transition-colors"><Instagram className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-red-600 transition-colors"><Twitter className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-red-600 transition-colors"><Youtube className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND MASTHEAD (Scrolls away) */}
      <div className="hidden md:block w-full bg-white border-b border-gray-100 py-6 md:py-8 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Menu & Search toggles */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-red-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span className="font-extrabold text-xs uppercase tracking-wider">Explore</span>
            </button>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 text-gray-800 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" />
              <span className="font-extrabold text-xs uppercase tracking-wider">Search</span>
            </button>
          </div>

          {/* Center: Brand Identity Logo */}
          <div 
            onClick={() => { setActiveCategory('Home'); setSearchQuery(''); }}
            className="hidden md:flex items-center cursor-pointer select-none mx-auto md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            <h1 
              className="hidden md:block md:text-2xl lg:text-4xl xl:text-5xl font-black tracking-tight text-[#ef3a3e] italic whitespace-nowrap transition-all duration-200" 
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {siteName || 'The Pulse Journal'}
            </h1>
            <span className="hidden md:inline-block font-sans text-[8px] sm:text-xs font-black italic tracking-widest text-black uppercase ml-1 border-l-2 border-red-600 pl-1">
              {siteLogoText || 'PRO'}
            </span>
          </div>

          {/* Right: Personalization & CTA */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => user ? setActiveCategory('Profile') : setIsAuthModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:text-red-600 text-gray-800 font-extrabold text-xs uppercase tracking-wider transition-colors"
            >
              <User className="w-4.5 h-4.5" />
              <span>{user ? 'My Account' : 'Sign in'}</span>
            </button>

            <button
              onClick={onOpenSubscribe}
              className="bg-[#ef3a3e] hover:bg-[#d12a2e] text-white font-extrabold text-xs px-5 py-3 tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-[0_2px_4px_rgba(239,58,62,0.15)] hover:shadow-[0_4px_8px_rgba(239,58,62,0.25)] rounded-none"
            >
              Subscribe
            </button>
          </div>
          
        </div>
      </div>

      {/* 3. DYNAMIC STICKY NAVIGATION BAR (Desktop & Mobile Unified) */}
      <nav className={`w-full bg-white border-b border-gray-200 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'fixed top-0 left-0 shadow-md py-2 animate-slide-down' 
          : 'relative py-1'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* MOBILE ONLY NAV CONTROLS */}
          <div className="flex md:hidden items-center justify-between w-full h-12">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-800 hover:text-red-600 transition-colors"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Small Logo on Mobile Header */}
            <div 
              onClick={() => { setActiveCategory('Home'); setSearchQuery(''); }}
              className="flex items-center cursor-pointer"
            >
              <span className="font-serif text-xl font-black tracking-tight text-[#ef3a3e] italic">
                {siteName || 'The Pulse Journal'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 text-gray-800 hover:text-red-600"
                aria-label="Search articles"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={onOpenSaved}
                className="p-2 text-gray-800 hover:text-red-600 relative"
                aria-label="Saved articles"
              >
                <Bookmark className={`w-5 h-5 ${savedCount > 0 ? 'fill-[#ef3a3e] text-[#ef3a3e]' : ''}`} />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#ef3a3e] text-white text-[9px] font-sans font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP INTEGRATED NAV BAR ELEMENTS */}
          <div className="hidden md:flex items-center justify-between w-full">
            
            {/* Scrolled-state Logo (Revealed on scroll) */}
            <div 
              onClick={() => { setActiveCategory('Home'); setSearchQuery(''); }}
              className={`flex items-center cursor-pointer transition-all duration-300 transform origin-left mr-4 ${
                isScrolled ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-90 w-0 pointer-events-none'
              }`}
            >
              <span className="font-serif text-lg font-black text-[#ef3a3e] italic whitespace-nowrap">
                {siteName || 'The Pulse Journal'}
              </span>
            </div>

            {/* Curated Minimalist Navigation Tabs */}
            <div className="flex items-center gap-1.5 flex-1 justify-center md:justify-start">
              {primaryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery('');
                  }}
                  className={`py-2 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'text-[#ef3a3e] border-[#ef3a3e]'
                      : 'text-gray-500 border-transparent hover:text-[#1A1A1A] hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Minimalist "More" Dropdown for excess categories */}
              {secondaryCategories.length > 0 && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className={`py-2 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                      secondaryCategories.includes(activeCategory)
                        ? 'text-[#ef3a3e] border-[#ef3a3e]'
                        : 'text-gray-500 border-transparent hover:text-[#1A1A1A] hover:border-gray-300'
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMoreOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl py-2 z-[200] rounded-none">
                      {secondaryCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setSearchQuery('');
                            setIsMoreOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-xs font-extrabold uppercase tracking-widest transition-colors ${
                            activeCategory === cat
                              ? 'text-[#ef3a3e] bg-red-50/50'
                              : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scrolled-state Actions (Revealed on scroll) */}
            <div className={`flex items-center gap-4 transition-all duration-300 ${
              isScrolled ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-90 w-0 pointer-events-none'
            }`}>
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="p-1.5 text-gray-700 hover:text-red-600 transition-colors"
                title="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
              
              <button 
                onClick={onOpenSaved}
                className="p-1.5 text-gray-700 hover:text-red-600 transition-colors relative"
                title="Bookmarks"
              >
                <Bookmark className={`w-4.5 h-4.5 ${savedCount > 0 ? 'fill-[#ef3a3e] text-[#ef3a3e]' : ''}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ef3a3e] text-white text-[8px] font-sans font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {savedCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => user ? setActiveCategory('Profile') : setIsAuthModalOpen(true)}
                className="p-1.5 text-gray-700 hover:text-red-600 transition-colors"
                title="My Account"
              >
                <User className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={onOpenSubscribe}
                className="bg-[#ef3a3e] hover:bg-[#d12a2e] text-white font-extrabold text-[10px] px-3.5 py-2.5 tracking-wider uppercase transition-colors cursor-pointer rounded-none ml-2"
              >
                Subscribe
              </button>
            </div>

          </div>

        </div>
      </nav>

      {/* 4. PREMIUM EXPANSION MENU (Sidebar Slide-over) */}
      <div 
        className={`fixed inset-0 z-[500] transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Semi-transparent Backdrop with Glassmorphism */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer Panel Sliding in from left */}
        <div 
          className={`absolute top-0 left-0 h-full w-full max-w-xs bg-white shadow-2xl flex flex-col p-6 overflow-y-auto border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Logo Section */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-black text-[#ef3a3e] italic">
                {siteName || 'The Pulse Journal'}
              </span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Categories Navigation Grid */}
          <div className="space-y-1 mb-8">
            <label className="block text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 font-extrabold mb-3">
              Editorial Sections
            </label>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery('');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-3 px-4 text-xs font-extrabold uppercase tracking-widest transition-all rounded-none ${
                    activeCategory === cat
                      ? 'bg-red-50 text-[#ef3a3e] border-l-4 border-[#ef3a3e] font-black'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions & Membership links */}
          <div className="space-y-4 mb-8 pt-6 border-t border-gray-100">
            <label className="block text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 font-extrabold mb-2">
              Reader Options
            </label>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  user ? setActiveCategory('Profile') : setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-3 w-full py-2.5 px-3 hover:bg-gray-50 text-xs font-extrabold text-gray-700 uppercase tracking-widest transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>{user ? 'My Profile' : 'Sign In / Register'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSaved();
                }}
                className="flex items-center justify-between w-full py-2.5 px-3 hover:bg-gray-50 text-xs font-extrabold text-gray-700 uppercase tracking-widest transition-all cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-gray-400" />
                  <span>Saved Articles</span>
                </span>
                {savedCount > 0 ? (
                  <span className="bg-[#ef3a3e] text-white text-[9px] font-sans font-extrabold px-2 py-0.5 rounded-full">
                    {savedCount}
                  </span>
                ) : (
                  <span className="text-gray-300">0</span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSubscribe();
                }}
                className="w-full mt-2 py-3 bg-[#ef3a3e] hover:bg-[#d12a2e] text-white text-xs font-extrabold uppercase tracking-widest transition-colors text-center shadow-md cursor-pointer"
              >
                Become a Member
              </button>
            </div>
          </div>

          {/* Static Pages and Support */}
          <div className="mt-auto pt-6 border-t border-gray-100 text-[10px] font-mono text-gray-400 flex flex-col gap-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <button onClick={() => { setActiveCategory('About'); setIsMobileMenuOpen(false); }} className="hover:text-black text-left uppercase font-bold tracking-wider">About</button>
              <button onClick={() => { setActiveCategory('Contact'); setIsMobileMenuOpen(false); }} className="hover:text-black text-left uppercase font-bold tracking-wider">Contact</button>
              <button onClick={() => { setActiveCategory('Privacy'); setIsMobileMenuOpen(false); }} className="hover:text-black text-left uppercase font-bold tracking-wider">Privacy</button>
            </div>
            <p className="mt-4">
              © 2026 {siteName || 'The Pulse Journal'}.<br />All rights reserved.
            </p>
          </div>

        </div>
      </div>

      {/* 5. USER AUTH MODAL COMPONENT */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* 6. FULL-SCREEN DIALOG SEARCH OVERLAY */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsSearchModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-white shadow-2xl mt-16 md:mt-24 p-6 md:p-10 animate-fade-in rounded-none">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
              aria-label="Close search modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Search global briefings</label>
              <div className="flex items-center border-b-2 border-black pb-2 mt-2">
                <Search className="w-6 h-6 text-black mr-4" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter keywords, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsSearchModalOpen(false);
                    }
                  }}
                  className="w-full text-xl md:text-3xl font-bold outline-none placeholder:text-gray-200 text-black bg-transparent"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setIsSearchModalOpen(false)}
                  className="bg-[#ef3a3e] text-white px-8 py-3.5 font-extrabold uppercase tracking-widest text-xs hover:bg-[#d12a2e] transition-colors cursor-pointer"
                >
                  Query Pulse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

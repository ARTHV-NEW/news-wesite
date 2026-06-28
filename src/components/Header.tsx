import React, { useState, useEffect } from 'react';
import { Search, Globe, Bookmark, Sparkles, Calendar, ArrowRight, Menu, X, User, Cloud, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Category } from '../types';
import { useAuth } from '../AuthContext';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';

interface HeaderProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenSubscribe: () => void;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  savedCount,
  onOpenSaved,
  onOpenSubscribe,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const { user } = useAuth();

  // Clock effect
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

  const categories: Category[] = [
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

  return (
    <header className="w-full bg-[#F9F9F8] text-[#1A1A1A] border-b border-[#E0E0DE]">
      {/* 1. TOPBAR */}
      <div className="hidden md:block w-full bg-white text-black py-2 px-4 md:px-8 text-sm font-sans border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left: Weather and Date */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold">
              <Cloud className="w-5 h-5 fill-black" />
              <span className="flex items-start">
                20.5 <sup className="text-[10px] mt-0.5 ml-0.5">C</sup>
              </span>
              <span className="ml-1">London</span>
            </div>
            <div className="text-gray-500">
              {currentTime || 'Saturday, June 27, 2026'}
            </div>
          </div>
          
          {/* Right: Links and Socials */}
          <div className="flex items-center gap-4 font-bold text-sm">
            <button className="hover:text-gray-600 transition-colors">About us</button>
            <button className="hover:text-gray-600 transition-colors">Contact us</button>
            
            <div className="flex items-center gap-4 ml-2">
              <button className="hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </button>
              <button className="hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button className="hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD */}
      <div className="w-full bg-white border-b border-gray-200 py-3 md:py-6 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Menu & Search */}
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-1 md:gap-2 cursor-pointer text-[#ef3a3e] hover:opacity-80 transition-opacity"
            >
              <span className="hidden md:inline font-bold text-sm tracking-wider uppercase">Menu</span>
              {isMobileMenuOpen ? <X className="w-6 h-6 md:w-6 md:h-6" /> : <Menu className="w-6 h-6 md:w-6 md:h-6" />}
            </button>
            
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden md:flex items-center gap-2 text-black transition-colors hover:opacity-80 cursor-pointer"
            >
              <span className="font-bold text-base">Search</span>
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Logo */}
          <div 
            onClick={() => { setActiveCategory('Home'); setSearchQuery(''); }}
            className="flex items-start cursor-pointer select-none absolute left-1/2 -translate-x-1/2 w-max"
          >
            <h1 
              className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#ef3a3e] italic whitespace-nowrap" 
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', transform: 'scaleY(1.1)' }}
            >
              The Pulse Journal
            </h1>
            <span className="font-sans text-[8px] sm:text-xs font-bold italic tracking-widest text-black uppercase mt-0.5 sm:mt-1 md:mt-2 ml-0.5 sm:ml-1">
              PRO
            </span>
          </div>

          {/* Right: Account & Subscribe */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Search Button */}
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="md:hidden flex items-center cursor-pointer text-black hover:opacity-80 transition-opacity"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Desktop Account & Subscribe */}
            <div className="hidden md:flex items-center gap-6 md:gap-8">
              <button
                onClick={() => user ? setIsProfileModalOpen(true) : setIsAuthModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-black"
              >
                <User className="w-5 h-5 stroke-[2]" />
                <span className="font-bold text-base">{user ? 'My account' : 'Sign in'}</span>
              </button>
  
              <button
                onClick={onOpenSubscribe}
                className="bg-[#ef3a3e] hover:bg-[#d12a2e] text-white font-bold text-xs md:text-sm px-4 md:px-5 py-2.5 tracking-wider uppercase transition-colors cursor-pointer rounded-sm"
              >
                Subscribe
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* 3. STICKY NAV */}
      <nav className="w-full bg-white border-b border-[#E0E0DE] sticky top-0 z-50 overflow-x-auto shadow-none no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchQuery(''); // clear search on category change
              }}
              className={`py-1.5 px-4.5 text-[13px] font-medium tracking-tight border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'text-[#1A1A1A] border-black font-semibold'
                  : 'text-[#1A1A1A] opacity-60 hover:opacity-100 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Sidebar Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[130] transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 left-0 h-full w-full max-w-xs bg-white shadow-2xl flex flex-col p-6 overflow-y-auto border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2">
              <span 
                className="text-xl font-bold tracking-tight text-[#ef3a3e] italic" 
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', transform: 'scaleY(1.1)' }}
              >
                The Pulse Journal
              </span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-1 mb-6 flex-1">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold mb-3">
              Sections
            </label>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 text-sm font-bold tracking-wider uppercase transition-colors rounded-sm ${
                  activeCategory === cat
                    ? 'bg-[#ef3a3e] text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Actions Section */}
          <div className="space-y-3 mb-6">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
              Account
            </label>
            
            {/* Mobile Account / Sign In */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                user ? setIsProfileModalOpen(true) : setIsAuthModalOpen(true);
              }}
              className="md:hidden flex items-center justify-between w-full px-4 py-3 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-sm text-xs font-semibold text-black uppercase tracking-wider transition-all duration-200 cursor-pointer mb-2"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{user ? 'My Profile' : 'Sign In'}</span>
              </div>
            </button>

            {/* Mobile Subscribe */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSubscribe();
              }}
              className="md:hidden flex items-center justify-center w-full px-4 py-3 bg-[#ef3a3e] text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer mb-2"
            >
              Subscribe
            </button>

            <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold mt-4">
              Quick Actions
            </label>

            {/* Saved Articles */}
            <button
              onClick={() => {
                onOpenSaved();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-sm text-xs font-semibold text-black uppercase tracking-wider transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'fill-[#ef3a3e] text-[#ef3a3e]' : 'text-gray-500'}`} />
                <span>Saved Articles</span>
              </div>
              {savedCount > 0 ? (
                <span className="bg-[#ef3a3e] text-white text-[10px] px-2 py-0.5 font-bold">
                  {savedCount}
                </span>
              ) : (
                <span className="text-gray-400 font-normal">0</span>
              )}
            </button>
          </div>

          {/* Extra Menu Links */}
          <div className="mt-auto pt-6 border-t border-gray-200 text-xs font-sans text-gray-500 flex flex-col gap-3">
            <button onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black text-left">About Us</button>
            <button onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black text-left">Contact Us</button>
            <p className="text-[10px] text-gray-400 mt-4">
              © 2026 The Pulse Journal. All rights reserved.
            </p>
          </div>

        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSearchModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-white shadow-2xl mt-16 md:mt-24 p-6 md:p-10 animate-fade-in">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Search The Pulse Journal</label>
              <div className="flex items-center border-b-2 border-black pb-2">
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
                  className="w-full text-xl md:text-3xl font-bold outline-none placeholder:text-gray-300 text-black bg-transparent"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setIsSearchModalOpen(false)}
                  className="bg-[#ef3a3e] text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-[#d12a2e] transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

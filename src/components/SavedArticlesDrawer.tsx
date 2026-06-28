import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onSelectArticle: (article: Article) => void;
}

export default function SavedArticlesDrawer({
  isOpen,
  onClose,
  savedArticles,
  onRemove,
  onClearAll,
  onSelectArticle,
}: SavedArticlesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md h-full bg-[#F9F9F8] text-[#1A1A1A] shadow-none flex flex-col z-10 border-l border-[#E0E0DE] animate-slide-in">
        {/* Header */}
        <div className="p-5 border-b border-[#E0E0DE] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4.5 h-4.5 text-[#c8232c] fill-[#c8232c]" />
            <h2 className="font-serif text-lg font-black tracking-tight">Your Reading List</h2>
            <span className="font-mono text-xs text-gray-500 font-bold bg-[#F9F9F8] border border-[#E0E0DE] px-2 py-0.5 rounded-none">
              {savedArticles.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-none hover:bg-gray-100 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {savedArticles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center border border-[#E0E0DE] mb-4 text-gray-300">
                <Bookmark className="w-7.5 h-7.5" />
              </div>
              <h3 className="font-serif text-base font-bold text-gray-800">Your list is empty</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[240px] leading-relaxed">
                Tap the bookmark icon on any news story to save it here for offline reading.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E0E0DE]">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold">Saved Articles</span>
                <button
                  onClick={onClearAll}
                  className="flex items-center gap-1.5 text-xs text-[#c8232c] font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {savedArticles.map((article) => (
                  <div 
                    key={article.id}
                    className="bg-white border border-[#E0E0DE] rounded-none p-3 hover:border-black transition-all duration-200 flex gap-3.5 items-start group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-none overflow-hidden shrink-0 bg-gray-200 border border-[#E0E0DE] relative">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Content text */}
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[9px] text-[#c8232c] font-bold tracking-wider uppercase">
                        {article.category}
                      </span>
                      <h4 
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="font-serif text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-snug hover:text-[#c8232c] cursor-pointer mt-0.5"
                      >
                        {article.title}
                      </h4>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-500 font-mono">
                          {article.readTime}
                        </span>
                        
                        <button
                          onClick={() => onRemove(article.id)}
                          className="text-[10px] font-mono text-gray-400 hover:text-rose-600 flex items-center gap-1 bg-transparent border-none cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        {savedArticles.length > 0 && (
          <div className="p-5 border-t border-[#E0E0DE] bg-white">
            <p className="text-[11px] text-[#6b6b6b] leading-normal text-center">
              Your bookmarks are saved locally on your device for offline access anytime.
            </p>
          </div>
        )}
      </div>

      {/* Slide-in styles */}
      <style>{`
        @keyframes slideIn {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

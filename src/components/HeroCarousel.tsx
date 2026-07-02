import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../types';

interface HeroCarouselProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export default function HeroCarousel({ articles, onSelectArticle }: HeroCarouselProps) {
  const [carouselArticles, setCarouselArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Swipe gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 1. Core Data Retrieval logic matching prompt guidelines:
  useEffect(() => {
    if (!articles || articles.length === 0) return;

    // Filter featured articles
    const featured = articles.filter(a => a.isFeatured);
    let selected: Article[] = [];

    if (featured.length >= 3) {
      // Sort featured desc by publishedAt
      selected = [...featured]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 8);
    } else {
      // Load Latest Published Posts
      const latest = [...articles]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 8);
      selected = latest;
    }

    // "Avoid duplicate categories consecutively whenever possible."
    const reorderToAvoidConsecutiveCategories = (items: Article[]): Article[] => {
      if (items.length <= 1) return items;
      const result: Article[] = [];
      const pool = [...items];

      result.push(pool.shift()!);

      while (pool.length > 0) {
        const lastCategory = result[result.length - 1].category;
        const diffIdx = pool.findIndex(item => item.category !== lastCategory);

        if (diffIdx !== -1) {
          result.push(pool.splice(diffIdx, 1)[0]);
        } else {
          result.push(pool.shift()!);
        }
      }
      return result;
    };

    const reordered = reorderToAvoidConsecutiveCategories(selected);
    setCarouselArticles(reordered);
    setCurrentIndex(0);
  }, [articles]);

  const slideCount = carouselArticles.length;

  // Slide handlers
  const handleNext = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const handlePrev = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Autoplay (every 3 seconds)
  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [slideCount, isPaused, handleNext]);

  // Swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  if (slideCount === 0) return null;

  return (
    <div 
      className="w-full flex flex-col space-y-3 group/carousel relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="hero-carousel-container"
    >
      {/* 4:3 aspect ratio frame with rounded corners */}
      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-2xl border border-[#E0E0DE] bg-[#1A1A1A] shadow-md">
        
        {/* SLIDES WINDOW */}
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ 
            transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {carouselArticles.map((article, index) => {
            const isActive = index === currentIndex;
            
            return (
              <div 
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="w-full h-full shrink-0 relative cursor-pointer select-none"
              >
                {/* Visual Image with 700ms transition and active subtle scale */}
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-transform duration-[3000ms] ease-out-quad ${
                    isActive ? 'scale-[1.03]' : 'scale-100'
                  }`}
                  style={{ transformOrigin: 'center' }}
                  referrerPolicy="no-referrer"
                />

                {/* Dark Gradient Overlay (Bottom 40-45% of image) */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-700" 
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)'
                  }}
                />

                {/* Hero Content Position - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 lg:p-7 z-20 flex flex-col justify-end text-left select-text">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="text-[#ef3a3e] font-mono text-[10px] font-black tracking-wider uppercase">
                      {article.category}
                    </span>
                  </div>

                  {/* Large Headline (Serif Font, Bold, Max 3 lines) */}
                  <h2 className="font-serif text-white font-extrabold leading-tight tracking-tight text-lg md:text-xl lg:text-2xl group-hover:text-red-400 transition-colors duration-200 line-clamp-3 mb-2.5">
                    {article.title}
                  </h2>

                  {/* Meta Row (date • read time) */}
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-white/80">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular manual controls (hover desktop, always visible mobile) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 
            opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 
            opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicators: Bottom center. Simple dots. */}
      <div className="flex items-center justify-center gap-2" id="carousel-slide-dots">
        {carouselArticles.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                isActive 
                  ? 'w-5 bg-[#ef3a3e]' 
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

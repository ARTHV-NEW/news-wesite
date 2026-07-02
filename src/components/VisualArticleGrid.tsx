import React from 'react';
import { ArrowRight, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface VisualArticleGridProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export default function VisualArticleGrid({ articles, onSelectArticle }: VisualArticleGridProps) {
  // Select top 5 visually compelling or featured articles
  const gridArticles = articles
    .filter(a => a.imageUrl)
    .slice(0, 5);

  if (gridArticles.length < 5) return null;

  const [main, second, third, fourth, fifth] = gridArticles;

  return (
    <section className="py-12 bg-[#F6F6F4] border-b border-[#E0E0DE]" id="editorial-visual-grid">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#ef3a3e] text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
                Visual Showcase
              </h2>
              <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase mt-0.5">
                In-depth editorial narratives captured in focus
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] bg-white border border-[#E0E0DE] px-3 py-1 text-gray-600 font-bold uppercase tracking-wider">
            Competitor Analysis Focus
          </span>
        </div>

        {/* 5-CARD ASYMMETRICAL EDITORIAL BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[240px] md:auto-rows-[220px] lg:auto-rows-[250px]">
          
          {/* CARD 1: THE BIG VISUAL HERO (Left 6 Columns, 2 Rows) */}
          <div 
            onClick={() => onSelectArticle(main)}
            className="lg:col-span-6 lg:row-span-2 md:col-span-2 relative group overflow-hidden border border-[#E0E0DE] bg-black cursor-pointer flex flex-col justify-end p-6 md:p-8"
            id={`visual-grid-card-${main.id}`}
          >
            {/* Image & Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={main.imageUrl} 
                alt={main.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out scale-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />
            </div>

            {/* Content (Above Overlay) */}
            <div className="relative z-20 space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#ef3a3e] text-white font-mono text-[9px] font-black tracking-widest px-2.5 py-1 uppercase shadow-sm">
                  {main.tag || 'In Focus'}
                </span>
                <span className="bg-black/40 backdrop-blur-md text-white/90 font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                  {main.category}
                </span>
              </div>

              <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight group-hover:text-red-400 transition-colors duration-200">
                {main.title}
              </h3>

              <p className="text-xs md:text-sm text-gray-200 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl">
                {main.subtitle}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-white/80">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={main.author.avatar} 
                    alt={main.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[11px] font-bold font-sans">{main.author.name}</p>
                    <p className="text-[9px] text-gray-300 font-mono tracking-wider uppercase">{main.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300 bg-white/10 backdrop-blur-sm px-2.5 py-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{main.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: LANDSCAPE SUB-HERO (Right 6 Columns, 1 Row) */}
          <div 
            onClick={() => onSelectArticle(second)}
            className="lg:col-span-6 md:col-span-1 relative group overflow-hidden border border-[#E0E0DE] bg-[#1A1A1A] cursor-pointer flex flex-col justify-end p-5"
            id={`visual-grid-card-${second.id}`}
          >
            {/* Image & Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={second.imageUrl} 
                alt={second.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out scale-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
            </div>

            {/* Content */}
            <div className="relative z-20 space-y-2">
              <span className="bg-white/95 text-black font-mono text-[8px] font-black tracking-widest px-2 py-0.5 uppercase">
                {second.category}
              </span>

              <h4 className="font-serif text-base lg:text-lg font-bold text-white leading-tight group-hover:text-red-400 transition-colors duration-200 line-clamp-2">
                {second.title}
              </h4>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 pt-2 border-t border-white/10">
                <span>By {second.author.name}</span>
                <span>{second.publishedAt}</span>
              </div>
            </div>
          </div>

          {/* CARD 3: THREE-COLUMN BENTO BLOCK A (Bottom Row, 3 Columns) */}
          <div 
            onClick={() => onSelectArticle(third)}
            className="lg:col-span-3 md:col-span-1 relative group overflow-hidden border border-[#E0E0DE] bg-white cursor-pointer flex flex-col justify-between p-4"
            id={`visual-grid-card-${third.id}`}
          >
            {/* Visual Header */}
            <div className="w-full h-[40%] overflow-hidden relative border-b border-gray-100">
              <img 
                src={third.imageUrl} 
                alt={third.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1.5 left-1.5 bg-[#ef3a3e] text-white font-mono text-[7px] font-black tracking-widest px-1.5 py-0.5 uppercase">
                {third.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between pt-3">
              <h5 className="font-serif text-xs font-extrabold text-gray-900 group-hover:text-[#ef3a3e] transition-colors leading-snug line-clamp-3">
                {third.title}
              </h5>

              <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 border-t border-gray-50 pt-2">
                <span>{third.publishedAt}</span>
                <span className="font-bold">{third.readTime}</span>
              </div>
            </div>
          </div>

          {/* CARD 4: THREE-COLUMN BENTO BLOCK B (Bottom Row, 3 Columns) */}
          <div 
            onClick={() => onSelectArticle(fourth)}
            className="lg:col-span-3 md:col-span-1 relative group overflow-hidden border border-[#E0E0DE] bg-white cursor-pointer flex flex-col justify-between p-4"
            id={`visual-grid-card-${fourth.id}`}
          >
            {/* Visual Header */}
            <div className="w-full h-[40%] overflow-hidden relative border-b border-gray-100">
              <img 
                src={fourth.imageUrl} 
                alt={fourth.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1.5 left-1.5 bg-gray-900 text-white font-mono text-[7px] font-black tracking-widest px-1.5 py-0.5 uppercase">
                {fourth.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between pt-3">
              <h5 className="font-serif text-xs font-extrabold text-gray-900 group-hover:text-[#ef3a3e] transition-colors leading-snug line-clamp-3">
                {fourth.title}
              </h5>

              <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 border-t border-gray-50 pt-2">
                <span>{fourth.publishedAt}</span>
                <span className="font-bold">{fourth.readTime}</span>
              </div>
            </div>
          </div>

          {/* CARD 5: THREE-COLUMN BENTO BLOCK C (Bottom Row, 3 Columns) / Standard text integration */}
          <div 
            onClick={() => onSelectArticle(fifth)}
            className="lg:col-span-3 md:col-span-2 relative group overflow-hidden border border-[#E0E0DE] bg-white cursor-pointer flex flex-col justify-between p-4"
            id={`visual-grid-card-${fifth.id}`}
          >
            {/* Visual Header */}
            <div className="w-full h-[40%] overflow-hidden relative border-b border-gray-100">
              <img 
                src={fifth.imageUrl} 
                alt={fifth.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1.5 left-1.5 bg-[#ef3a3e] text-white font-mono text-[7px] font-black tracking-widest px-1.5 py-0.5 uppercase">
                {fifth.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between pt-3">
              <h5 className="font-serif text-xs font-extrabold text-gray-900 group-hover:text-[#ef3a3e] transition-colors leading-snug line-clamp-3">
                {fifth.title}
              </h5>

              <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 border-t border-gray-50 pt-2">
                <span>{fifth.publishedAt}</span>
                <span className="font-bold">{fifth.readTime}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

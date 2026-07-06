import React from 'react';
import { Article } from '../types';

interface CategoryColumnsGridProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: string) => void;
}

export default function CategoryColumnsGrid({ articles, onSelectArticle, onSelectCategory }: CategoryColumnsGridProps) {
  const categories = ['Business', 'Technology', 'Science'];

  return (
    <section className="bg-[#F6F6F4] py-12 border-b border-[#E0E0DE]" id="editorial-visual-grid">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const catArticles = articles.filter((a) => a.category === category).slice(0, 5);
            if (catArticles.length === 0) return null;
            
            const mainArticle = catArticles[0];
            const listArticles = catArticles.slice(1, 5);

            return (
              <div key={category} className="flex flex-col">
                {/* Category Heading */}
                <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 bg-[#CC0000]" />
                    <h2 className="font-sans text-[22px] font-black text-[#0f2130] tracking-tight leading-none">
                      {category} Desk
                    </h2>
                  </div>
                  <button 
                    onClick={() => onSelectCategory(category)}
                    className="font-sans text-[11px] font-bold text-[#0f2130] uppercase tracking-wider hover:text-[#CC0000] transition-colors flex items-center"
                  >
                    ALL <span className="ml-1 text-sm leading-none">→</span>
                  </button>
                </div>

                {/* Main Article */}
                <div 
                  className="relative rounded-[14px] overflow-hidden mb-6 group cursor-pointer shadow-md"
                  onClick={() => onSelectArticle(mainArticle)}
                >
                  <div className="aspect-[16/10] w-full bg-gray-200">
                    <img 
                      src={mainArticle.imageUrl} 
                      alt={mainArticle.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <h3 className="font-sans text-lg font-black text-white group-hover:text-[#ef3a3e] transition-colors leading-tight mb-2.5">
                      {mainArticle.title}
                    </h3>
                    <div className="text-gray-200 text-[11px] font-sans font-semibold flex items-center">
                      <span>{mainArticle.publishedAt}</span>
                      <span className="mx-2">•</span>
                      <span>{mainArticle.readTime} read</span>
                    </div>
                  </div>
                </div>

                {/* List Articles */}
                <div className="space-y-5">
                  {listArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className="flex gap-4 group cursor-pointer items-start"
                      onClick={() => onSelectArticle(article)}
                    >
                      <div className="w-[120px] aspect-[16/10] shrink-0 rounded-xl overflow-hidden bg-gray-200 shadow border border-gray-100">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-start pt-1">
                        <h4 className="font-sans text-[14px] font-black text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2 mb-1.5">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-[10px] uppercase font-black text-gray-400 tracking-wider">
                          <span className="text-[#FF5252]">{article.category}</span>
                          <span className="mx-1.5">•</span>
                          <span>{article.publishedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

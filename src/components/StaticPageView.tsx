import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Category } from '../types';
import { subscribePages, PageContent } from '../services/db';

interface StaticPageViewProps {
  pageType: string;
  onNavigateBack: () => void;
}

export default function StaticPageView({ pageType, onNavigateBack }: StaticPageViewProps) {
  const [livePages, setLivePages] = useState<PageContent[]>([]);

  useEffect(() => {
    const unsubscribe = subscribePages((pages) => {
      setLivePages(pages);
    });
    return () => unsubscribe();
  }, []);
  
  const getPageContent = () => {
    // Attempt to find from live Firestore pages first (by id, slug, or lowercase match)
    const livePage = livePages.find(p => 
      p.id.toLowerCase() === pageType.toLowerCase() || 
      (p.slug && p.slug.toLowerCase() === pageType.toLowerCase())
    );
    if (livePage) {
      return {
        title: livePage.title,
        content: livePage.content
      };
    }

    switch (pageType) {
      case 'About':
        return {
          title: 'About Us',
          content: 'PulseNews is an independent global media organization dedicated to objective, rigorous, and deep investigative journalism. We cover the stories that alter policy, drive economies, and shape future societies. Founded by visionary journalists, we believe in truth and accountability.'
        };
      case 'Contact':
        return {
          title: 'Contact Us',
          content: 'We would love to hear from you. For general inquiries, email info@pulsenews.com. For tips and news leads, securely contact tips@pulsenews.com. Our global headquarters is located in London, UK.'
        };
      case 'Privacy':
        return {
          title: 'Privacy Policy',
          content: 'Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and share information about you when you interact with PulseNews. We do not sell your personal data to third parties.'
        };
      case 'Terms':
        return {
          title: 'Terms of Use',
          content: 'By accessing or using PulseNews, you agree to be bound by these Terms of Use. All content on this platform is the property of PulseNews Media Group and is protected by international copyright laws.'
        };
      case 'Cookies':
        return {
          title: 'Cookie Settings',
          content: 'PulseNews uses cookies to improve your experience and deliver personalized content. You can manage your cookie preferences through your browser settings.'
        };
      case 'Sitemap':
        return {
          title: 'Sitemap',
          content: 'Navigate through PulseNews: Home, World, Politics, Business, Technology, Science, Sports, Culture, Opinion.'
        };
      default:
        return {
          title: 'Page Not Found',
          content: 'The requested page could not be found.'
        };
    }
  };

  const { title, content } = getPageContent();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 animate-fade-in font-sans min-h-[60vh]">
      <button 
        onClick={onNavigateBack}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8 uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Back to News
      </button>

      <div className="bg-white p-8 md:p-12 border border-[#E0E0DE] shadow-sm rounded-2xl">
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight mb-8 text-[#1A1A1A]">
          {title}
        </h1>
        <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-p:leading-relaxed">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}

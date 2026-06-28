import React, { useState } from 'react';
import { 
  Globe, BookOpen, Newspaper, Award, HelpCircle, 
  Send, PhoneCall, ChevronRight, Check, Facebook, Twitter, Instagram, Youtube, Linkedin
} from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (category: Category) => void;
  onOpenSubscribe: () => void;
}

export default function Footer({ onSelectCategory, onOpenSubscribe }: FooterProps) {
  const [joinedWhatsApp, setJoinedWhatsApp] = useState(false);
  const [joinedTelegram, setJoinedTelegram] = useState(false);

  const sections = [
    { name: 'Home', cat: 'Home' as Category },
    { name: 'World News', cat: 'World' as Category },
    { name: 'Politics & Diplomacy', cat: 'Politics' as Category },
    { name: 'Business & Finance', cat: 'Business' as Category },
    { name: 'Tech & AI', cat: 'Technology' as Category },
    { name: 'Science & Health', cat: 'Science' as Category },
  ];

  const services = [
    { name: 'Morning Newsletter', href: '#newsletter' },
    { name: 'Weekly Podcasts', href: '#podcasts' },
    { name: 'Corporate Subscriptions', href: '#subscribe' },
    { name: 'RSS News Feed', href: '#rss' },
    { name: 'Advertise with Us', href: '#advertise' },
    { name: 'Careers & Fellowships', href: '#careers' },
  ];

  return (
    <footer id="footer" className="w-full bg-black text-gray-300 pt-16 pb-8 px-4 md:px-8 border-t border-[#E0E0DE]">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black rounded-none flex items-center justify-center font-serif text-lg font-black">
                P
              </div>
              <h3 className="font-serif text-xl font-black text-white tracking-tight italic">
                THE PULSE <span className="text-red-600 not-italic">JOURNAL</span>
              </h3>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              PulseNews is an independent global media organization dedicated to objective, rigorous, and deep investigative journalism. We cover the stories that alter policy, drive economies, and shape future societies.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => alert(`Redirecting to our official verified Facebook page...`)}
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200"
                title="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Redirecting to our official verified Instagram page...`)}
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-[#E1306C] hover:bg-[#E1306C] hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Redirecting to our official verified Twitter/X page...`)}
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200"
                title="Follow us on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Redirecting to our official verified YouTube page...`)}
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200"
                title="Follow us on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 2: News Sections */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-white border-b border-gray-800 pb-2">
              News Desks
            </h4>
            <ul className="space-y-2">
              {sections.map((sec, i) => (
                <li key={i}>
                  <button
                    onClick={() => onSelectCategory(sec.cat)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors duration-150 cursor-pointer bg-transparent border-none text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#c8232c]" />
                    <span>{sec.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-white border-b border-gray-800 pb-2">
              Premium Services
            </h4>
            <ul className="space-y-2">
              {services.map((ser, i) => (
                <li key={i}>
                  <a
                    href={ser.href}
                    onClick={(e) => {
                      if (ser.href === '#newsletter') {
                        e.preventDefault();
                        document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
                      } else if (ser.href === '#subscribe') {
                        e.preventDefault();
                        onOpenSubscribe();
                      } else {
                        e.preventDefault();
                        alert(`Consulting our official '${ser.name}' desk portal...`);
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors duration-150 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                    <span>{ser.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Community Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-white border-b border-gray-800 pb-2">
              Live Community Channels
            </h4>
            <p className="text-xs text-gray-400 leading-normal">
              Join our fast-delivery bulletins for instant breaking push alerts.
            </p>

            <div className="space-y-2.5">
              {/* WhatsApp Button */}
              <button
                onClick={() => {
                  setJoinedWhatsApp(true);
                  setTimeout(() => setJoinedWhatsApp(false), 3000);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-none border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  joinedWhatsApp 
                    ? 'bg-emerald-600 border-emerald-500 text-white' 
                    : 'bg-transparent border-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                    <path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.123.548 4.12 1.512 5.86L0 24l6.3-1.636C8.04 23.398 9.972 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                    <path fill="#FFF" d="M19.1 17.5c-.4 1.1-1.9 2-3 2.1-.9.1-2.1-.2-4.1-1.1-2.4-1-4.3-3.1-5.6-5.3-1.3-2.1-2.1-4.2-2.1-6 0-1.7.9-2.6 1.3-3 .4-.4 1-.5 1.4-.5.3 0 .7 0 1 .1.4.1.8 1.1 1.4 2.4.6 1.4.7 1.5 1 1.9.3.5.1 1.1-.3 1.6-.3.4-.6.8-1 1.1-.2.2-.4.5-.1.9.3.5 1 1.6 1.9 2.4 1 1 2 1.5 2.5 1.8.4.2.8.2 1.1-.1.3-.3.9-1.1 1.2-1.5.3-.4.8-.5 1.2-.4.5.2 2.8 1.3 3.3 1.6.4.2.7.3.8.5.1.4.1 1.3-.3 2.4z"/>
                  </svg>
                  <span>{joinedWhatsApp ? 'Connected to Channel' : 'Join WhatsApp Channel'}</span>
                </span>
                {joinedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
              </button>

              {/* Telegram Button */}
              <button
                onClick={() => {
                  setJoinedTelegram(true);
                  setTimeout(() => setJoinedTelegram(false), 3000);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-none border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  joinedTelegram 
                    ? 'bg-sky-600 border-sky-500 text-white' 
                    : 'bg-transparent border-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                    <path fill="#2CA5E0" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
                    <path fill="#FFF" d="M5.5 11.5l11-4.5c.5-.2 1 .2.8.7l-2 9.5c-.2.8-.7 1-1.3.6l-3.5-2.5-1.7 1.6c-.2.2-.4.2-.6.2l.2-3.5 6.5-5.8c.3-.2-.1-.4-.4-.2l-8 5-3.5-1.1c-.8-.2-.8-.8.2-1.2z"/>
                  </svg>
                  <span>{joinedTelegram ? 'Linked to Telegram' : 'Join Telegram Group'}</span>
                </span>
                {joinedTelegram ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 font-mono">
            © 2026 PulseNews Media Group. Independent Journalism is copyrighted globally. Registered under UN Press Union.
          </p>
          
          <div className="flex items-center gap-4 text-xs font-sans text-gray-500">
            <button onClick={() => onSelectCategory('Privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => onSelectCategory('Terms')} className="hover:text-white transition-colors">Terms of Use</button>
            <span>·</span>
            <button onClick={() => onSelectCategory('Cookies')} className="hover:text-white transition-colors">Cookie Settings</button>
            <span>·</span>
            <button onClick={() => onSelectCategory('Sitemap')} className="hover:text-white transition-colors">Sitemap</button>
          </div>
        </div>

      </div>
    </footer>
  );
}

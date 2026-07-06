import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

export default function FollowSocials() {
  return (
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
  );
}

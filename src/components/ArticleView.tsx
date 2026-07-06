import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 

  Bookmark, Heart, Send, Volume2, 
  MessageSquare, User, Clock, Share2, ZoomIn, ZoomOut,
  Play, Pause, Square, AlertCircle, ArrowLeft, Twitter, Facebook, Linkedin, Link as LinkIcon,
  CheckCircle2, Plus, FileText
} from 'lucide-react';
import { Article, Comment } from '../types';
import FollowSocials from "./FollowSocials";

interface ArticleViewProps {
  article: Article;
  relatedArticles: Article[];
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onToggleLike: () => void;
  onSelectArticle: (article: Article) => void;
}

export default function ArticleView({
  article,
  relatedArticles,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onToggleLike,
  onSelectArticle
}: ArticleViewProps) {
  const navigate = useNavigate();
  // Reader Settings
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  
  // Interaction State
  const [likes, setLikes] = useState<number>(article.likes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>(article.comments);
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentParagraphIdx, setCurrentParagraphIdx] = useState<number | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utterancesQueueRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Initialize Speech Synthesis & Cleanup
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      // Clean up speech on close
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  // Reset likes & comments when article changes
  useEffect(() => {
    setLikes(article.likes);
    setHasLiked(false);
    setComments(article.comments);
    setNewCommentName('');
    setNewCommentText('');
    
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentParagraphIdx(null);
  }, [article.id]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
    onToggleLike();
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: newCommentName.trim(),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?w=100&auto=format&fit=crop&q=80`,
      content: newCommentText.trim(),
      publishedAt: 'Just Now',
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setNewCommentName('');
  };

  // TTS Controls
  const handleStartSpeech = () => {
    const synth = synthRef.current || (typeof window !== 'undefined' ? window.speechSynthesis : null);
    if (!synth) {
      alert("Text-to-speech is not fully supported in this browser.");
      return;
    }

    if (isPaused) {
      synth.resume();
      setIsSpeaking(true);
      setIsPaused(false);
      return;
    }

    synth.cancel(); // cancel current speech
    utterancesQueueRef.current = [];

    // Attempt to set a high-quality English voice if available
    const voices = synth.getVoices();
    const premiumVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      v.name.includes('Natural') || 
      v.lang.startsWith('en-US') ||
      v.lang.startsWith('en')
    );

    // Queue 1: Title, Author & Subtitle
    const introText = `${article.title}. Written by ${article.author.name}. ${article.subtitle}.`;
    const introUtt = new SpeechSynthesisUtterance(introText);
    introUtt.rate = 1.03;
    introUtt.pitch = 1;
    if (premiumVoice) introUtt.voice = premiumVoice;
    introUtt.onstart = () => setCurrentParagraphIdx(-1);
    introUtt.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentParagraphIdx(null);
    };
    utterancesQueueRef.current.push(introUtt);

    // Queue 2: Each Paragraph of the article
    article.content.forEach((para, idx) => {
      const paraUtt = new SpeechSynthesisUtterance(para);
      paraUtt.rate = 1.03;
      paraUtt.pitch = 1;
      if (premiumVoice) paraUtt.voice = premiumVoice;
      paraUtt.onstart = () => setCurrentParagraphIdx(idx);
      
      if (idx === article.content.length - 1) {
        paraUtt.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentParagraphIdx(null);
        };
      }
      paraUtt.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentParagraphIdx(null);
      };
      utterancesQueueRef.current.push(paraUtt);
    });

    utterancesQueueRef.current.forEach(utt => synth.speak(utt));
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePauseSpeech = () => {
    const synth = synthRef.current || (typeof window !== 'undefined' ? window.speechSynthesis : null);
    if (synth && isSpeaking) {
      synth.pause();
      setIsSpeaking(false);
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    const synth = synthRef.current || (typeof window !== 'undefined' ? window.speechSynthesis : null);
    if (synth) {
      synth.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentParagraphIdx(null);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(`Read this article: ${article.title}`);
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
        window.open(shareUrl, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
    }
  };

  // Typography Class helper
  const getFontClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'md': return 'text-base leading-relaxed';
      case 'lg': return 'text-lg leading-relaxed';
      case 'xl': return 'text-xl leading-relaxed';
    }
  };

  // Theme Class helper
  const getThemeClass = () => {
    switch (theme) {
      case 'light': return 'bg-[#F9F9F8] text-[#1A1A1A]';
      case 'sepia': return 'bg-[#f4ebd0] text-[#433422]';
      case 'dark': return 'bg-black text-gray-200';
    }
  };

  return (
    <main className={`flex-1 w-full animate-fade-in ${getThemeClass()}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        
        {/* Navigation & Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#E0E0DE]/50 pb-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-[#c8232c] transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-4">
            {/* Text Size adjusting */}
            <div className="flex items-center gap-1.5 border border-[#E0E0DE] rounded-none px-2.5 py-1">
              <button 
                onClick={() => fontSize !== 'sm' && setFontSize(fontSize === 'xl' ? 'lg' : fontSize === 'lg' ? 'md' : 'sm')}
                className="p-1 text-gray-500 hover:text-black rounded-none cursor-pointer"
                title="Decrease Text Size"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold tracking-tight uppercase">Size</span>
              <button 
                onClick={() => fontSize !== 'xl' && setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'xl')}
                className="p-1 text-gray-500 hover:text-black rounded-none cursor-pointer"
                title="Increase Text Size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reader Background theme */}
            <div className="flex items-center gap-1 border border-[#E0E0DE] rounded-none p-1 bg-black/5">
              <button
                onClick={() => setTheme('light')}
                className={`w-6 h-6 rounded-none text-xs font-serif font-bold cursor-pointer ${theme === 'light' ? 'bg-white text-[#1A1A1A] shadow-sm border border-[#E0E0DE]' : 'text-gray-400'}`}
                title="Paper Layout"
              >
                A
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`w-6 h-6 rounded-none text-xs font-serif font-bold cursor-pointer ${theme === 'sepia' ? 'bg-[#ebdca8] text-[#433422] shadow-sm border border-[#E0E0DE]' : 'text-gray-400'}`}
                title="Sepia Layout"
              >
                S
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`w-6 h-6 rounded-none text-xs font-serif font-bold cursor-pointer ${theme === 'dark' ? 'bg-[#333] text-white shadow-sm border border-gray-600' : 'text-gray-400'}`}
                title="Dark Layout"
              >
                D
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className="flex items-center gap-2 p-1.5 border border-[#E0E0DE] rounded-none hover:bg-black/5 cursor-pointer text-inherit"
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Story"}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#c8232c] text-[#c8232c]' : 'text-gray-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Article Content */}
          <div className="lg:w-2/3">
            <article>
              {/* Category Badge & Tag Badge */}
              <div className="mb-3 flex items-center gap-2">
                <span 
                  onClick={() => {
                    navigate(`/category/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                  }}
                  className="inline-block bg-[#00a859] text-white text-[11px] font-black tracking-widest px-3 py-1 uppercase rounded-none shadow-sm select-none cursor-pointer hover:bg-[#00904f] transition-colors"
                >
                  {article.category}
                </span>
                {article.tag && (
                  <span 
                    onClick={() => {
                      navigate(`/tag/${article.tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                    }}
                    className="inline-block bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 text-[11px] font-bold tracking-wider px-3 py-1 uppercase rounded-none shadow-sm select-none cursor-pointer"
                  >
                    #{article.tag}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-tight mb-4 text-[#111111]">
                {article.title}
              </h1>

              {/* Subtitle / Lead Paragraph */}
              <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed mb-6 font-normal border-l-4 border-gray-300 pl-4 italic">
                {article.subtitle}
              </p>

              {/* Author Row & Actions */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between border-t border-b border-gray-200 py-3 mb-6 gap-4">
                {/* Author Info */}
                <div 
                  onClick={() => {
                    navigate(`/author/${article.author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                  }}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <img 
                    src={article.author.avatar} 
                    alt={article.author.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 group-hover:scale-105 transition-transform" 
                    referrerPolicy="no-referrer" 
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-900 font-sans group-hover:text-[#c8232c] transition-colors">By {article.author.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1DA1F2] fill-[#1DA1F2] text-white" />
                    </div>
                    <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                      Published On {article.publishedAt}
                    </p>
                  </div>
                </div>

                {/* Metadata buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Join Us (WhatsApp-style) */}
                  <a 
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-sm transition-all shadow-sm select-none"
                  >
                    <svg className="w-3.5 h-3.5 mr-1.5 fill-white text-white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                    </svg>
                    <span>Join Us</span>
                  </a>

                  {/* Follow Us button */}
                  <button 
                    onClick={() => alert("Following this publication!")}
                    className="inline-flex items-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-sm transition-all shadow-sm cursor-pointer select-none"
                  >
                    <Plus className="w-3 h-3 mr-1 text-gray-400" />
                    <span>Follow Us</span>
                  </button>

                  {/* Add as a preferred source on Google */}
                  <a 
                    href="https://news.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium px-3 py-1.5 rounded-sm transition-all shadow-sm select-none"
                  >
                    <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Add as preferred source</span>
                  </a>
                </div>
              </div>

              {/* Big Feature Image & Caption */}
              <div className="w-full h-auto rounded overflow-hidden bg-gray-100 mb-2 border border-gray-200">
                <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[500px] object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="text-center text-xs text-gray-500 font-sans italic mb-6">
                {article.author.name} reporting on {article.category}
              </div>

              {/* Advertisement Banner */}
              <div className="w-full border-t border-b border-gray-200 py-2.5 text-center my-6 bg-[#fbfbf9]">
                <span className="text-[10px] text-gray-400 font-sans tracking-[0.2em] uppercase block">— Advertisement —</span>
              </div>

              {/* HIGHLIGHTS Box */}
              <div className="relative border border-gray-400 rounded-sm p-5 pt-8 mt-6 mb-8 bg-[#fdfdfd] shadow-sm">
                <div className="absolute -top-3 left-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-1.5 shadow-sm border border-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                  Highlights
                </div>
                <ul className="list-disc pl-5 space-y-2.5 text-sm text-[#222222] font-sans">
                  {article.aiInsights && article.aiInsights.length > 0 ? (
                    article.aiInsights.map((insight, idx) => (
                      <li key={idx} className="marker:text-red-500 leading-relaxed font-medium">
                        {insight}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="marker:text-red-500 leading-relaxed font-medium">Critical coverage and verified updates.</li>
                      <li className="marker:text-red-500 leading-relaxed font-medium">Live ground reporting from verified correspondents.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Text-to-Speech (Audio player interface) */}
              <div className="mb-8 bg-[#fcfcfb] border border-gray-200 p-4 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                    <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-red-500 animate-pulse' : 'text-[#ef3a3e]'}`} />
                  </div>
                  <div>
                    <span className="text-sm font-bold font-sans text-gray-900 block">Listen to this article</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {isSpeaking 
                        ? (currentParagraphIdx === -1 ? "Reading story introduction..." : currentParagraphIdx !== null ? `Reading paragraph ${currentParagraphIdx + 1} of ${article.content.length}...` : "Reading story aloud...")
                        : isPaused
                        ? "Story audio paused."
                        : "Professional audio rendering"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!isSpeaking ? (
                    <button
                      onClick={handleStartSpeech}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#ef3a3e] hover:bg-[#d12a2e] text-white rounded text-xs font-bold cursor-pointer transition-colors shadow-sm uppercase tracking-wider"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isPaused ? "Resume" : "Listen"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseSpeech}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded text-xs font-bold cursor-pointer transition-colors shadow-sm uppercase tracking-wider"
                    >
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>Pause</span>
                    </button>
                  )}

                  {(isSpeaking || isPaused) && (
                    <button
                      onClick={handleStopSpeech}
                      className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded cursor-pointer transition-colors shadow-sm"
                      title="Stop Story"
                    >
                      <Square className="w-3.5 h-3.5 fill-gray-700" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Text Content with inline "Also Read" boxes */}
              <div className={`space-y-6 font-serif ${getFontClass()}`}>
                {article.content.map((para, idx) => {
                  const items = [];
                  
                  // Main paragraph element
                  items.push(
                    <p 
                      key={`p-${idx}`} 
                      className={`leading-relaxed text-[#222222] transition-all duration-300 text-base md:text-lg ${
                        currentParagraphIdx === idx 
                          ? 'bg-yellow-50 rounded-md p-2 -mx-2' 
                          : 'text-inherit'
                      }`}
                    >
                      {para}
                    </p>
                  );

                  // Interjected "Also Read" boxes
                  if ((idx === 0 || idx === 2) && relatedArticles[idx === 0 ? 0 : 1]) {
                    const related = relatedArticles[idx === 0 ? 0 : 1];
                    items.push(
                      <div 
                        key={`also-read-${idx}`}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          onSelectArticle(related);
                        }}
                        className="border-y-2 sm:border-2 border-dashed border-gray-300 hover:border-black rounded-lg p-4 my-6 flex items-center gap-5 transition-all duration-200 cursor-pointer group bg-[#fafaf9]"
                      >
                        {/* Thumbnail image */}
                        <div className="w-20 h-14 md:w-28 md:h-18 shrink-0 rounded overflow-hidden relative border border-[#e0e0de] bg-gray-100 shadow-sm">
                          <img
                            src={related.imageUrl}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                            Also Read
                          </span>
                          <h4 className="font-sans text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                        </div>
                      </div>
                    );
                  }

                  return items;
                })}
              </div>

              {/* Bottom Share Grid */}
              <div className="border-t border-gray-200 pt-6 mt-10">
                <span className="text-[11px] font-extrabold text-teal-600 uppercase tracking-widest block mb-3 font-sans">
                  Share This Article
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {/* Facebook */}
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1877F2] hover:bg-[#1565C0] text-white text-xs font-bold transition-all shadow-sm cursor-pointer rounded select-none"
                  >
                    <Facebook className="w-3.5 h-3.5 fill-current" />
                    <span>Facebook</span>
                  </button>

                  {/* WhatsApp */}
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm cursor-pointer rounded select-none"
                  >
                    <svg className="w-3.5 h-3.5 fill-white text-white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  {/* X (Twitter) */}
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#000000] hover:bg-gray-900 text-white text-xs font-bold transition-all shadow-sm cursor-pointer rounded select-none"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X (Twitter)</span>
                  </button>

                  {/* Telegram */}
                  <button 
                    onClick={() => handleShare('telegram')}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold transition-all shadow-sm cursor-pointer rounded select-none"
                  >
                    <Send className="w-3.5 h-3.5 fill-current" />
                    <span>Telegram</span>
                  </button>

                  {/* Copy Link */}
                  <button 
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer rounded select-none"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>

                  {/* Share */}
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: article.title,
                          text: article.subtitle,
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        handleShare('copy');
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer rounded select-none"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Like Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-8 pt-8">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-200 cursor-pointer text-sm font-bold ${
                    hasLiked 
                      ? 'bg-red-50 text-[#ef3a3e] border-red-200 scale-105' 
                      : 'border-gray-200 text-gray-600 hover:border-red-500 hover:text-[#ef3a3e] hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasLiked ? 'fill-[#ef3a3e] text-[#ef3a3e]' : ''}`} />
                  <span>{hasLiked ? 'Liked' : 'Like'} ({likes})</span>
                </button>
              </div>

              {/* Conversation/Comments Section */}
              <div className="mt-12 bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="font-serif text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                  <MessageSquare className="w-6 h-6 text-[#ef3a3e]" />
                  Responses ({comments.length})
                </h3>

                {/* Form */}
                <form onSubmit={handlePostComment} className="mb-10 space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-3.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-[#ef3a3e] outline-none transition-all shadow-sm"
                  />
                  <textarea
                    required
                    rows={4}
                    placeholder="What are your thoughts on this story?"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-3.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-[#ef3a3e] outline-none resize-none transition-all shadow-sm"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                      <AlertCircle className="w-3.5 h-3.5 text-[#ef3a3e]" />
                      Keep it respectful and constructive.
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#ef3a3e] hover:bg-[#d12a2e] text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <span>Post Response</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* List */}
                {comments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium">No responses yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map((cmt) => (
                      <div key={cmt.id} className="flex gap-4 bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                          <img src={cmt.avatar} alt={cmt.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">{cmt.authorName}</span>
                            <span className="text-xs text-gray-500">{cmt.publishedAt}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed font-sans">
                            {cmt.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Sticky Container for Sidebar */}
            <div className="sticky top-8 space-y-8">
              
              {/* Author Profile Widget */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-16 bg-gray-100 border-b border-gray-200 flex justify-center pt-8">
                  {/* Half in banner, half out */}
                </div>
                <div className="px-6 pb-6 pt-0 flex flex-col items-center text-center relative -mt-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-white">
                    <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-gray-900">{article.author.name}</h4>
                  <p className="text-xs text-[#ef3a3e] font-bold uppercase tracking-wider mt-1 mb-3">
                    {article.author.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    A distinguished correspondent specializing in deep-dive pieces on {article.category.toLowerCase()}. Awarded multiple accolades for excellence in reporting.
                  </p>
                  
                  <button 
                    onClick={() => {
                      navigate(`/author/${article.author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                    }}
                    className="mt-6 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-bold rounded-lg border border-gray-200 transition-colors cursor-pointer shadow-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* Newsletter Ad */}
              <div className="bg-gradient-to-br from-[#f8f9fb] to-purple-50 p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
                
                <h3 className="font-serif text-xl font-bold mb-2 text-gray-900">The Pulse Newsletter</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed relative z-10">
                  Premium editorial insights delivered straight to your inbox every morning. No noise, just journalism.
                </p>
                <form className="flex flex-col gap-3 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-[#ef3a3e] focus:ring-1 focus:ring-red-100 w-full shadow-sm"
                    required
                  />
                  <button type="submit" className="w-full bg-[#ef3a3e] hover:bg-[#d12a2e] text-white font-bold text-sm rounded-lg p-3 transition-colors cursor-pointer shadow-sm">
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Related News Widget */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                  <h3 className="font-serif text-lg font-bold text-gray-900">More in {article.category}</h3>
                </div>
                
                <div 
                  className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {relatedArticles.length > 0 ? (
                    relatedArticles.map(related => (
                      <div 
                        key={related.id} 
                        className="group cursor-pointer flex flex-col gap-3 min-w-[140px] max-w-[140px] shrink-0 snap-start"
                        onClick={() => {
                          window.scrollTo(0, 0);
                          onSelectArticle(related);
                        }}
                      >
                        <div className="w-full h-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                          <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-bold text-gray-900 group-hover:text-[#ef3a3e] transition-colors leading-snug line-clamp-3 mb-1">
                            {related.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                            {related.publishedAt}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No related articles found.</p>
                  )}
                </div>
              </div>

              <FollowSocials />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

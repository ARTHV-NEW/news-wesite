import React, { useState, useEffect, useRef } from 'react';
import { 
  Bookmark, Heart, Send, Volume2, 
  MessageSquare, User, Clock, Share2, ZoomIn, ZoomOut,
  Play, Pause, Square, AlertCircle, ArrowLeft, Twitter, Facebook, Linkedin, Link as LinkIcon
} from 'lucide-react';
import { Article, Comment } from '../types';

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
              {/* Header category info */}
              <div className="flex items-center gap-3.5 mb-6">
                <span className="font-sans text-xs text-[#ef3a3e] font-bold tracking-widest uppercase">
                  {article.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-sans text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {article.readTime}
                </span>
                {article.tag && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="font-sans text-[10px] bg-red-100 text-[#ef3a3e] font-bold tracking-widest px-2 py-1 rounded-sm uppercase">
                      {article.tag}
                    </span>
                  </>
                )}
              </div>

              {/* Editorial Title */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 text-gray-900">
                {article.title}
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-xl font-sans text-gray-600 leading-relaxed mb-8 font-light">
                {article.subtitle}
              </p>

              {/* Author Metadata block */}
              <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-10">
                <div className="flex items-center gap-4">
                  <img src={article.author.avatar} alt={article.author.name} className="w-14 h-14 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-base font-bold font-sans text-gray-900">By {article.author.name}</h4>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">{article.author.role}</p>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-center">
                  <span className="text-xs text-gray-400 font-sans">Published</span>
                  <p className="text-sm font-medium font-sans text-gray-900 mt-0.5">{article.publishedAt}</p>
                </div>
              </div>

              {/* Big Feature Image */}
              <div className="w-full h-[400px] md:h-[550px] rounded-lg overflow-hidden bg-gray-100 mb-10 shadow-md">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              {/* Text-to-Speech (Audio player interface) */}
              <div className="mb-10 bg-gray-50 border border-gray-200 p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    <Volume2 className="w-6 h-6 text-[#ef3a3e]" />
                  </div>
                  <div>
                    <span className="text-base font-bold font-sans text-gray-900">Listen to this article</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {isSpeaking 
                        ? (currentParagraphIdx === -1 ? "Reading story introduction..." : currentParagraphIdx !== null ? `Reading paragraph ${currentParagraphIdx + 1} of ${article.content.length}...` : "Reading story aloud...")
                        : isPaused
                        ? "Story audio paused."
                        : "Professional audio rendering"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {!isSpeaking ? (
                    <button
                      onClick={handleStartSpeech}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#ef3a3e] hover:bg-[#d12a2e] text-white rounded-full text-sm font-semibold cursor-pointer transition-colors shadow-sm"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isPaused ? "Resume" : "Listen"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseSpeech}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full text-sm font-semibold cursor-pointer transition-colors shadow-sm"
                    >
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause</span>
                    </button>
                  )}

                  {(isSpeaking || isPaused) && (
                    <button
                      onClick={handleStopSpeech}
                      className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-full cursor-pointer transition-colors shadow-sm"
                      title="Stop Story"
                    >
                      <Square className="w-4 h-4 fill-gray-700" />
                      <span className="sr-only">Stop</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Main Text Content */}
              <div className={`space-y-8 font-serif ${getFontClass()}`}>
                {article.content.map((para, idx) => (
                  <p 
                    key={idx} 
                    className={`leading-relaxed text-gray-800 transition-all duration-300 ${
                      currentParagraphIdx === idx 
                        ? 'bg-yellow-50 rounded-md p-2 -mx-2' 
                        : 'text-inherit'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Article Footer Actions (Like, Share) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-200 pt-8 mt-16">
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

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Share:</span>
                  <button onClick={() => handleShare('twitter')} className="p-2.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors cursor-pointer text-gray-600">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleShare('facebook')} className="p-2.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-[#4267B2] hover:text-white hover:border-[#4267B2] transition-colors cursor-pointer text-gray-600">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="p-2.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-colors cursor-pointer text-gray-600">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleShare('copy')} className="p-2.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors cursor-pointer text-gray-600">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conversation/Comments Section */}
              <div className="mt-16 bg-gray-50 p-8 rounded-xl border border-gray-200">
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
                  
                  <button className="mt-6 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-bold rounded-lg border border-gray-200 transition-colors cursor-pointer shadow-sm">
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

            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

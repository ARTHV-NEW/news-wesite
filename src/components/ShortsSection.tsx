import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronRight, Volume2, VolumeX, Maximize, Pause } from 'lucide-react';
import { ShortItem } from '../types';
import { subscribeShorts } from '../services/db';

const FALLBACK_SHORTS: ShortItem[] = [
  {
    id: 'short-1',
    title: 'Netanyahu: Israel Won\'t Leave Lebanon As long As...',
    description: 'Israel PM Netanyahu visits troops stationed in Lebanon.',
    summary: 'Prime Minister Benjamin Netanyahu visited Israeli forces stationed in Lebanon, reaffirming the military presence and commitment to security operations in the region.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&auto=format&fit=crop&q=80',
    duration: '0:55',
    createdAt: new Date().toISOString(),
    views: 1205,
    likes: 45
  },
  {
    id: 'short-2',
    title: 'US Supreme Court Upholds Birthright Citizenship, Big...',
    description: 'Major ruling by US Supreme Court on citizenship.',
    summary: 'The US Supreme Court has upheld birthright citizenship in a landmark ruling, preserving a long-standing constitutional right.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80',
    duration: '1:00',
    createdAt: new Date().toISOString(),
    views: 840,
    likes: 30
  },
  {
    id: 'short-3',
    title: 'PM Modi To Travel To US For G20 Summit, Says...',
    description: 'PM Modi to attend G20 summit 2026 in US: Ambassador Sergio Gor.',
    summary: 'Prime Minister Narendra Modi is scheduled to travel to the United States to attend the G20 Summit in 2026, as confirmed by US Ambassador Sergio Gor.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&auto=format&fit=crop&q=80',
    duration: '0:14',
    createdAt: new Date().toISOString(),
    views: 2400,
    likes: 120
  },
  {
    id: 'short-4',
    title: 'Moment 71-Year-Old Woman Is Pulled From Building In...',
    description: 'Moment 71-year-old woman is pulled from Venezuela quake rubble.',
    summary: 'In a miraculous rescue, a 71-year-old woman was successfully pulled alive from the rubble of a collapsed building following a devastating earthquake in Venezuela.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1498677231914-50deb6ba4217?w=400&auto=format&fit=crop&q=80',
    duration: '0:16',
    createdAt: new Date().toISOString(),
    views: 3100,
    likes: 215
  },
  {
    id: 'short-5',
    title: 'Araghchi Says Iran Alone Will Oversee Reopening Of...',
    description: 'Araghchi: Iran alone will oversee Hormuz reopening, warns against interference.',
    summary: 'Iranian Foreign Minister Abbas Araghchi stated that Iran will independently oversee the reopening of the Strait of Hormuz and warned foreign powers against any interference.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1532384816664-01b8b7238c8d?w=400&auto=format&fit=crop&q=80',
    duration: '0:48',
    createdAt: new Date().toISOString(),
    views: 1560,
    likes: 80
  },
  {
    id: 'short-6',
    title: 'On Camera, Debris Falls Off Beijing\'s Tallest Building Aft...',
    description: 'Video shows debris falling after small plane crashes Beijing\'s tallest building.',
    summary: 'Shocking camera footage captured debris falling from Beijing\'s tallest skyscraper after a small plane crashed into the structure.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=400&auto=format&fit=crop&q=80',
    duration: '1:05',
    createdAt: new Date().toISOString(),
    views: 4500,
    likes: 310
  }
];

export default function ShortsSection() {
  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [selectedShortIndex, setSelectedShortIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsub = subscribeShorts((data) => setShorts(data));
    return () => unsub();
  }, []);

  const displayShorts = shorts.length > 0 ? shorts : FALLBACK_SHORTS;

  const handleNext = () => {
    if (selectedShortIndex !== null && selectedShortIndex < displayShorts.length - 1) {
      setSelectedShortIndex(selectedShortIndex + 1);
    } else {
      setSelectedShortIndex(null); // Close if at end
    }
  };

  const handlePrev = () => {
    if (selectedShortIndex !== null && selectedShortIndex > 0) {
      setSelectedShortIndex(selectedShortIndex - 1);
    }
  };

  return (
    <>
      <section className="bg-[#1A1A1A] py-8 border-b border-[#E0E0DE] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl font-black flex items-center gap-1 text-white tracking-tight">
              Shorts <ChevronRight className="w-6 h-6 text-gray-300 mt-1" />
            </h2>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {displayShorts.map((short, idx) => (
              <div 
                key={short.id}
                onClick={() => setSelectedShortIndex(idx)}
                className="snap-start shrink-0 w-44 sm:w-52 md:w-60 aspect-[4/7] bg-[#000033] rounded-lg overflow-hidden relative cursor-pointer group border border-white/10 hover:border-white/30 transition-colors shadow-xl"
              >
                <img 
                  src={short.imageUrl} 
                  alt={short.title} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  referrerPolicy="no-referrer"
                />
                
                {/* Top dark gradient overlay for logo/brand */}
                <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-[#000088]/90 via-[#000055]/50 to-transparent flex justify-center">
                   <div className="text-white font-black tracking-widest text-[10px] uppercase border-b border-white pb-0.5">Pulse<span className="text-red-500">World</span></div>
                </div>

                {/* Bottom dark gradient overlay for duration and title */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end p-4 pt-12">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="bg-black/80 text-white text-[10px] font-sans font-bold px-1.5 py-1 rounded-sm flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-white" /> {short.duration}
                    </span>
                  </div>
                  <h3 className="text-white font-sans text-[13px] md:text-sm font-bold leading-snug line-clamp-2">
                    {short.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedShortIndex !== null && (
        <ShortPopup 
          shorts={displayShorts}
          currentIndex={selectedShortIndex}
          onClose={() => setSelectedShortIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
}

function ShortPopup({ shorts, currentIndex, onClose, onNext, onPrev }: { shorts: ShortItem[], currentIndex: number, onClose: () => void, onNext: () => void, onPrev: () => void }) {
  const short = shorts[currentIndex];
  const nextShort = currentIndex < shorts.length - 1 ? shorts[currentIndex + 1] : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset state on index change
    setIsPlaying(true);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    onNext();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in text-white">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="w-full max-w-[1400px] h-full max-h-[85vh] bg-black rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-2xl relative">
        {/* Left: Details */}
        <div className="w-full md:w-[30%] lg:w-[25%] p-8 bg-[#111] border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-4">{short.title}</h2>
            <p className="font-sans text-gray-300 text-sm leading-relaxed mb-6 border-l-2 border-red-500 pl-4">
              {short.description}
            </p>
            <div className="text-gray-400 text-xs font-sans leading-relaxed space-y-4">
              <p>{short.summary}</p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-wider">
              <span>{short.views?.toLocaleString()} Views</span>
              <span>•</span>
              <span>{short.likes?.toLocaleString()} Likes</span>
            </div>
          </div>
        </div>

        {/* Center: Video Player */}
        <div className="flex-1 relative bg-black flex items-center justify-center p-4">
          <div className="relative h-full w-full max-w-[450px] aspect-[9/16] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl bg-gray-900 border border-white/5">
            <video
              ref={videoRef}
              src={short.videoUrl}
              className="w-full h-full object-cover cursor-pointer"
              autoPlay
              playsInline
              muted={isMuted}
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              poster={short.imageUrl}
            />
            
            {/* Controls overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4 pointer-events-auto w-full mb-2">
                <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-full transition">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>
                
                {/* Progress bar */}
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-red-600 transition-all duration-100 relative" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow" />
                  </div>
                </div>
                
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-white/20 rounded-full transition">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Next Short (Autoplay Waiting) */}
        <div className="hidden md:flex w-[20%] lg:w-[25%] p-8 bg-[#111] border-l border-white/10 flex-col justify-center items-center">
          {nextShort ? (
            <div className="w-full max-w-[240px]">
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Up Next
              </p>
              <div 
                onClick={onNext}
                className="w-full aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden relative cursor-pointer group shadow-2xl border border-white/10 hover:border-white/30 transition-colors"
              >
                <img 
                  src={nextShort.imageUrl} 
                  alt={nextShort.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-center items-center p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/20 shadow-xl">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                  <h4 className="text-white font-sans text-sm font-bold leading-snug line-clamp-3 mb-2">
                    {nextShort.title}
                  </h4>
                  <p className="text-gray-400 text-[10px] font-mono mt-2 bg-black/50 px-2 py-1 rounded">Autoplaying next...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 font-mono text-sm bg-white/5 p-6 rounded-xl border border-white/10">
              End of Shorts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

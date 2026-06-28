import React from 'react';

export default function TrendingTicker() {
  const trends = [
    "Global leaders convene for emergency climate summit in Geneva",
    "Tech giant unveils revolutionary AI chip with 10× performance gains",
    "Central bank signals rate cut amid cooling inflation figures",
    "Scientists confirm first successful lab-grown human organ transplant",
    "Olympic committee announces record-breaking viewership for opening ceremony",
    "Major trade agreement signed between 12 Pacific nations"
  ];

  // Double list for smooth infinite scrolling
  const scrollItems = [...trends, ...trends];

  return (
    <div className="w-full bg-black text-white flex items-center overflow-hidden h-7 select-none border-b border-[#E0E0DE]">
      {/* Breaking Tag Label */}
      <div className="bg-red-600 text-white px-4 h-full flex items-center font-sans text-[10px] font-black tracking-[0.15em] uppercase shrink-0">
        BREAKING
      </div>
      
      {/* Moving Track */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div className="flex gap-16 animate-[ticker_35s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
          {scrollItems.map((item, index) => (
            <span 
              key={index} 
              className="text-[10px] font-semibold font-sans flex items-center gap-2 tracking-[0.15em] uppercase"
            >
              <span className="text-red-500 text-[9px] font-mono">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Styled inline animation to guarantee infinite loop on all setups */}
      <style>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

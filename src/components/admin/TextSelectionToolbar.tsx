import React, { useState } from 'react';
import { Sparkles, Wand2, Type, Shrink, Expand, CheckCheck, Languages, ArrowRightCircle, HelpCircle, FileText, Loader2, X } from 'lucide-react';

interface TextSelectionToolbarProps {
  position: { top: number; left: number } | null;
  selectedText: string;
  onTransform: (action: string, options?: { language?: string }) => void;
  onClose: () => void;
  isGenerating: boolean;
}

export default function TextSelectionToolbar({
  position,
  selectedText,
  onTransform,
  onClose,
  isGenerating,
}: TextSelectionToolbarProps) {
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [targetLang, setTargetLang] = useState('Spanish');

  if (!position || !selectedText.trim()) return null;

  const actions = [
    { id: 'improve', label: 'Improve Writing', icon: Sparkles, color: 'text-amber-500' },
    { id: 'rewrite', label: 'Rewrite', icon: Wand2, color: 'text-blue-500' },
    { id: 'make-professional', label: 'Make Professional', icon: Type, color: 'text-indigo-500' },
    { id: 'make-simpler', label: 'Make Simpler', icon: CheckCheck, color: 'text-emerald-500' },
    { id: 'expand', label: 'Expand', icon: Expand, color: 'text-purple-500' },
    { id: 'shorten', label: 'Shorten', icon: Shrink, color: 'text-rose-500' },
    { id: 'fix-grammar', label: 'Fix Grammar', icon: CheckCheck, color: 'text-green-600' },
    { id: 'continue', label: 'Generate Continuation', icon: ArrowRightCircle, color: 'text-cyan-500' },
    { id: 'explain', label: 'Explain', icon: HelpCircle, color: 'text-yellow-600' },
    { id: 'summarize', label: 'Summarize', icon: FileText, color: 'text-violet-500' },
  ];

  const languages = ['Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic', 'Portuguese', 'Hindi', 'Italian'];

  return (
    <div
      style={{
        top: `${Math.max(10, position.top - 60)}px`,
        left: `${Math.min(window.innerWidth - 340, Math.max(10, position.left))}px`,
      }}
      className="fixed z-50 bg-gray-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-gray-700/80 p-2 flex flex-col gap-2 max-w-md animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5 text-red-400">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI Text Selection Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-mono text-[10px]">{selectedText.length} chars selected</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-red-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating AI transform live...</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-48 overflow-y-auto p-1">
            {actions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => onTransform(act.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${act.color}`} />
                  <span className="truncate">{act.label}</span>
                </button>
              );
            })}

            {/* Translate dropdown button */}
            <button
              onClick={() => setShowTranslateMenu(!showTranslateMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-left col-span-1"
            >
              <Languages className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate">Translate</span>
            </button>
          </div>

          {showTranslateMenu && (
            <div className="p-2 bg-gray-800/90 rounded-lg border border-gray-700 space-y-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Language</div>
              <div className="flex gap-2">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-gray-900 border border-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500 flex-1"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setShowTranslateMenu(false);
                    onTransform('translate', { language: targetLang });
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

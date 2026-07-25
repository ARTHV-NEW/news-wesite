import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  FileText,
  HelpCircle,
  Search,
  ListPlus,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Globe,
  Settings2,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

export interface AiFormSettings {
  topic: string;
  keywords: string;
  category: string;
  country: string;
  language: string;
  tone: string;
  length: string;
  seo: boolean;
  faqs: boolean;
  generateThumbnailToggle: boolean;
  bulletInsights: boolean;
}

interface AiAssistantPanelProps {
  settings: AiFormSettings;
  onSettingsChange: (newSettings: AiFormSettings) => void;
  onGenerateArticle: () => void;
  onImproveArticle: () => void;
  onRewriteArticle: () => void;
  onExpandArticle: () => void;
  onShortenArticle: () => void;
  onSummarizeArticle: () => void;
  onFactCheck: () => void;
  onGenerateField: (field: string) => void;
  onGenerateThumbnail: () => void;
  aiStatus: string;
  isGenerating: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AiAssistantPanel({
  settings,
  onSettingsChange,
  onGenerateArticle,
  onImproveArticle,
  onRewriteArticle,
  onExpandArticle,
  onShortenArticle,
  onSummarizeArticle,
  onFactCheck,
  onGenerateField,
  onGenerateThumbnail,
  aiStatus,
  isGenerating,
  isCollapsed,
  onToggleCollapse,
}: AiAssistantPanelProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const categories = ['World', 'Politics', 'Business', 'Technology', 'Health', 'Science', 'Sports', 'Culture', 'Opinion'];
  const countries = ['Global', 'USA', 'UK', 'Europe', 'Middle East', 'Asia', 'India', 'Germany', 'France', 'Japan', 'Latin America'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic', 'Portuguese', 'Hindi'];
  const tones = ['Professional', 'Neutral', 'Investigative', 'Editorial', 'Breaking News'];
  const lengths = ['Short (~300w)', 'Medium (~600w)', 'Long (~1000w)', 'In-Depth (~1500w)'];

  const handleChange = (field: keyof AiFormSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  if (isCollapsed) {
    return (
      <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white rounded-xl border border-gray-800 p-3 flex flex-col items-center gap-4 shrink-0 transition-all duration-200 shadow-lg">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors"
          title="Expand AI Assistant Panel"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="writing-mode-vertical text-xs font-bold uppercase tracking-widest text-gray-400 py-4 font-serif">
          AI Newsroom Assistant
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden flex flex-col shrink-0 font-sans transition-all duration-200">
      {/* AI Panel Header */}
      <div className="p-4 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-600/30 text-red-400 rounded-xl border border-red-500/30 shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight font-serif text-white">AI Writing Assistant</h3>
            <p className="text-[10px] text-gray-400">Gemini 3.6 Flash & Image Studio</p>
          </div>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          title="Collapse Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Status Banner */}
      {aiStatus && (
        <div className="bg-red-50/80 border-b border-red-100 p-2.5 px-4 flex items-center justify-between gap-2 text-xs text-red-900 font-semibold">
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 text-red-600 animate-spin shrink-0" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
            <span className="truncate">{aiStatus}</span>
          </div>
        </div>
      )}

      {/* Control Body */}
      <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] text-xs">
        {/* Main Topic Input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">News Topic / Angle</label>
          <textarea
            value={settings.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-600 font-sans"
            placeholder="E.g., Federal Reserve cuts interest rates by 25 basis points amid cooling inflation..."
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Keywords</label>
          <input
            type="text"
            value={settings.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="E.g., inflation, economy, rate cut, Jerome Powell"
          />
        </div>

        {/* Category & Country */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
            <select
              value={settings.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Country / Region</label>
            <select
              value={settings.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language & Tone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Tone</label>
            <select
              value={settings.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Length */}
        <div>
          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Article Length</label>
          <select
            value={settings.length}
            onChange={(e) => handleChange('length', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {lengths.map((len) => (
              <option key={len} value={len}>
                {len}
              </option>
            ))}
          </select>
        </div>

        {/* AI Toggles */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">
            Generation Toggles
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.seo}
                onChange={(e) => handleChange('seo', e.target.checked)}
                className="w-3.5 h-3.5 accent-red-600"
              />
              <span className="font-semibold text-gray-700">SEO Optimize</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.faqs}
                onChange={(e) => handleChange('faqs', e.target.checked)}
                className="w-3.5 h-3.5 accent-red-600"
              />
              <span className="font-semibold text-gray-700">Include FAQs</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.generateThumbnailToggle}
                onChange={(e) => handleChange('generateThumbnailToggle', e.target.checked)}
                className="w-3.5 h-3.5 accent-red-600"
              />
              <span className="font-semibold text-gray-700">Auto Thumbnail</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.bulletInsights}
                onChange={(e) => handleChange('bulletInsights', e.target.checked)}
                className="w-3.5 h-3.5 accent-red-600"
              />
              <span className="font-semibold text-gray-700">Bullet Insights</span>
            </label>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-2 pt-1 border-t border-gray-100">
          <button
            onClick={onGenerateArticle}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-yellow-300" />
            )}
            <span>Generate Article / Fill All Fields</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onGenerateThumbnail}
              disabled={isGenerating}
              className="py-2 px-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <ImageIcon className="w-3.5 h-3.5 text-red-400" />
              <span>Gen Thumbnail</span>
            </button>

            <button
              onClick={onFactCheck}
              disabled={isGenerating}
              className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>Fact Check</span>
            </button>
          </div>
        </div>

        {/* Transformations Section */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Article AI Actions</div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onImproveArticle}
              disabled={isGenerating}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500 shrink-0" /> Improve Article
            </button>

            <button
              onClick={onRewriteArticle}
              disabled={isGenerating}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <Wand2 className="w-3 h-3 text-blue-500 shrink-0" /> Rewrite
            </button>

            <button
              onClick={onExpandArticle}
              disabled={isGenerating}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <ChevronRight className="w-3 h-3 text-purple-500 shrink-0" /> Expand
            </button>

            <button
              onClick={onShortenArticle}
              disabled={isGenerating}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3 text-rose-500 shrink-0" /> Shorten
            </button>

            <button
              onClick={onSummarizeArticle}
              disabled={isGenerating}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 col-span-2 justify-center"
            >
              <FileText className="w-3 h-3 text-cyan-500 shrink-0" /> Summarize Key Takeaways
            </button>
          </div>
        </div>

        {/* Granular Field Generators */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Granular Field Generators</div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onGenerateField('headline')}
              disabled={isGenerating}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-700 text-left transition-colors"
            >
              + Headline
            </button>

            <button
              onClick={() => onGenerateField('subtitle')}
              disabled={isGenerating}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-700 text-left transition-colors"
            >
              + Subtitle
            </button>

            <button
              onClick={() => onGenerateField('slug')}
              disabled={isGenerating}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-700 text-left transition-colors"
            >
              + Slug
            </button>

            <button
              onClick={() => onGenerateField('tags')}
              disabled={isGenerating}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-700 text-left transition-colors"
            >
              + Tags
            </button>

            <button
              onClick={() => onGenerateField('meta_description')}
              disabled={isGenerating}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-700 text-left transition-colors"
            >
              + Meta Description
            </button>

            <button
              onClick={() => onGenerateField('excerpt')}
              disabled={isGenerating}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-700 text-left transition-colors"
            >
              + Excerpt
            </button>

            <button
              onClick={() => onGenerateField('bullet_insights')}
              disabled={isGenerating}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-700 text-left transition-colors col-span-2"
            >
              + Bullet Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

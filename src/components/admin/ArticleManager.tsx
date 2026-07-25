import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Award,
  Link2,
  Image as ImageIcon,
  Download,
  RefreshCw,
  X,
  Upload,
  Copy,
  Check,
  Zap,
  Save,
  Loader2,
  ShieldCheck,
  Wand2,
} from 'lucide-react';
import {
  subscribeArticles,
  saveArticle,
  deleteArticle,
  getUniqueSlug,
  handleSlugChange,
  generateSlug,
} from '../../services/db';
import { Article } from '../../types';
import AiAssistantPanel, { AiFormSettings } from './AiAssistantPanel';
import TextSelectionToolbar from './TextSelectionToolbar';
import FactCheckModal from './FactCheckModal';
import {
  apiGenerateArticle,
  apiGenerateThumbnail,
  apiStreamRewrite,
  apiImproveField,
  apiFactCheck,
  FactCheckReport,
} from '../../services/aiService';

export default function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Form values
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('World');
  const [tag, setTag] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [rawInsights, setRawInsights] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditorsChoice, setIsEditorsChoice] = useState(false);
  const [isOpinion, setIsOpinion] = useState(false);

  // AI Assistant States
  const [aiSettings, setAiSettings] = useState<AiFormSettings>({
    topic: '',
    keywords: '',
    category: 'World',
    country: 'Global',
    language: 'English',
    tone: 'Professional',
    length: 'Medium (~600w)',
    seo: true,
    faqs: false,
    generateThumbnailToggle: true,
    bulletInsights: true,
  });

  const [aiStatus, setAiStatus] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAiCollapsed, setIsAiCollapsed] = useState<boolean>(false);
  const [autoSaveToast, setAutoSaveToast] = useState<string>('');

  // Fact Check Modal State
  const [isFactCheckOpen, setIsFactCheckOpen] = useState(false);
  const [factCheckReport, setFactCheckReport] = useState<FactCheckReport | null>(null);

  // Floating Selection Menu State
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

  // Automatic Slug generation from title on create
  useEffect(() => {
    if (!editingArticle) {
      setSlug(generateSlug(title));
    }
  }, [title, editingArticle]);

  // Subscribe to Articles Firestore
  useEffect(() => {
    const unsubscribe = subscribeArticles((liveArticles) => {
      setArticles(liveArticles);
    });
    return () => unsubscribe();
  }, []);

  // Auto-Save Draft to LocalStorage every 8 seconds when editing
  useEffect(() => {
    if (!isEditing) return;

    const interval = setInterval(() => {
      if (title.trim() || rawContent.trim()) {
        const draft = {
          title,
          slug,
          subtitle,
          category,
          tag,
          imageUrl,
          authorName,
          authorRole,
          rawContent,
          rawInsights,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        localStorage.setItem('cms_article_draft', JSON.stringify(draft));
        setAutoSaveToast(`Draft Auto-Saved at ${draft.savedAt}`);
        setTimeout(() => setAutoSaveToast(''), 3000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isEditing, title, slug, subtitle, category, tag, imageUrl, authorName, authorRole, rawContent, rawInsights]);

  // Handle Text Selection inside the Article Body Textarea
  const handleTextareaSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    if (start !== end && end - start > 3) {
      const selected = textareaRef.current.value.substring(start, end);
      setSelectedText(selected);
      setSelectionRange({ start, end });

      // Get bounding box of textarea for floating position
      const rect = textareaRef.current.getBoundingClientRect();
      setSelectionPosition({
        top: rect.top + window.scrollY + 10,
        left: rect.left + window.scrollX + 20,
      });
    } else {
      setSelectedText('');
      setSelectionPosition(null);
      setSelectionRange(null);
    }
  };

  const handleCreateNew = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setCategory('World');
    setTag('Breaking');
    setImageUrl('');
    setAuthorName('Staff Reporter');
    setAuthorRole('Political Editor');
    setAuthorAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60');
    setRawContent('');
    setRawInsights('');
    setIsBreaking(false);
    setIsFeatured(false);
    setIsEditorsChoice(false);
    setIsOpinion(false);
    setAiSettings((prev) => ({ ...prev, topic: '' }));
    setAiStatus('');
    setIsEditing(true);
  };

  const handleEdit = (art: Article) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSlug(art.slug || '');
    setSubtitle(art.subtitle || '');
    setCategory(art.category);
    setTag(art.tag || '');
    setImageUrl(art.imageUrl || '');
    setAuthorName(art.author?.name || '');
    setAuthorRole(art.author?.role || '');
    setAuthorAvatar(art.author?.avatar || '');
    setRawContent(art.content ? art.content.join('\n\n') : '');
    setRawInsights(art.aiInsights ? art.aiInsights.join('\n') : '');
    setIsBreaking(!!art.isBreaking);
    setIsFeatured(!!art.isFeatured);
    setIsEditorsChoice(!!art.isEditorsChoice);
    setIsOpinion(!!art.isOpinion);
    setAiSettings((prev) => ({
      ...prev,
      topic: art.title,
      category: art.category || 'World',
    }));
    setAiStatus('');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const id = editingArticle?.id || 'art-' + Date.now();
    const contentArr = rawContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const insightsArr = rawInsights
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    // Ensure unique slug
    const resolvedBaseSlug = generateSlug(slug || title);
    const resolvedSlug = await getUniqueSlug('articles', resolvedBaseSlug, id);

    // Handle 301 Redirect if slug changed
    if (editingArticle && editingArticle.slug && editingArticle.slug !== resolvedSlug) {
      console.log(`Setting up 301 Redirect for article: ${editingArticle.slug} -> ${resolvedSlug}`);
      await handleSlugChange('articles', editingArticle.slug, resolvedSlug);
    }

    const articleToSave: Article = {
      id,
      title,
      slug: resolvedSlug,
      subtitle,
      content: contentArr,
      author: {
        name: authorName || 'Staff Writer',
        role: authorRole || 'Journalist',
        avatar: authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
      },
      publishedAt:
        editingArticle?.publishedAt ||
        new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
          ' • ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      readTime: editingArticle?.readTime || `${Math.max(1, Math.round(contentArr.join(' ').split(' ').length / 200))} min read`,
      category,
      tag: tag || 'Breaking',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80',
      isBreaking,
      isFeatured,
      isEditorsChoice,
      isOpinion,
      likes: editingArticle?.likes || 0,
      aiInsights: insightsArr,
      comments: editingArticle?.comments || [],
    };

    try {
      await saveArticle(articleToSave);
      setIsEditing(false);
      localStorage.removeItem('cms_article_draft');
    } catch (err) {
      console.error('Error saving article: ', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article? This cannot be undone.')) {
      try {
        await deleteArticle(id);
      } catch (err) {
        console.error('Error deleting article: ', err);
      }
    }
  };

  // AI ACTIONS IMPLEMENTATION

  // 1. Full Article & Auto-Fill All Fields
  const handleAiGenerateFullArticle = async () => {
    if (!aiSettings.topic && !title) {
      alert('Please enter a News Topic or Title in the AI Assistant panel.');
      return;
    }

    setIsGenerating(true);
    setAiStatus('Generating structured article data from Gemini 3.6 Flash...');

    try {
      const generated = await apiGenerateArticle({
        topic: aiSettings.topic || title,
        keywords: aiSettings.keywords,
        category: aiSettings.category,
        country: aiSettings.country,
        language: aiSettings.language,
        tone: aiSettings.tone,
        length: aiSettings.length,
        seo: aiSettings.seo,
        faqs: aiSettings.faqs,
        bulletInsights: aiSettings.bulletInsights,
        currentTitle: title,
        currentContent: rawContent,
      });

      // Populate form fields
      if (generated.title) setTitle(generated.title);
      if (generated.subtitle) setSubtitle(generated.subtitle);
      if (generated.slug) setSlug(generated.slug);
      if (generated.category) setCategory(generated.category);
      if (generated.tags && generated.tags.length > 0) setTag(generated.tags[0]);
      if (generated.content) setRawContent(generated.content.join('\n\n'));
      if (generated.bullet_insights) setRawInsights(generated.bullet_insights.join('\n'));
      if (generated.authorName) setAuthorName(generated.authorName);
      if (generated.authorRole) setAuthorRole(generated.authorRole);
      if (typeof generated.breaking === 'boolean') setIsBreaking(generated.breaking);
      if (typeof generated.featured === 'boolean') setIsFeatured(generated.featured);

      // Auto Generate Thumbnail if toggle enabled
      if (aiSettings.generateThumbnailToggle) {
        setAiStatus('Generating realistic editorial thumbnail image...');
        try {
          const imgUrl = await apiGenerateThumbnail({
            topic: aiSettings.topic || generated.title,
            title: generated.title,
            keywords: aiSettings.keywords,
            category: generated.category || aiSettings.category,
            country: aiSettings.country,
            tone: aiSettings.tone,
          });
          setImageUrl(imgUrl);
        } catch (imgErr) {
          console.warn('Failed to auto-generate thumbnail:', imgErr);
        }
      }

      setAiStatus('Article generation complete!');
    } catch (err: any) {
      console.error('Error generating article:', err);
      setAiStatus(`Error: ${err.message || 'Generation failed'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Generate Thumbnail Image
  const handleAiGenerateThumbnail = async () => {
    setIsGenerating(true);
    setAiStatus('Generating 16:9 editorial thumbnail with Gemini Image Studio...');

    try {
      const imgUrl = await apiGenerateThumbnail({
        topic: aiSettings.topic || title || 'Breaking News',
        title: title || aiSettings.topic,
        keywords: aiSettings.keywords,
        category: category || aiSettings.category,
        country: aiSettings.country,
        tone: aiSettings.tone,
      });

      setImageUrl(imgUrl);
      setAiStatus('Thumbnail generated successfully!');
    } catch (err: any) {
      console.error('Error generating thumbnail:', err);
      setAiStatus(`Thumbnail error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Full Article Transformations (Improve, Rewrite, Expand, Shorten, Summarize)
  const handleAiTransformArticle = async (action: string) => {
    if (!rawContent.trim()) {
      alert('Please enter or generate article body content first.');
      return;
    }

    setIsGenerating(true);
    setAiStatus(`Applying AI action: ${action.toUpperCase()}...`);

    try {
      let accumulatedText = '';
      setRawContent(''); // Clear for typing effect

      await apiStreamRewrite(
        {
          text: rawContent,
          action,
          language: aiSettings.language,
          tone: aiSettings.tone,
          articleTitle: title,
          category,
        },
        (chunk) => {
          accumulatedText += chunk;
          setRawContent(accumulatedText);
        }
      );

      setAiStatus(`Article successfully transformed (${action})!`);
    } catch (err: any) {
      console.error(`Transform error (${action}):`, err);
      setAiStatus(`Transform error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 4. Floating Text Selection Transform
  const handleSelectionTransform = async (action: string, options?: { language?: string }) => {
    if (!selectedText || !selectionRange || !textareaRef.current) return;

    setIsGenerating(true);
    setAiStatus(`Transforming selected text (${action})...`);

    try {
      let replacement = '';
      await apiStreamRewrite(
        {
          text: selectedText,
          action,
          language: options?.language || aiSettings.language,
          tone: aiSettings.tone,
          articleTitle: title,
          category,
        },
        (chunk) => {
          replacement += chunk;
        }
      );

      // Replace selected range in rawContent
      const before = rawContent.substring(0, selectionRange.start);
      const after = rawContent.substring(selectionRange.end);
      setRawContent(before + replacement + after);

      setSelectedText('');
      setSelectionPosition(null);
      setSelectionRange(null);
      setAiStatus('Text selection transformation complete!');
    } catch (err: any) {
      console.error('Selection transform error:', err);
      setAiStatus(`Selection transform error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. Granular Field Generators
  const handleAiGenerateField = async (field: string) => {
    setIsGenerating(true);
    setAiStatus(`Generating field: ${field}...`);

    try {
      const data = await apiImproveField({
        field,
        topic: aiSettings.topic || title,
        title: title || aiSettings.topic,
        content: rawContent,
        keywords: aiSettings.keywords,
        category: category || aiSettings.category,
        language: aiSettings.language,
        tone: aiSettings.tone,
      });

      if (field === 'headline' && data.headlines?.[0]) setTitle(data.headlines[0]);
      if (field === 'subtitle' && data.subtitles?.[0]) setSubtitle(data.subtitles[0]);
      if (field === 'slug' && data.slug) setSlug(data.slug);
      if (field === 'tags' && data.tags) setTag(data.tags.join(', '));
      if (field === 'excerpt' && data.excerpt) setSubtitle(data.excerpt);
      if (field === 'bullet_insights' && data.bullet_insights) setRawInsights(data.bullet_insights.join('\n'));

      setAiStatus(`Field ${field} updated successfully!`);
    } catch (err: any) {
      console.error(`Field generation error (${field}):`, err);
      setAiStatus(`Field generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 6. Fact Checking Action
  const handleFactCheck = async () => {
    if (!title || !rawContent) {
      alert('Please enter a title and article body content before fact checking.');
      return;
    }

    setIsGenerating(true);
    setAiStatus('Running AI Fact Check with real-time web search grounding...');

    try {
      const report = await apiFactCheck({
        title,
        content: rawContent,
        country: aiSettings.country,
      });

      setFactCheckReport(report);
      setIsFactCheckOpen(true);
      setAiStatus('Fact check complete!');
    } catch (err: any) {
      console.error('Fact check error:', err);
      setAiStatus(`Fact check error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredArticles = articles.filter(
    (art) =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {autoSaveToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-gray-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Save className="w-4 h-4 text-emerald-400" />
          <span>{autoSaveToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif flex items-center gap-2">
            <span>Articles Control & AI Newsroom</span>
            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wider font-sans">
              AI Powered
            </span>
          </h2>
          <p className="text-sm text-gray-500">Full-stack newsroom article editor with Gemini AI integration.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Article
        </button>
      </div>

      {isEditing ? (
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Main Article Editor Form */}
          <form
            onSubmit={handleSave}
            className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm w-full"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900 tracking-tight font-serif">
                {editingArticle ? `Edit Article: ${title}` : 'Write New Article'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiGenerateFullArticle}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                  <span>AI Auto-Fill</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Title / Headline</label>
                    <button
                      type="button"
                      onClick={() => handleAiGenerateField('headline')}
                      disabled={isGenerating}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Gen Headline
                    </button>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    placeholder="E.g. Federal Reserve Cuts Interest Rates by 25 Basis Points"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">URL Slug</label>
                    <button
                      type="button"
                      onClick={() => handleAiGenerateField('slug')}
                      disabled={isGenerating}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Gen Slug
                    </button>
                  </div>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-mono"
                    placeholder="e.g. federal-reserve-cuts-interest-rates"
                  />
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <Link2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="font-semibold text-gray-600">Permalink Preview:</span>
                    <span className="font-mono text-gray-500 select-all truncate">
                      https://pulsenews.com/articles/{slug || 'untitled'}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Subtitle / Sub-headline</label>
                    <button
                      type="button"
                      onClick={() => handleAiGenerateField('subtitle')}
                      disabled={isGenerating}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Gen Subtitle
                    </button>
                  </div>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="E.g. A major monetary policy decision amid cooling inflation"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                    >
                      {['World', 'Politics', 'Business', 'Technology', 'Health', 'Science', 'Sports', 'Culture', 'Opinion'].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tag</label>
                      <button
                        type="button"
                        onClick={() => handleAiGenerateField('tags')}
                        disabled={isGenerating}
                        className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Gen Tag
                      </button>
                    </div>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="E.g. Breaking, Markets, Analysis"
                    />
                  </div>
                </div>

                {/* AI Featured Image / Thumbnail Section */}
                <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Featured Thumbnail Image
                    </label>
                    <button
                      type="button"
                      onClick={handleAiGenerateThumbnail}
                      disabled={isGenerating}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>AI Gen Image</span>
                    </button>
                  </div>

                  {imageUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-gray-300 aspect-video bg-gray-900">
                      <img src={imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                        <button
                          type="button"
                          onClick={handleAiGenerateThumbnail}
                          className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-1"
                          title="Regenerate Image"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                        </button>
                        <a
                          href={imageUrl}
                          download="article-thumbnail.png"
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-1"
                          title="Download Image"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="p-2 bg-rose-600/80 hover:bg-rose-700 text-white rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-1"
                          title="Remove Image"
                        >
                          <X className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-white space-y-2">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                      <div className="text-xs font-bold text-gray-600">No thumbnail image selected</div>
                      <p className="text-[11px] text-gray-400">
                        Click "AI Gen Image" to generate an editorial 16:9 thumbnail photograph using Gemini Image Studio, or paste a URL below.
                      </p>
                    </div>
                  )}

                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 font-mono"
                    placeholder="Or manually paste custom Image URL / Data URL"
                  />
                </div>

                {/* Author Details */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-200 pb-2">
                    Author details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Author Role
                      </label>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Controls (Content & AI Insights) */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Article Body Content (Highlight text for AI Context Menu)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAiTransformArticle('improve')}
                        disabled={isGenerating}
                        className="text-[10px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" /> Improve Content
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    onSelect={handleTextareaSelect}
                    required
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-sans leading-relaxed"
                    placeholder="Paste or generate full article text. Paragraphs separated by blank lines will render beautifully on reader view."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      AI Bullet Insights (One per line)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAiGenerateField('bullet_insights')}
                      disabled={isGenerating}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Gen Insights
                    </button>
                  </div>
                  <textarea
                    value={rawInsights}
                    onChange={(e) => setRawInsights(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-sans"
                    placeholder="Key takeaway bullet 1...&#10;Key takeaway bullet 2..."
                  />
                </div>

                {/* Editorial Flags */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-200 pb-2">
                    Editorial Flags
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="w-4 h-4 accent-red-600"
                      />
                      <span className="text-xs font-bold text-gray-700">BREAKING NEWS</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-red-600"
                      />
                      <span className="text-xs font-bold text-gray-700">FEATURED HERO</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isEditorsChoice}
                        onChange={(e) => setIsEditorsChoice(e.target.checked)}
                        className="w-4 h-4 accent-red-600"
                      />
                      <span className="text-xs font-bold text-gray-700">EDITORS' CHOICE</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isOpinion}
                        onChange={(e) => setIsOpinion(e.target.checked)}
                        className="w-4 h-4 accent-red-600"
                      />
                      <span className="text-xs font-bold text-gray-700">OP-ED COLUMNS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleFactCheck}
                disabled={isGenerating}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Fact Check Article</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition-colors uppercase tracking-wider shadow-md"
                >
                  Publish Article
                </button>
              </div>
            </div>
          </form>

          {/* AI Assistant Sidebar Panel */}
          <AiAssistantPanel
            settings={aiSettings}
            onSettingsChange={setAiSettings}
            onGenerateArticle={handleAiGenerateFullArticle}
            onImproveArticle={() => handleAiTransformArticle('improve')}
            onRewriteArticle={() => handleAiTransformArticle('rewrite')}
            onExpandArticle={() => handleAiTransformArticle('expand')}
            onShortenArticle={() => handleAiTransformArticle('shorten')}
            onSummarizeArticle={() => handleAiTransformArticle('summarize')}
            onFactCheck={handleFactCheck}
            onGenerateField={handleAiGenerateField}
            onGenerateThumbnail={handleAiGenerateThumbnail}
            aiStatus={aiStatus}
            isGenerating={isGenerating}
            isCollapsed={isAiCollapsed}
            onToggleCollapse={() => setIsAiCollapsed(!isAiCollapsed)}
          />

          {/* Text Selection Floating Context Menu */}
          <TextSelectionToolbar
            position={selectionPosition}
            selectedText={selectedText}
            onTransform={handleSelectionTransform}
            onClose={() => {
              setSelectedText('');
              setSelectionPosition(null);
            }}
            isGenerating={isGenerating}
          />

          {/* Fact Check Modal */}
          <FactCheckModal
            isOpen={isFactCheckOpen}
            onClose={() => setIsFactCheckOpen(false)}
            report={factCheckReport}
          />
        </div>
      ) : (
        /* Articles List Table */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles by title, category, author..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Total Articles: {filteredArticles.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/20 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Image</th>
                  <th className="py-3.5 px-4">Headline</th>
                  <th className="py-3.5 px-4">Author / Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Promotions</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 font-medium font-sans">
                      No articles match your search parameters.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 shrink-0">
                        <img src={art.imageUrl} alt="" className="w-16 h-10 object-cover rounded-lg border border-gray-200" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900 leading-tight font-serif mb-1 line-clamp-2">
                          {art.title}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1">{art.subtitle}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={art.author?.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover border border-gray-200"
                          />
                          <span className="text-sm text-gray-700 font-medium">{art.author?.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">{art.publishedAt}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {art.isBreaking && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 text-red-800 text-[9px] font-bold rounded">
                              <AlertOctagon className="w-2.5 h-2.5" /> BREAKING
                            </span>
                          )}
                          {art.isFeatured && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[9px] font-bold rounded">
                              <Award className="w-2.5 h-2.5" /> HERO
                            </span>
                          )}
                          {art.isEditorsChoice && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                              <CheckCircle2 className="w-2.5 h-2.5" /> CHOICE
                            </span>
                          )}
                          {art.isOpinion && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold rounded">
                              <Sparkles className="w-2.5 h-2.5" /> COLUMNS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(art)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(art.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

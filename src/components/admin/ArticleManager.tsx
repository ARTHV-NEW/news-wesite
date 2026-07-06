import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, CheckCircle2, AlertOctagon, Sparkles, Award, Link2 } from 'lucide-react';
import { subscribeArticles, saveArticle, deleteArticle, getUniqueSlug, handleSlugChange, generateSlug } from '../../services/db';
import { Article } from '../../types';

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

  // Generate slug automatically from title on create
  useEffect(() => {
    if (!editingArticle) {
      setSlug(generateSlug(title));
    }
  }, [title, editingArticle]);

  useEffect(() => {
    const unsubscribe = subscribeArticles((liveArticles) => {
      setArticles(liveArticles);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateNew = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setCategory('World');
    setTag('Breaking');
    setImageUrl('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80');
    setAuthorName('Staff Reporter');
    setAuthorRole('Political Editor');
    setAuthorAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60');
    setRawContent('This is a newly created investigative article paragraph.\n\nHere is a second paragraph detailing the breaking event with background information.');
    setRawInsights('Artificial intelligence is shifting global media structures.\nAccountability in media is more critical than ever.');
    setIsBreaking(false);
    setIsFeatured(false);
    setIsEditorsChoice(false);
    setIsOpinion(false);
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
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const id = editingArticle?.id || 'art-' + Date.now();
    const contentArr = rawContent.split('\n\n').map(p => p.trim()).filter(Boolean);
    const insightsArr = rawInsights.split('\n').map(l => l.trim()).filter(Boolean);

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
        avatar: authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60'
      },
      publishedAt: editingArticle?.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      readTime: editingArticle?.readTime || `${Math.max(1, Math.round(contentArr.join(' ').split(' ').length / 200))} min read`,
      category,
      tag,
      imageUrl,
      isBreaking,
      isFeatured,
      isEditorsChoice,
      isOpinion,
      likes: editingArticle?.likes || 0,
      aiInsights: insightsArr,
      comments: editingArticle?.comments || []
    };

    try {
      await saveArticle(articleToSave);
      setIsEditing(false);
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

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    art.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (art.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Articles Control</h2>
          <p className="text-sm text-gray-500">Edit, write, publish and delete news dispatches instantly.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Add New Article
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 tracking-tight border-b border-gray-100 pb-3 font-serif">
            {editingArticle ? `Edit Article: ${title}` : 'Write New Article'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  placeholder="E.g. Tech Giant Unveils Revolutionary Quantum Chip"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">URL Slug</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={e => setSlug(generateSlug(e.target.value))} 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-mono"
                  placeholder="e.g. tech-giant-unveils-revolutionary-quantum-chip"
                />
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <Link2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="font-semibold text-gray-600">Permalink Preview:</span>
                  <span className="font-mono text-gray-500 select-all truncate">https://pulsenews.com/articles/{slug || 'untitled'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={subtitle} 
                  onChange={e => setSubtitle(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="E.g. A major step towards commercial quantum computing solutions"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {['World', 'Politics', 'Business', 'Technology', 'Health', 'Science', 'Sports', 'Culture', 'Opinion'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tag</label>
                  <input 
                    type="text" 
                    value={tag} 
                    onChange={e => setTag(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="E.g. Breaking, Special, Analysis"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Featured Image URL</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Unsplash, absolute or static URL"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-200 pb-2">Author details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Author Name</label>
                    <input 
                      type="text" 
                      value={authorName} 
                      onChange={e => setAuthorName(e.target.value)} 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Author Role</label>
                    <input 
                      type="text" 
                      value={authorRole} 
                      onChange={e => setAuthorRole(e.target.value)} 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Author Avatar URL</label>
                  <input 
                    type="text" 
                    value={authorAvatar} 
                    onChange={e => setAuthorAvatar(e.target.value)} 
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Article Body Content (Separate paragraphs with double Enter / blank lines)</label>
                <textarea 
                  value={rawContent} 
                  onChange={e => setRawContent(e.target.value)} 
                  required
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-sans"
                  placeholder="Paste the full article text. Every block separated by double linebreaks creates a beautiful paragraph on the reading page."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">AI Bullet Insights (One per line)</label>
                <textarea 
                  value={rawInsights} 
                  onChange={e => setRawInsights(e.target.value)} 
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-sans"
                  placeholder="Insight bullet 1...&#10;Insight bullet 2..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-200 pb-2">Editorial Flags</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={isBreaking} onChange={e => setIsBreaking(e.target.checked)} className="w-4 h-4 accent-red-600" />
                    <span className="text-xs font-bold text-gray-700">BREAKING NEWS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-red-600" />
                    <span className="text-xs font-bold text-gray-700">FEATURED HERO</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={isEditorsChoice} onChange={e => setIsEditorsChoice(e.target.checked)} className="w-4 h-4 accent-red-600" />
                    <span className="text-xs font-bold text-gray-700">EDITORS' CHOICE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={isOpinion} onChange={e => setIsOpinion(e.target.checked)} className="w-4 h-4 accent-red-600" />
                    <span className="text-xs font-bold text-gray-700">OP-ED COLUMNS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider"
            >
              Publish Real-Time
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search articles by title, category, author..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Total Count: {filteredArticles.length}
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
                  filteredArticles.map(art => (
                    <tr key={art.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 shrink-0">
                        <img src={art.imageUrl} alt="" className="w-16 h-10 object-cover rounded border border-gray-200" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900 leading-tight font-serif mb-1 line-clamp-2">
                          {art.title}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1">{art.subtitle}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src={art.author?.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-gray-200" />
                          <span className="text-sm text-gray-700 font-medium">{art.author?.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">{art.publishedAt}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider">
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
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(art.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors"
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

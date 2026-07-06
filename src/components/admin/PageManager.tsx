import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, FileText, Link2, Plus, Trash2 } from 'lucide-react';
import { subscribePages, savePageContent, deletePageContent, PageContent, generateSlug, getUniqueSlug, handleSlugChange } from '../../services/db';

export default function PageManager() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('About');
  
  // Edit Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [prevSlug, setPrevSlug] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribePages((livePages) => {
      setPages(livePages);
      if (livePages.length > 0 && !livePages.find(p => p.id === selectedPageId) && !isCreating) {
        setSelectedPageId(livePages[0].id);
      }
    });
    return () => unsubscribe();
  }, [selectedPageId, isCreating]);

  useEffect(() => {
    if (isCreating) return;
    const page = pages.find(p => p.id === selectedPageId);
    if (page) {
      setTitle(page.title);
      setSlug(page.slug || generateSlug(page.id));
      setPrevSlug(page.slug || generateSlug(page.id));
      setContent(page.content);
      setSaveStatus('idle');
    }
  }, [selectedPageId, pages, isCreating]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedPageId('');
    setTitle('');
    setSlug('');
    setPrevSlug('');
    setContent('');
    setSaveStatus('idle');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePageContent(id);
        if (selectedPageId === id) {
          setIsCreating(false);
          setSelectedPageId(pages[0]?.id || '');
        }
      } catch (err) {
        console.error('Error deleting page: ', err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    setSaveStatus('idle');

    const idToSave = isCreating ? generateSlug(title) : selectedPageId;
    const resolvedBaseSlug = generateSlug(slug || title);
    const resolvedSlug = await getUniqueSlug('pages', resolvedBaseSlug, idToSave);

    // Setup 301 Redirect if page slug changed
    if (!isCreating && prevSlug && prevSlug !== resolvedSlug) {
      console.log(`Setting up 301 Redirect for page: ${prevSlug} -> ${resolvedSlug}`);
      await handleSlugChange('pages', prevSlug, resolvedSlug);
    }

    try {
      await savePageContent({
        id: idToSave,
        title,
        content,
        slug: resolvedSlug
      });
      setSaveStatus('success');
      if (isCreating) {
        setIsCreating(false);
        setSelectedPageId(idToSave);
      }
    } catch (err) {
      console.error('Error saving page: ', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Static Pages Copy Deck</h2>
          <p className="text-sm text-gray-500">Edit informational, compliance, and legal pages instantly in real-time.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Page to Edit</label>
          {pages.map(page => {
            const isActive = selectedPageId === page.id && !isCreating;
            return (
              <div key={page.id} className={`flex items-center justify-between rounded-lg border transition-colors ${
                  isActive 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedPageId(page.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold"
                >
                  <FileText className={`w-4 h-4 ${isActive ? 'text-red-700' : 'text-gray-400'}`} />
                  {page.title}
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors mr-2"
                  title="Delete Page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-black font-serif text-gray-900 tracking-tight border-b border-gray-100 pb-3">
              {isCreating ? 'Create New Page' : `Editing: ${title} Page`}
            </h3>

            {saveStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Page copy successfully synchronized and saved.
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Failed to save page copy. Please try again.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Page Headline Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
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
              />
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Link2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-semibold text-gray-600">Permalink Preview:</span>
                <span className="font-mono text-gray-500 select-all truncate">https://pulsenews.com/{slug || 'untitled'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Main Page Body Copy (Markdown/Rich Text Support)</label>
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)}
                required
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none font-sans leading-relaxed"
                placeholder="Write page content..."
              />
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Synchronizing...' : (isCreating ? 'Create Page' : 'Save Page Copy')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

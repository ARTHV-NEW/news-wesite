import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { subscribePages, savePageContent, PageContent } from '../../services/db';

export default function PageManager() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('About');
  
  // Edit Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const unsubscribe = subscribePages((livePages) => {
      setPages(livePages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const page = pages.find(p => p.id === selectedPageId);
    if (page) {
      setTitle(page.title);
      setContent(page.content);
      setSaveStatus('idle');
    }
  }, [selectedPageId, pages]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await savePageContent({
        id: selectedPageId,
        title,
        content
      });
      setSaveStatus('success');
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Page to Edit</label>
          {['About', 'Contact', 'Privacy', 'Terms', 'Cookies', 'Sitemap'].map(id => {
            const isActive = selectedPageId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedPageId(id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold rounded-lg border transition-colors ${
                  isActive 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FileText className={`w-4 h-4 ${isActive ? 'text-red-700' : 'text-gray-400'}`} />
                {id} Page
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-black font-serif text-gray-900 tracking-tight border-b border-gray-100 pb-3">
              Editing: {selectedPageId} Page
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
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
                <Save className="w-4 h-4" /> {isSaving ? 'Synchronizing...' : 'Save Page Copy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

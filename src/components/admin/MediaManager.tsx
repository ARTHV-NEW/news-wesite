import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Link as LinkIcon, ExternalLink, ImageIcon } from 'lucide-react';
import { subscribeMedia, addMediaAsset, deleteMediaAsset, MediaAsset } from '../../services/db';

export default function MediaManager() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Adding asset form
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('image/jpeg');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeMedia((liveMedia) => {
      setMedia(liveMedia);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    try {
      await addMediaAsset({
        title,
        url,
        type,
        createdAt: new Date().toISOString()
      });
      setIsAdding(false);
      setTitle('');
      setUrl('');
    } catch (err) {
      console.error('Error adding media: ', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset from the Media Hub?')) {
      try {
        await deleteMediaAsset(id);
      } catch (err) {
        console.error('Error deleting media: ', err);
      }
    }
  };

  const filteredMedia = media.filter(med => 
    med.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Media Hub</h2>
          <p className="text-sm text-gray-500">Catalog illustrations, banners and photograph links for easy integration.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Link Visual Asset
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">Link New Photographic Asset</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Asset Title / Description</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="E.g. Downing Street Pressroom Briefing"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Absolute Image URL</label>
              <input 
                type="text" 
                value={url} 
                onChange={e => setUrl(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="E.g. https://images.unsplash.com/photo-..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mime Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              >
                <option value="image/jpeg">image/jpeg</option>
                <option value="image/png">image/png</option>
                <option value="image/webp">image/webp</option>
                <option value="image/gif">image/gif</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 uppercase tracking-wider"
            >
              Catalog Asset
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search cataloged images by title..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMedia.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200">
              No photographic assets logged yet. Click "Link Visual Asset" above to add.
            </div>
          ) : (
            filteredMedia.map(asset => (
              <div key={asset.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow transition-shadow group flex flex-col justify-between">
                <div className="relative aspect-video bg-gray-900 overflow-hidden shrink-0">
                  <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                    {asset.type.split('/')[1] || 'image'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1" title={asset.title}>
                      {asset.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Logged: {new Date(asset.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(asset.url);
                        alert('Image URL copied to clipboard! Use it directly in your articles.');
                      }}
                      className="text-gray-500 hover:text-red-600 flex items-center gap-1 font-bold tracking-tight cursor-pointer"
                      title="Copy absolute link"
                    >
                      <LinkIcon className="w-3.5 h-3.5" /> Copy Link
                    </button>

                    <div className="flex items-center gap-1">
                      <a 
                        href={asset.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View Full Resolution"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDelete(asset.id)}
                        className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Remove Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

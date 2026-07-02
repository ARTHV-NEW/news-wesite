import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Eye, EyeOff, Megaphone } from 'lucide-react';
import { subscribeAds, saveAdBanner, deleteAdBanner, AdBanner } from '../../services/db';

export default function AdManager() {
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [type, setType] = useState<'top' | 'sidebar' | 'inline'>('sidebar');
  const [isActive, setIsActive] = useState(true);

  // New ad form
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAds((liveAds) => {
      setAds(liveAds);
    });
    return () => unsubscribe();
  }, []);

  const handleStartAdd = () => {
    setTitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1557683316-973673baf926?w=400&auto=format&fit=crop&q=80');
    setTargetUrl('#');
    setType('sidebar');
    setIsActive(true);
    setIsAdding(true);
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const id = 'ad-' + Date.now();
    const item: AdBanner = {
      id,
      title,
      description,
      imageUrl,
      targetUrl,
      type,
      isActive
    };

    try {
      await saveAdBanner(item);
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding ad: ', err);
    }
  };

  const handleStartEdit = (ad: AdBanner) => {
    setEditingId(ad.id);
    setTitle(ad.title);
    setDescription(ad.description);
    setImageUrl(ad.imageUrl);
    setTargetUrl(ad.targetUrl);
    setType(ad.type);
    setIsActive(ad.isActive);
  };

  const handleSaveEdit = async (id: string) => {
    if (!title.trim() || !imageUrl.trim()) return;

    const item: AdBanner = {
      id,
      title,
      description,
      imageUrl,
      targetUrl,
      type,
      isActive
    };

    try {
      await saveAdBanner(item);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving ad: ', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement banner?')) {
      try {
        await deleteAdBanner(id);
      } catch (err) {
        console.error('Error deleting ad: ', err);
      }
    }
  };

  const handleToggleStatus = async (ad: AdBanner) => {
    try {
      await saveAdBanner({
        ...ad,
        isActive: !ad.isActive
      });
    } catch (err) {
      console.error('Error toggling ad: ', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Advertisements Control</h2>
          <p className="text-sm text-gray-500">Inject, schedule, pause and configure promotional banners in the app.</p>
        </div>
        <button 
          onClick={handleStartAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Create Ad Slot
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSaveNew} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">Deploy New Advertisement Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Ad Title / Campaign</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="E.g. Subscribe to Morning Pulse Premium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Ad Description / Subtext</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="E.g. Get 50% off of annual subscription"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Target Click-Through URL</label>
                <input 
                  type="text" 
                  value={targetUrl} 
                  onChange={e => setTargetUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="E.g. /subscribe or #"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Absolute image link"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Placement Slot</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  >
                    <option value="sidebar">Sidebar Banner</option>
                    <option value="top">Top Header Banner</option>
                    <option value="inline">Inline Article Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Initial Status</label>
                  <select 
                    value={isActive ? 'active' : 'inactive'} 
                    onChange={e => setIsActive(e.target.value === 'active')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  >
                    <option value="active">Active (Live)</option>
                    <option value="inactive">Paused</option>
                  </select>
                </div>
              </div>
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
              Deploy Campaign
            </button>
          </div>
        </form>
      )}

      {editingId && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(editingId); }} className="bg-amber-50 rounded-xl border border-amber-200 p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-2">Modify Ad Campaign</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">Ad Title / Campaign</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-amber-300 bg-white rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">Ad Description</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 bg-white rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">Target Click-Through URL</label>
                <input 
                  type="text" 
                  value={targetUrl} 
                  onChange={e => setTargetUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 bg-white rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-amber-300 bg-white rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">Placement Slot</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-amber-300 bg-white rounded-lg text-sm"
                  >
                    <option value="sidebar">Sidebar Banner</option>
                    <option value="top">Top Header Banner</option>
                    <option value="inline">Inline Article Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={isActive ? 'active' : 'inactive'} 
                    onChange={e => setIsActive(e.target.value === 'active')}
                    className="w-full px-3 py-2 border border-amber-300 bg-white rounded-lg text-sm"
                  >
                    <option value="active">Active (Live)</option>
                    <option value="inactive">Paused</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setEditingId(null)}
              className="px-4 py-2 border border-amber-300 bg-white text-gray-700 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-bold uppercase tracking-wider"
            >
              Update Campaign
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Creative preview</th>
                <th className="py-3 px-4">Campaign Title / Desc</th>
                <th className="py-3 px-4">Target Spot</th>
                <th className="py-3 px-4">Direct Redirect</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">No ad campaigns loaded.</td>
                </tr>
              ) : (
                ads.map(ad => (
                  <tr key={ad.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6 shrink-0">
                      <img src={ad.imageUrl} alt="" className="w-20 h-10 object-cover rounded border border-gray-200" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900 leading-tight mb-0.5">{ad.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{ad.description}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider">
                        {ad.type} Slot
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 font-mono">
                      {ad.targetUrl}
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => handleToggleStatus(ad)}
                        className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-black tracking-wider rounded uppercase border ${
                          ad.isActive 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                      >
                        {ad.isActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Paused
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleStartEdit(ad)}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
                          title="Modify creative"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ad.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                          title="Delete slot"
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
    </div>
  );
}

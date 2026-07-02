import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { subscribeMenu, saveMenuItem, deleteMenuItem, MenuItem } from '../../services/db';

export default function MenuManager() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editOrder, setEditOrder] = useState<number>(1);

  // New item form
  const [newLabel, setNewLabel] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newOrder, setNewOrder] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeMenu((liveMenu) => {
      setMenus(liveMenu);
    });
    return () => unsubscribe();
  }, []);

  const handleStartAdd = () => {
    setNewLabel('');
    setNewLink('World');
    setNewOrder(menus.length > 0 ? Math.max(...menus.map(m => m.order)) + 1 : 1);
    setIsAdding(true);
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const id = newLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'menu-' + Date.now();
    const item: MenuItem = {
      id,
      label: newLabel,
      link: newLink,
      order: Number(newOrder)
    };

    try {
      await saveMenuItem(item);
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding menu item: ', err);
    }
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditLink(item.link);
    setEditOrder(item.order);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editLabel.trim()) return;

    const item: MenuItem = {
      id,
      label: editLabel,
      link: editLink,
      order: Number(editOrder)
    };

    try {
      await saveMenuItem(item);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving menu item: ', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu link? It will disappear from the global header.')) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        console.error('Error deleting menu item: ', err);
      }
    }
  };

  const handleMove = async (item: MenuItem, direction: 'up' | 'down') => {
    const index = menus.findIndex(m => m.id === item.id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === menus.length - 1) return;

    const swapWithIndex = direction === 'up' ? index - 1 : index + 1;
    const swapItem = menus[swapWithIndex];

    const updatedItem = { ...item, order: swapItem.order };
    const updatedSwapItem = { ...swapItem, order: item.order };

    try {
      await saveMenuItem(updatedItem);
      await saveMenuItem(updatedSwapItem);
    } catch (err) {
      console.error('Error shifting order:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Header Navigation</h2>
          <p className="text-sm text-gray-500">Edit menu names, order sequence and targeted categories dynamically.</p>
        </div>
        <button 
          onClick={handleStartAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Add Menu Tab
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSaveNew} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">Add New Navigation Tab</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Display Label</label>
              <input 
                type="text" 
                value={newLabel} 
                onChange={e => setNewLabel(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="E.g. Tech World"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Target Category / Action</label>
              <select 
                value={newLink} 
                onChange={e => setNewLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              >
                {['Home', 'World', 'Politics', 'Business', 'Technology', 'Health', 'Science', 'Sports', 'Culture', 'Opinion', 'About', 'Contact', 'Privacy', 'Terms', 'Cookies', 'Sitemap'].map(link => (
                  <option key={link} value={link}>{link}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sort Order Weight</label>
              <input 
                type="number" 
                value={newOrder} 
                onChange={e => setNewOrder(Number(e.target.value))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
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
              Add Link
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-6 w-20">Sequence</th>
                <th className="py-3 px-4">Menu Name</th>
                <th className="py-3 px-4">Action / Target Category</th>
                <th className="py-3 px-4">Order Index</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {menus.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleMove(item, 'up')} 
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleMove(item, 'down')} 
                        disabled={idx === menus.length - 1}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {editingId === item.id ? (
                      <input 
                        type="text" 
                        value={editLabel} 
                        onChange={e => setEditLabel(e.target.value)} 
                        className="px-3 py-1 border border-gray-300 rounded text-sm w-48"
                      />
                    ) : (
                      item.label
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {editingId === item.id ? (
                      <select 
                        value={editLink} 
                        onChange={e => setEditLink(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {['Home', 'World', 'Politics', 'Business', 'Technology', 'Health', 'Science', 'Sports', 'Culture', 'Opinion', 'About', 'Contact', 'Privacy', 'Terms', 'Cookies', 'Sitemap'].map(link => (
                          <option key={link} value={link}>{link}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-mono text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">{item.link}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {editingId === item.id ? (
                      <input 
                        type="number" 
                        value={editOrder} 
                        onChange={e => setEditOrder(Number(e.target.value))} 
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                      />
                    ) : (
                      item.order
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === item.id ? (
                        <button 
                          onClick={() => handleSaveEdit(item.id)}
                          className="p-1.5 bg-green-50 hover:bg-green-100 rounded text-green-700 transition-colors"
                          title="Save Changes"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
                          title="Edit link"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

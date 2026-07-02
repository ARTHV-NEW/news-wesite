import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { subscribeTags, saveTagItem, deleteTagItem, TagItem } from '../../services/db';

export default function TagManager() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTags((liveTags) => {
      setTags(liveTags);
    });
    return () => unsubscribe();
  }, []);

  const handleStartAdd = () => {
    setName('');
    setIsAdding(true);
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.trim();
    const item: TagItem = {
      id,
      name
    };

    try {
      await saveTagItem(item);
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding tag: ', err);
    }
  };

  const handleStartEdit = (tag: TagItem) => {
    setEditingId(tag.id);
    setName(tag.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!name.trim()) return;

    const item: TagItem = {
      id,
      name
    };

    try {
      await saveTagItem(item);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving tag: ', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this system label tag?')) {
      try {
        await deleteTagItem(id);
      } catch (err) {
        console.error('Error deleting tag: ', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Topic Labels & Tags</h2>
          <p className="text-sm text-gray-500">Edit and deploy promotional and informational tag badges for layout grids.</p>
        </div>
        <button 
          onClick={handleStartAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider animate-fade-in"
        >
          <Plus className="w-4 h-4" /> Create Label Tag
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSaveNew} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">Create New Badge Label</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tag/Label Text</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="E.g. Special Report"
            />
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
              Add Badge
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50 text-xs font-bold uppercase tracking-wider">
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-4">Tag Display Name</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tags.map(tag => (
              <tr key={tag.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="py-4 px-6 font-mono text-xs text-gray-400">
                  {tag.id}
                </td>
                <td className="py-4 px-4 font-bold text-gray-900">
                  {editingId === tag.id ? (
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="px-3 py-1 border border-gray-300 rounded text-sm w-48 font-sans"
                    />
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">{tag.name}</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === tag.id ? (
                      <button 
                        onClick={() => handleSaveEdit(tag.id)}
                        className="p-1.5 bg-green-50 hover:bg-green-100 rounded text-green-700"
                        title="Save tag"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStartEdit(tag)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
                        title="Edit tag name"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(tag.id)}
                      className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                      title="Remove label"
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
  );
}

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { subscribeCategories, saveCategoryItem, deleteCategoryItem, CategoryItem, generateSlug, getUniqueSlug, handleSlugChange } from '../../services/db';
import { Link2 } from 'lucide-react';

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  
  // Adding Category State
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCategories((liveCats) => {
      setCategories(liveCats);
    });
    return () => unsubscribe();
  }, []);

  // Sync slug on category name change
  useEffect(() => {
    if (!editingId) {
      setSlug(generateSlug(name));
    }
  }, [name, editingId]);

  const handleStartAdd = () => {
    setName('');
    setSlug('');
    setDescription('');
    setIsAdding(true);
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = generateSlug(name);
    const resolvedSlug = await getUniqueSlug('categories', slug || id, id);

    const item: CategoryItem = {
      id,
      name,
      description,
      slug: resolvedSlug
    };

    try {
      await saveCategoryItem(item);
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding category: ', err);
    }
  };

  const [prevSlug, setPrevSlug] = useState('');

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug || generateSlug(cat.name));
    setPrevSlug(cat.slug || generateSlug(cat.name));
    setDescription(cat.description);
  };

  const handleSaveEdit = async (id: string) => {
    if (!name.trim()) return;

    const resolvedBaseSlug = generateSlug(slug || name);
    const resolvedSlug = await getUniqueSlug('categories', resolvedBaseSlug, id);

    // Setup 301 Redirect if category slug changed
    if (prevSlug && prevSlug !== resolvedSlug) {
      console.log(`Setting up 301 Redirect for category: ${prevSlug} -> ${resolvedSlug}`);
      await handleSlugChange('categories', prevSlug, resolvedSlug);
    }

    const item: CategoryItem = {
      id,
      name,
      description,
      slug: resolvedSlug
    };

    try {
      await saveCategoryItem(item);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving category: ', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Articles under this category may become unlisted.')) {
      try {
        await deleteCategoryItem(id);
      } catch (err) {
        console.error('Error deleting category: ', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Categories Deck</h2>
          <p className="text-sm text-gray-500">Edit, add, and organize core topical sections of the news application.</p>
        </div>
        <button 
          onClick={handleStartAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSaveNew} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">Create New Category Section</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="E.g. Geo-Politics"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">URL Slug</label>
              <input 
                type="text" 
                value={slug} 
                onChange={e => setSlug(generateSlug(e.target.value))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="e.g. geo-politics"
              />
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Link2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-semibold text-gray-600">Permalink Preview:</span>
                <span className="font-mono text-gray-500 select-all truncate">https://pulsenews.com/category/{slug || 'untitled'}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Brief Description</label>
              <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="E.g. Dynamic updates regarding global sovereign choices."
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
              Add Section
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-6">ID Section</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Description Text</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-gray-400">
                    {cat.id}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {editingId === cat.id ? (
                      <div className="flex flex-col gap-1.5 w-64">
                        <input 
                          type="text" 
                          value={name} 
                          onChange={e => setName(e.target.value)} 
                          className="px-3 py-1 border border-gray-300 rounded text-sm font-semibold"
                          placeholder="Name"
                        />
                        <input 
                          type="text" 
                          value={slug} 
                          onChange={e => setSlug(generateSlug(e.target.value))} 
                          className="px-3 py-1 border border-gray-300 rounded text-xs font-mono"
                          placeholder="slug"
                        />
                      </div>
                    ) : (
                      <div>
                        <div>{cat.name}</div>
                        <div className="text-xs font-mono text-gray-500 font-normal">/{cat.slug || generateSlug(cat.name)}</div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {editingId === cat.id ? (
                      <input 
                        type="text" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        className="px-3 py-1 border border-gray-300 rounded text-sm w-full"
                      />
                    ) : (
                      cat.description
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === cat.id ? (
                        <button 
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-1.5 bg-green-50 hover:bg-green-100 rounded text-green-700"
                          title="Save category"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
                          title="Edit category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                        title="Remove category"
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

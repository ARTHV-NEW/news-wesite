import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { X, User, Edit2, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, profile, logout, reloadProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        bio
      });
      await reloadProfile();
      setMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-lg w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-black tracking-tight">{profile?.firstName} {profile?.lastName}</h2>
              <p className="text-sm font-mono text-gray-500">{user.email}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm flex gap-2 items-start border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm flex gap-2 items-start border border-green-200">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Biography</h4>
                <p className="text-sm text-gray-800 leading-relaxed font-sans">{profile?.bio || 'No biography added yet.'}</p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-bold transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Biography</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={() => { setIsEditing(false); setError(''); setMessage(''); }}
                  className="px-4 py-2 text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-[#c8232c] transition-colors disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

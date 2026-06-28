import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { User, Edit2, CheckCircle, AlertCircle, LogOut, ArrowLeft, Camera, ExternalLink, MapPin, Calendar, FileText, Bookmark, Clock, Eye, MoreHorizontal, Shield, Settings, Bell, ChevronRight, Crown } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Category } from '../types';

// Standardized error handler required by Firebase skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ProfileViewProps {
  onNavigateBack: () => void;
}

export default function ProfileView({ onNavigateBack }: ProfileViewProps) {
  const { user, profile, logout, reloadProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-black mb-4">You are not signed in</h2>
        <button onClick={onNavigateBack} className="text-blue-600 hover:underline">
          Return to home
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          bio
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
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
    onNavigateBack();
  };

  // Dummy data for the UI
  const myArticles = [
    { title: "The Future of Smart Cities in India", date: "May 28, 2024", views: "1.2K views", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=60" },
    { title: "How AI is Changing the Way We Work", date: "May 20, 2024", views: "890 views", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60" },
    { title: "Space Exploration: What's Next?", date: "May 15, 2024", views: "1.5K views", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60" },
    { title: "The Rise of Renewable Energy", date: "May 10, 2024", views: "750 views", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60" }
  ];

  const readingArchive = [
    { title: "The Psychology Behind Breaking Habits", date: "May 27, 2024", readTime: "8 min read", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60" },
    { title: "Top 10 Tech Trends to Watch in 2024", date: "May 21, 2024", readTime: "6 min read", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60" },
    { title: "Understanding Global Inflation in 2024", date: "May 18, 2024", readTime: "7 min read", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60" },
    { title: "Minimalism: The New Lifestyle Choice", date: "May 12, 2024", readTime: "5 min read", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&auto=format&fit=crop&q=60" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header/Cover Section */}
        <div className="h-48 relative overflow-hidden bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&auto=format&fit=crop&q=80" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute top-4 right-4">
            <button className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
              <Edit2 className="w-4 h-4" /> Edit Cover
            </button>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-8 pb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            
            {/* Left side: Avatar, Name, Bio */}
            <div className="flex-1">
              <div className="relative inline-block -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full text-gray-400 p-6" />
                  )}
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm text-gray-600 hover:text-black">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{profile?.firstName} {profile?.lastName}</h1>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Author</span>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
                <p className="text-gray-600 text-sm max-w-md">
                  {profile?.bio || "News enthusiast and content creator. I love sharing real stories that matter."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> India
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Joined May 2024
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>

            {/* Right side: Stats */}
            <div className="flex flex-wrap lg:flex-nowrap gap-4 pt-4 lg:pt-8 w-full lg:w-auto">
              {[
                { icon: FileText, value: "28", label: "Articles Published" },
                { icon: Bookmark, value: "142", label: "Saved Articles" },
                { icon: Clock, value: "56", label: "Reading Time (hrs)" },
                { icon: Eye, value: "12.4K", label: "Article Views" }
              ].map((stat, i) => (
                <div key={i} className="flex-1 lg:flex-none min-w-[120px] p-5 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center text-center">
                  <stat.icon className="w-5 h-5 text-gray-600 mb-2" strokeWidth={1.5} />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1 max-w-[80px] leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editing Form Overlay/Section */}
        {isEditing && (
           <div className="px-8 pb-8 border-t border-gray-100 pt-8 bg-gray-50">
             <div className="max-w-2xl">
               <h3 className="text-lg font-bold mb-6">Edit Profile Information</h3>
               
               {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 flex gap-3 items-start rounded-lg border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 flex gap-3 items-start rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

               <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Biography</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(profile?.firstName || '');
                      setLastName(profile?.lastName || '');
                      setBio(profile?.bio || '');
                    }}
                    disabled={loading}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-70"
                  >
                    Cancel
                  </button>
                </div>
              </form>
             </div>
           </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-8 border-b border-gray-100 mt-2">
          <div className="flex items-center gap-8 overflow-x-auto">
            {['Overview', 'My Articles', 'Reading Archive', 'Saved', 'Activity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'Overview' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>}
                {tab === 'My Articles' && <FileText className="w-4.5 h-4.5" />}
                {tab === 'Reading Archive' && <Clock className="w-4.5 h-4.5" />}
                {tab === 'Saved' && <Bookmark className="w-4.5 h-4.5" />}
                {tab === 'Activity' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 bg-gray-50/50 min-h-[400px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* My Articles Column */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">My Articles</h3>
                <button className="text-red-500 text-xs font-semibold hover:text-red-600 flex items-center gap-1">
                  View all articles <ArrowLeft className="w-3 h-3 rotate-180" />
                </button>
              </div>
              <div className="space-y-6">
                {myArticles.map((article, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <img src={article.image} alt="" className="w-20 h-14 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate mb-1 group-hover:text-red-600 transition-colors">{article.title}</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        {article.date} <span className="mx-1.5">•</span> {article.views}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Archive Column */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Reading Archive</h3>
                <button className="text-red-500 text-xs font-semibold hover:text-red-600 flex items-center gap-1">
                  View all <ArrowLeft className="w-3 h-3 rotate-180" />
                </button>
              </div>
              <div className="space-y-6">
                {readingArchive.map((article, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <img src={article.image} alt="" className="w-20 h-14 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate mb-1 group-hover:text-red-600 transition-colors">{article.title}</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        {article.date} <span className="mx-1.5">•</span> {article.readTime}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Plan & Quick Actions */}
            <div className="space-y-8">
              {/* Current Plan */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-900">Current Plan</span>
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Creator Plan</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Unlimited articles, advanced analytics, and priority support.
                </p>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Next billing date: June 15, 2025</span>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    Manage Plan
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-1">
                  {[
                    { icon: User, label: "Personal Information" },
                    { icon: Settings, label: "Account Settings" },
                    { icon: Bell, label: "Notification Preferences" },
                    { icon: Shield, label: "Privacy & Security" }
                  ].map((action, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors group">
                      <div className="flex items-center gap-3">
                        <action.icon className="w-4.5 h-4.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

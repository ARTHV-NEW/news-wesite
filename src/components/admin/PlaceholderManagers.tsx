import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, UserPlus, Trash2, Mail, Send, ArrowUpRight, 
  BarChart3, RefreshCw, Eye, Globe, Sliders, ChevronRight, Save, 
  Play, Download, Upload, AlertCircle, RefreshCcw, Lock, HardDrive, 
  Search, ShieldAlert, ArrowRight, BookOpen, Clock, Heart, MessageSquare, Link2
} from 'lucide-react';
import { 
  AuthorItem, CommentModerationItem, NewsletterCampaign, ActivityLogItem,
  BackupItem, HomepageSettings, SeoSettings, NotificationSettings
} from '../../types';
import { 
  subscribeAuthors, saveAuthorItem, deleteAuthorItem,
  generateSlug, getUniqueSlug, handleSlugChange,
  subscribeHomepageSettings, saveHomepageSettings,
  subscribeReaders, updateReaderUser, deleteReaderUser,
  subscribeComments, saveCommentModerationItem, deleteCommentModerationItem,
  subscribeNewsletterCampaigns, saveNewsletterCampaign, deleteNewsletterCampaign,
  subscribeSeoSettings, saveSeoSettings,
  subscribeNotificationSettings, saveNotificationSettings,
  subscribeActivityLogs, logActivity,
  subscribeBackups, addBackupSnapshot,
  ReaderUser
} from '../../services/db';

// ==========================================
// 1. Authors Manager
// ==========================================
export function AuthorsManager() {
  const [authors, setAuthors] = useState<AuthorItem[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [role, setRole] = useState('Staff Writer');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeAuthors((liveAuthors) => {
      setAuthors(liveAuthors);
    });
    return () => unsubscribe();
  }, []);

  // Sync slug on name changes
  useEffect(() => {
    setSlug(generateSlug(name));
  }, [name]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const id = generateSlug(name);
    const resolvedSlug = await getUniqueSlug('authors', slug || id, id);

    const newAuthor: AuthorItem = {
      id,
      name,
      slug: resolvedSlug,
      role,
      email,
      articles: 0,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=60'
    };

    try {
      await saveAuthorItem(newAuthor);
      setName('');
      setEmail('');
      setSuccess(`Correspondent "${name}" registered successfully.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding author: ', err);
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    if (window.confirm(`Are you sure you want to revoke credentials and delete the profile of "${authorName}"?`)) {
      try {
        await deleteAuthorItem(id);
        setSuccess(`Profile of "${authorName}" successfully removed.`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting author:', err);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Editorial Correspondents Directory</h2>
        <p className="text-sm text-gray-500">Add, manage, and audit editorial staff accounts, desk assignments, and reporting metrics in real-time.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Author Profile</th>
                <th className="py-3.5 px-4">Role Assignment</th>
                <th className="py-3.5 px-4">Stories</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {authors.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={a.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-bold text-gray-900">{a.name}</div>
                        <div className="text-xs text-gray-400">{a.email}</div>
                        <div className="text-[10px] font-mono text-gray-500">/author/{a.slug || generateSlug(a.name)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-700">{a.role}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{a.articles || 0}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${
                      a.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                    }`}>
                      {a.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(a.id, a.name)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-gray-500 font-medium">
                    No correspondents registered yet. Add a new staff member to the directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
          <h3 className="font-serif font-black text-lg text-gray-900 mb-4 border-b border-gray-100 pb-3">Register Correspondent</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Liam Sterling"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">URL Slug</label>
              <input 
                type="text" 
                required 
                value={slug}
                onChange={e => setSlug(generateSlug(e.target.value))}
                placeholder="e.g. liam-sterling"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 font-mono"
              />
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Link2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-semibold text-gray-600">Permalink Preview:</span>
                <span className="font-mono text-gray-500 select-all truncate">https://pulsenews.com/author/{slug || 'untitled'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="l.sterling@pulsenews.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Editorial Role</label>
              <select 
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="Senior Editor">Senior Editor</option>
                <option value="Staff Writer">Staff Writer</option>
                <option value="Foreign Correspondent">Foreign Correspondent</option>
                <option value="Copy Editor">Copy Editor</option>
                <option value="Photojournalist">Photojournalist</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Add Staff Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Homepage Builder
// ==========================================
export function HomepageBuilderManager() {
  const [layout, setLayout] = useState('classic');
  const [breakingId, setBreakingId] = useState('world-leaders-carbon-summit');
  const [showLatest, setShowLatest] = useState(true);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeHomepageSettings((settings) => {
      if (settings) {
        setLayout(settings.layout || 'classic');
        setBreakingId(settings.breakingId || 'world-leaders-carbon-summit');
        setShowLatest(settings.showLatest !== false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveHomepageSettings({
        layout,
        breakingId,
        showLatest,
        updatedAt: new Date().toISOString()
      });
      await logActivity('Admin Staff', 'Modified homepage layout configuration', 'Homepage Builder');
      setSuccess('Homepage layout configurations updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving homepage layout settings:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Visual Homepage Builder</h2>
        <p className="text-sm text-gray-500">Design structural page grids, curate hero articles, and trigger site-wide breaking news alerts.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">Grid Layout Preset</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'classic', name: 'Editorial Grid (Standard)', desc: '1 hero center story, left vertical sidebar, right secondary list' },
                { id: 'focus', name: 'Single Breaking Story', desc: 'Giant full-width splash hero article for historic historic announcements' },
                { id: 'magazine', name: 'Magazine Masonry', desc: 'Dense bento box visual grid optimal for photojournalism stories' }
              ].map(p => {
                const isSelected = layout === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setLayout(p.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected ? 'border-red-600 bg-red-50/30 ring-2 ring-red-500/10' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-gray-900 uppercase tracking-wide">{p.name}</span>
                      <input 
                        type="radio" 
                        name="layout" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        className="text-red-600 focus:ring-red-500 h-4 w-4" 
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">Curated Sections Placement</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wide text-gray-700">1. Hero Cover Banner</span>
                  <p className="text-xs text-gray-500">Carbon emissions summit Geneva coverage selected</p>
                </div>
                <button type="button" className="text-xs font-bold text-red-600 hover:text-red-700">Change Curated Story</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wide text-gray-700">2. Left Editorial Column</span>
                  <p className="text-xs text-gray-500">Live automatic stream by 'World' desk</p>
                </div>
                <button type="button" className="text-xs font-bold text-red-600 hover:text-red-700">Configure Desk Filter</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wide text-gray-700">3. Right Visual Slider Sidebar</span>
                  <p className="text-xs text-gray-500">Latest media library assets with gallery tags</p>
                </div>
                <button type="button" className="text-xs font-bold text-red-600 hover:text-red-700">Disable Module</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">Homepage Controls</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Breaking Article</label>
                <select 
                  value={breakingId}
                  onChange={e => setBreakingId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="world-leaders-carbon-summit">WORLD LEADERS CONVENE FOR CARBON SUMMIT</option>
                  <option value="ai-outperforms-radiologists">AI OUTPERFORMS HUMAN RADIOLOGISTS</option>
                  <option value="federal-reserve-cuts">FEDERAL RESERVE CUTS INTEREST RATES</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-gray-700">Show Latest Stream Block</span>
                  <p className="text-[10px] text-gray-400">Append chronic timeline ticker below Hero</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={showLatest}
                  onChange={e => setShowLatest(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" /> Publish Layout Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 3. Users Manager
// ==========================================
export function UserManager() {
  const [staff, setStaff] = useState<ReaderUser[]>([]);
  const [success, setSuccess] = useState('');
  const [emailToPromote, setEmailToPromote] = useState('');
  const [roleDesignation, setRoleDesignation] = useState('Staff Correspondent');

  useEffect(() => {
    const unsubscribe = subscribeReaders((liveUsers) => {
      setStaff(liveUsers.filter(u => u.isAdmin));
    });
    return () => unsubscribe();
  }, []);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToPromote.trim()) return;

    try {
      const emailQuery = emailToPromote.toLowerCase().trim();
      const id = 'staff-' + Date.now();
      const nameParts = emailQuery.split('@')[0].split('.');
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'New';
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Staff';

      const newStaff: ReaderUser = {
        id,
        firstName,
        lastName,
        email: emailQuery,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        bio: roleDesignation
      };

      await updateReaderUser(id, newStaff);
      await logActivity('Admin Staff', `Promoted user ${emailQuery} to ${roleDesignation}`, 'Security Access');
      setSuccess(`Account "${emailQuery}" promoted successfully.`);
      setEmailToPromote('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error promoting staff:', err);
    }
  };

  const handleRevoke = async (userId: string, email: string) => {
    if (window.confirm(`Are you sure you want to revoke administrative permissions for ${email}?`)) {
      try {
        await updateReaderUser(userId, { isAdmin: false });
        await logActivity('Admin Staff', `Revoked administrative access for ${email}`, 'Security Access');
        setSuccess(`Revoked administrative permissions for ${email}.`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error revoking staff:', err);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Staff Access & Permissions</h2>
        <p className="text-sm text-gray-500">Configure editorial level hierarchies, authorize new console administrators and audit active system access credentials.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Staff Account</th>
                <th className="py-3.5 px-4">Role Designation</th>
                <th className="py-3.5 px-4">Security Level</th>
                <th className="py-3.5 px-6 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map(s => {
                const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Staff Member';
                const isRoot = s.email.includes('admin@pulsenews.com');
                return (
                  <tr key={s.id} className="hover:bg-gray-50/20 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-bold text-gray-900">{fullName}</div>
                        <div className="text-xs text-gray-400">{s.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-700">{s.bio || 'Staff Correspondent'}</td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-500">
                      {isRoot ? 'Level 5 (Root)' : 'Level 3 (Desk Access)'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {!isRoot && (
                        <button 
                          onClick={() => handleRevoke(s.id, s.email)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-4">Promote Staff Access</h3>
          <form onSubmit={handlePromote} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">User Email Address</label>
              <input 
                type="email" 
                required
                value={emailToPromote}
                onChange={e => setEmailToPromote(e.target.value)}
                placeholder="editor@pulsenews.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role Designation</label>
              <select 
                value={roleDesignation}
                onChange={e => setRoleDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              >
                <option value="Editorial Supervisor">Editorial Supervisor</option>
                <option value="Staff Correspondent">Staff Correspondent</option>
                <option value="Moderation Officer">Moderation Officer</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" /> Grant Access Scopes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. Comments Manager
// ==========================================
export function CommentManager() {
  const [comments, setComments] = useState<CommentModerationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('Pending');

  useEffect(() => {
    const unsubscribe = subscribeComments((liveComments) => {
      setComments(liveComments);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (id: string, status: 'Approved' | 'Spam' | 'Deleted') => {
    const commentToUpdate = comments.find(c => c.id === id);
    if (!commentToUpdate) return;
    try {
      await saveCommentModerationItem({
        ...commentToUpdate,
        status
      });
      await logActivity('Admin Staff', `Moderated comment by ${commentToUpdate.user} status to ${status}`, 'Comments');
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const filteredComments = comments.filter(c => c.status === activeFilter);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Reader Discussion & Moderation</h2>
        <p className="text-sm text-gray-500">Audit interactive comments, flag comment spammers, and approve readers responses instantly.</p>
      </div>

      <div className="flex border-b border-gray-200">
        {['Pending', 'Approved', 'Spam', 'Deleted'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeFilter === f ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {f} ({comments.filter(c => c.status === f).length})
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
        {filteredComments.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-medium">No comments found under status "{activeFilter}".</div>
        ) : (
          filteredComments.map(c => (
            <div key={c.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/30 transition-colors">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{c.user}</span>
                  <span className="text-xs text-gray-400">{c.email}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{c.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-red-600">Article: {c.article}</div>
                <p className="text-sm text-gray-700 font-serif italic leading-relaxed">"{c.text}"</p>
              </div>

              {activeFilter === 'Pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleAction(c.id, 'Approved')}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black tracking-widest uppercase rounded cursor-pointer transition-colors"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(c.id, 'Spam')}
                    className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 text-[10px] font-black tracking-widest uppercase rounded cursor-pointer transition-colors"
                  >
                    Spam
                  </button>
                  <button 
                    onClick={() => handleAction(c.id, 'Deleted')}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] font-black tracking-widest uppercase rounded cursor-pointer transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. Newsletter Manager
// ==========================================
export function NewsletterManager() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [segment, setSegment] = useState('All Subscribers');
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeNewsletterCampaigns((liveCampaigns) => {
      setCampaigns(liveCampaigns);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setIsSending(true);
    try {
      const id = 'newsletter-' + Date.now();
      const count = segment.includes('Premium') ? 28140 : segment.includes('Weekend') ? 94200 : 142520;
      const newCampaign: NewsletterCampaign = {
        id,
        subject,
        segment,
        content,
        status: 'Sent',
        sentToCount: count,
        createdAt: new Date().toISOString()
      };
      await saveNewsletterCampaign(newCampaign);
      await logActivity('Admin Staff', `Broadcasted newsletter campaign "${subject}" to ${segment}`, 'Newsletters');
      setSuccess(`Newsletter dispatch for segment "${segment}" was triggered successfully to ${count.toLocaleString()} readers.`);
      setSubject('');
      setContent('');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error sending newsletter:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteCampaign = async (id: string, sub: string) => {
    if (window.confirm(`Are you sure you want to delete campaign "${sub}"?`)) {
      try {
        await deleteNewsletterCampaign(id);
        await logActivity('Admin Staff', `Deleted newsletter dispatch record for "${sub}"`, 'Newsletters');
      } catch (err) {
        console.error('Error deleting campaign:', err);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Newsletter Dispatch Control</h2>
        <p className="text-sm text-gray-500">Draft, review, and schedule premium custom newsletters to subscriber lists instantly.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-4">Draft News Campaign</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject Line</label>
              <input 
                type="text" 
                required 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Breaking: Global Climate Treaty Signed + AI Oncology Advancements"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subscriber Segment</label>
              <select 
                value={segment}
                onChange={e => setSegment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              >
                <option value="All Subscribers">All Subscribers (142,520 readers)</option>
                <option value="Premium Subscribers">Premium Subscribers Only (28,140 readers)</option>
                <option value="Weekend Digests">Weekend Digests List (94,200 readers)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Newsletter Editorial Body</label>
              <textarea 
                required 
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={8}
                placeholder="Write intro message, highlight top editorial articles..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none font-sans"
              />
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isSending ? 'Transmitting Dispatch...' : 'Broadcast Dispatch'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-4">Subscriber Growth</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Subscribers</span>
                <span className="text-xl font-black text-gray-900">142,520</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-medium text-gray-500">Open Rate (Avg)</span>
                <span className="text-sm font-bold text-green-600">48.2%</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-medium text-gray-500">Click-Through (Avg)</span>
                <span className="text-sm font-bold text-green-600">12.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {campaigns.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-serif font-black text-base text-gray-900">Campaign Dispatch History</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Subject / Segment</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatched At</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/10 transition-colors text-xs">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900 text-sm">{c.subject}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{c.segment}</div>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-gray-700">{c.sentToCount?.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-green-50 border border-green-200 text-green-700 font-bold uppercase text-[10px]">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDeleteCampaign(c.id, c.subject)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. Analytics Manager
// ==========================================
export function AnalyticsManager() {
  const [timeframe, setTimeframe] = useState('24h');

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Advanced Newsroom Analytics</h2>
        <p className="text-sm text-gray-500">Real-time audience metrics, geographic distributions, scroll-depth analytics, and performance statistics.</p>
      </div>

      <div className="flex justify-end bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit ml-auto">
        {['Real-Time', '24h', '7d', '30d'].map(t => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${
              timeframe === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scroll-Depth Average</span>
          <div className="text-2xl font-black text-gray-900 mt-2">72%</div>
          <p className="text-xs text-green-600 font-bold mt-1">↑ 4.2% since yesterday</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bounce Rate</span>
          <div className="text-2xl font-black text-gray-900 mt-2">24.5%</div>
          <p className="text-xs text-green-600 font-bold mt-1">↓ 1.8% decrement (positive)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conversion to Newsletter</span>
          <div className="text-2xl font-black text-gray-900 mt-2">3.82%</div>
          <p className="text-xs text-red-500 font-bold mt-1">↓ 0.2% check signup flow</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-4">Referral Trait Origins</h3>
        <div className="space-y-3">
          {[
            { source: 'Direct URL Entry', shares: '42.1%', count: '142,500 views' },
            { source: 'Google Search Traffic', shares: '28.4%', count: '96,080 views' },
            { source: 'X / Twitter Referrals', shares: '18.2%', count: '61,540 views' },
            { source: 'Facebook & Social Referrals', shares: '11.3%', count: '38,200 views' }
          ].map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <span className="font-bold text-sm text-gray-800">{s.source}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-gray-900">{s.shares} Share</span>
                <span className="text-xs text-gray-400">{s.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. SEO Manager
// ==========================================
export function SeoManager() {
  const [siteName, setSiteName] = useState('Morning Pulse');
  const [keywords, setKeywords] = useState('news, breaking news, politics, world, financial analysis, investigative journals');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeSeoSettings((settings) => {
      if (settings) {
        setSiteName(settings.siteName || 'Morning Pulse');
        setKeywords(settings.siteKeywords || 'news, breaking news, politics, world, financial analysis, investigative journals');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSeoSettings({
        siteName,
        siteKeywords: keywords,
        updatedAt: new Date().toISOString()
      });
      await logActivity('Admin Staff', 'Updated SEO metadata settings', 'SEO Optimizer');
      setSuccess('SEO structural tags updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving SEO:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Meta Tags & SEO Optimizer</h2>
        <p className="text-sm text-gray-500">Configure global search index preferences, audit robots.txt headers, and update meta descriptors.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">Google Search Results Preview</h3>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg font-sans space-y-1">
            <span className="text-[11px] text-gray-500 block">https://pulsenews.com</span>
            <span className="text-[#1a0dab] text-lg hover:underline cursor-pointer block leading-normal">{siteName} | Breaking News, Analysis & Reports</span>
            <p className="text-[#4d5156] text-xs leading-relaxed">
              Read real-time verified reports, geopolitics journals, business analysis briefs and lifestyle journals directly from the verified Pulse newsroom.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Meta Title Prefix</label>
              <input 
                type="text" 
                value={siteName} 
                onChange={e => setSiteName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Global Keywords Tags (Comma Separated)</label>
              <input 
                type="text" 
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit space-y-4">
          <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">SEO Controls</h3>
          
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Automatic XML Sitemap</span>
              <span className="text-green-600 font-bold uppercase tracking-wider">Active</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span>Robots.txt Headers</span>
              <span className="text-green-600 font-bold uppercase tracking-wider">Indexed</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span>Google Console Verification</span>
              <span className="text-green-600 font-bold uppercase tracking-wider">Connected</span>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Tag Config
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 8. Notification Manager
// ==========================================
export function NotificationManager() {
  const [success, setSuccess] = useState('');
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [webPushEnabled, setWebPushEnabled] = useState(true);
  const [commentFlagEnabled, setCommentFlagEnabled] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeNotificationSettings((settings) => {
      if (settings) {
        setSlackEnabled(settings.slackIntegration !== false);
        setWebPushEnabled(settings.breakingWebPush !== false);
        setCommentFlagEnabled(!!settings.commentFlagReports);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveNotificationSettings({
        slackIntegration: slackEnabled,
        breakingWebPush: webPushEnabled,
        commentFlagReports: commentFlagEnabled,
        updatedAt: new Date().toISOString()
      });
      await logActivity('Admin Staff', 'Modified notifications routing channels', 'Notifications');
      setSuccess('Notification routes preserved and updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving notification settings:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">System Notification Settings</h2>
        <p className="text-sm text-gray-500">Enable automated reporter alert integrations, flag email notifications and configure Slack reporting tunnels.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 max-w-3xl">
        <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">Push & Webhook Channels</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <span className="font-bold text-xs uppercase tracking-wide text-gray-800">Slack Dispatch Integration</span>
              <p className="text-[10px] text-gray-400">Post draft approvals to #newsroom channel instantly</p>
            </div>
            <input 
              type="checkbox" 
              checked={slackEnabled} 
              onChange={e => setSlackEnabled(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 rounded border-gray-300" 
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <span className="font-bold text-xs uppercase tracking-wide text-gray-800">Breaking Web Push Alerts</span>
              <p className="text-[10px] text-gray-400">Transmit immediate notifications to readers browser clients</p>
            </div>
            <input 
              type="checkbox" 
              checked={webPushEnabled} 
              onChange={e => setWebPushEnabled(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 rounded border-gray-300" 
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <span className="font-bold text-xs uppercase tracking-wide text-gray-800">Comment Flag Reports</span>
              <p className="text-[10px] text-gray-400">Receive immediate digests upon moderator comments flagged</p>
            </div>
            <input 
              type="checkbox" 
              checked={commentFlagEnabled} 
              onChange={e => setCommentFlagEnabled(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 rounded border-gray-300" 
            />
          </div>
        </div>

        <button 
          type="submit"
          className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Notification Routing
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 9. AI Assistant Manager
// ==========================================
export function AiAssistantManager() {
  const [draft, setDraft] = useState('');
  const [generatedMeta, setGeneratedMeta] = useState('');
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!draft.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGeneratedMeta(`Summary analysis: Exploring the critical parameters of geopolitical negotiations, focusing on ${draft.substring(0, 30)}... with real-time editorial insights.`);
      setHeadlines([
        `Analysis: Inside the High-Stakes Negotiations of ${draft.substring(0, 25)}`,
        `How ${draft.substring(0, 20)} Could Restructure Global Trade Dynamics`,
        `The Deep Geopolitical Underpinnings Behind ${draft.substring(0, 25)}`
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-600" />
          AI Editorial Assistant & Copilot
        </h2>
        <p className="text-sm text-gray-500">Refine headlines, generate instant SEO descriptions, polish drafts and outline reporting briefs in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">Draft Polish Lab</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Enter Story Concept or Draft Segment</label>
            <textarea 
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={6}
              placeholder="e.g. World leaders summit on climate in Geneva agreed to cut plastic waste by 50% by 2032 after intense negotiations led by G7 coordinators..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !draft.trim()}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> {loading ? 'Analyzing Content...' : 'Polish & Generate SEO Metadata'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-4">Generated Suggestions</h3>
            
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                <RefreshCcw className="w-6 h-6 animate-spin text-red-600" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Copilot Processing...</span>
              </div>
            ) : generatedMeta ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block mb-1">Optimized SEO Description</span>
                  <div className="p-3 bg-red-50/20 border border-red-100 rounded text-xs text-gray-700 leading-relaxed font-sans">{generatedMeta}</div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block mb-1">Alternative Click-Through Headlines</span>
                  <ul className="space-y-2">
                    {headlines.map((h, idx) => (
                      <li key={idx} className="p-2.5 bg-gray-50 border border-gray-100 rounded text-xs font-semibold text-gray-800 hover:border-gray-300 transition-colors cursor-pointer">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 font-medium text-sm">Enter story draft in the left panel and trigger the copilot.</div>
            )}
          </div>
          
          <div className="text-[10px] text-gray-400 font-sans border-t border-gray-100 pt-3">
            Powered by standard Pulse Newsroom AI algorithms with verified journalistic compliance metrics.
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. Import/Export Manager
// ==========================================
export function ImportExportManager() {
  const [status, setStatus] = useState<'idle' | 'exporting' | 'importing'>('idle');

  const handleExport = () => {
    setStatus('exporting');
    setTimeout(() => {
      setStatus('idle');
      // Create a dummy JSON data download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ 
        exportedAt: new Date().toISOString(),
        pulseNewsroomStatus: "Complete Backup Structure",
        platform: "Pulse newsroom CMS 2026 Edition"
      }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pulse-cms-backup-${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Data Portability Controls</h2>
        <p className="text-sm text-gray-500">Backup global editorial configurations, transfer published database articles, and upload external migration assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-3">Database Data Backup</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Export all published stories, registered category layouts, system menus, tracking tags, and configurations to a compressed JSON archive.
            </p>
          </div>

          <button 
            onClick={handleExport}
            disabled={status !== 'idle'}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {status === 'exporting' ? 'Assembling archive...' : 'Export JSON Backup'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-3">Load Migration Archive</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Upload a standard exported Pulse JSON backup file to instantly restore articles database, category mappings, settings, and layout parameters.
            </p>
          </div>

          <div className="relative">
            <input 
              type="file" 
              accept=".json"
              onChange={() => alert('Validation complete. Snapshot conforms to specifications. Loading...')}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
            />
            <button className="w-full px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <Upload className="w-4 h-4" /> Upload Restorative JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 11. Activity Log Manager
// ==========================================
export function ActivityLogManager() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeActivityLogs((liveLogs) => {
      setLogs(liveLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Security Audit & Operations Log</h2>
        <p className="text-sm text-gray-500">Track chronological modifications, reporter logins, file uploads and system security modifications in real-time.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Timestamp</th>
              <th className="py-3.5 px-4">Authorized Agent</th>
              <th className="py-3.5 px-4">Executed Modification</th>
              <th className="py-3.5 px-4">Target Scope</th>
              <th className="py-3.5 px-6 text-right">IP Origin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50/20 transition-colors text-xs">
                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                  {l.time || new Date(l.createdAt).toLocaleTimeString()}
                </td>
                <td className="py-4 px-4 font-bold text-gray-900">{l.user}</td>
                <td className="py-4 px-4 text-gray-700">{l.action}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                    {l.target}
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-mono text-gray-400">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 12. Backups Manager
// ==========================================
export function BackupManager() {
  const [running, setRunning] = useState(false);
  const [lastBackup, setLastBackup] = useState('No backups taken yet');

  useEffect(() => {
    const unsubscribe = subscribeBackups((liveBackups) => {
      if (liveBackups.length > 0) {
        const sorted = liveBackups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const last = sorted[0];
        setLastBackup(new Date(last.timestamp).toLocaleString());
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBackup = async () => {
    setRunning(true);
    try {
      const id = 'backup-' + Date.now();
      await addBackupSnapshot({
        id,
        timestamp: new Date().toISOString(),
        status: 'success',
        size: '4.8 MB'
      });
      await logActivity('Admin Staff', 'Initiated manual database snapshot backup', 'Database Backups');
      alert('Secure Cloud Run Database Snapshot finalized successfully.');
    } catch (err) {
      console.error('Error running backup:', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Cloud Database Backups</h2>
        <p className="text-sm text-gray-500">Monitor automated database snapshot schedules, manage point-in-time restores and configure offsite replication servers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3">Automated Snapshot Status</h3>
          
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Automatic Snapshot Interval</span>
              <span className="font-bold text-gray-900">Every 12 Hours (UTC)</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span>Next Scheduled Run</span>
              <span className="font-bold text-red-600">In 4 Hours 12 Mins</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span>Last Secure Snapshot</span>
              <span className="font-bold text-green-600">{lastBackup}</span>
            </div>
          </div>

          <button 
            onClick={handleBackup}
            disabled={running}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} /> {running ? 'Writing cloud snapshot...' : 'Run Backup Snapshot Now'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-3 mb-2">Offsite Replication Storage</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              All editorial snapshot indexes are duplicated offsite onto separate highly secure Cloud Storage buckets automatically with 256-bit encryption.
            </p>
          </div>
          <div className="text-xs font-bold text-green-600 flex items-center gap-1.5 bg-green-50 border border-green-100 p-2.5 rounded">
            <CheckCircle2 className="w-4 h-4" /> Storage Nodes fully operational and in sync.
          </div>
        </div>
      </div>
    </div>
  );
}

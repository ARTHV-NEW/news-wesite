import React, { useState, useEffect } from 'react';
import { Trash2, Shield, ShieldCheck, Mail, Calendar, User, Clock, Settings } from 'lucide-react';
import { 
  subscribeReaders, 
  updateReaderUser, 
  deleteReaderUser, 
  ReaderUser, 
  subscribeDailyDigestSubscribers, 
  deleteDailyDigestSubscriber 
} from '../../services/db';
import { DailyDigestSubscriber } from '../../types';

export default function ReaderManager() {
  const [readers, setReaders] = useState<ReaderUser[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'digest'>('users');
  const [digestSubscribers, setDigestSubscribers] = useState<DailyDigestSubscriber[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeReaders((liveReaders) => {
      setReaders(liveReaders);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeDailyDigestSubscribers((liveSubscribers) => {
      setDigestSubscribers(liveSubscribers);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleAdmin = async (reader: ReaderUser) => {
    const nextVal = !reader.isAdmin;
    const confirmMsg = nextVal 
      ? `Are you sure you want to promote ${reader.firstName} ${reader.lastName} to Administrator? They will gain full CMS controls.`
      : `Are you sure you want to revoke Admin rights for ${reader.firstName} ${reader.lastName}?`;

    if (window.confirm(confirmMsg)) {
      try {
        await updateReaderUser(reader.id, { isAdmin: nextVal });
      } catch (err) {
        console.error('Error changing admin role:', err);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user account? This removes all active profile properties.')) {
      try {
        await deleteReaderUser(userId);
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleDeleteDigestSubscriber = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently cancel this reader\'s Daily Digest subscription?')) {
      try {
        await deleteDailyDigestSubscriber(id);
      } catch (err) {
        console.error('Error deleting subscriber:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Readers &amp; Audience Control Deck</h2>
          <p className="text-sm text-gray-500">Monitor premium platform registrants and customize summarized headline subscription preferences.</p>
        </div>
      </div>

      {/* Modern Segmented Tab Buttons */}
      <div className="flex border-b border-gray-100 gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'users' 
              ? 'border-[#ef3a3e] text-[#ef3a3e]' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Premium Registrants ({readers.length})
        </button>
        <button
          onClick={() => setActiveTab('digest')}
          className={`pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'digest' 
              ? 'border-[#ef3a3e] text-[#ef3a3e]' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Daily Digest Subscribers ({digestSubscribers.length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Reader Name / Avatar</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Bio Summary</th>
                  <th className="py-3.5 px-4">CMS Role Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {readers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">No readers or users are registered on the platform yet.</td>
                  </tr>
                ) : (
                  readers.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {r.avatarUrl ? (
                            <img src={r.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900">{r.firstName} {r.lastName}</div>
                            <div className="text-[10px] text-gray-400">ID: {r.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {r.email}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 max-w-xs truncate">
                        {r.bio || <span className="italic text-gray-300">No biography provided</span>}
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => handleToggleAdmin(r)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full border transition-colors cursor-pointer ${
                            r.isAdmin 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={r.isAdmin ? "Revoke administrator permissions" : "Grant administrator permissions"}
                        >
                          {r.isAdmin ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Staff Admin
                            </>
                          ) : (
                            <>
                              <Shield className="w-3.5 h-3.5 text-gray-400" /> Reader User
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDeleteUser(r.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Subscriber Node</th>
                  <th className="py-3.5 px-4">Target desks</th>
                  <th className="py-3.5 px-4">Delivery time</th>
                  <th className="py-3.5 px-4">Format spec</th>
                  <th className="py-3.5 px-4">Created date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {digestSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">No readers are currently registered for the Daily Digest headline delivery.</td>
                  </tr>
                ) : (
                  digestSubscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                            <Mail className="w-4 h-4 text-[#ef3a3e]" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{sub.email}</div>
                            <div className="text-[10px] text-gray-400">ID: {sub.id.substring(0, 16)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-gray-600">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {sub.categories.map(c => (
                            <span 
                              key={c} 
                              className="px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase font-black rounded bg-gray-100 text-gray-700 border border-gray-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-gray-700">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {sub.deliveryTime} AM
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {sub.format}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDeleteDigestSubscriber(sub.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="Cancel Daily Digest Subscription"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Trash2, Shield, ShieldCheck, Mail, Calendar, User } from 'lucide-react';
import { subscribeReaders, updateReaderUser, deleteReaderUser, ReaderUser } from '../../services/db';

export default function ReaderManager() {
  const [readers, setReaders] = useState<ReaderUser[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeReaders((liveReaders) => {
      setReaders(liveReaders);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">Registered Readers Deck</h2>
          <p className="text-sm text-gray-500">Manage reader users, promote administrator staff and control permissions.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
      </div>
    </div>
  );
}

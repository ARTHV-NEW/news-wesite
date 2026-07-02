import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import AdminLayout from './components/admin/AdminLayout';
import { Lock } from 'lucide-react';

export default function AdminApp() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // If a non-admin user logs in or is already logged in, log them out automatically
    if (!authLoading && user && profile && !profile.isAdmin) {
      setError("Unauthorized access. This account does not have admin privileges.");
      logout();
    }
  }, [user, profile, authLoading, logout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">Loading...</div>;
  }

  if (user && profile?.isAdmin) {
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#c8232c] text-white flex items-center justify-center rounded-xl shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight font-serif">
          Pulse Editorial
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium uppercase tracking-wider">
          Newsroom CMS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                {success}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8232c] focus:border-[#c8232c] text-sm transition-shadow"
                  placeholder="admin@pulsenews.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8232c] focus:border-[#c8232c] text-sm transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#c8232c] hover:bg-[#a01c23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8232c] transition-colors disabled:opacity-50 uppercase tracking-wider"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors uppercase tracking-wider"
              >
                Back to Homepage
              </button>


            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

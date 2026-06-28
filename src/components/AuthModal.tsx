import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { reloadProfile } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });
        
        // Save user profile in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName,
          lastName,
          email,
          createdAt: new Date().toISOString()
        });

        await sendEmailVerification(userCredential.user);
        setMessage('Registration successful! Please check your email for verification.');
        await reloadProfile();
        // Option to close on success:
        // onClose();
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        await reloadProfile();
        onClose();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-md w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="font-serif text-3xl font-black mb-2 tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <p className="text-sm text-gray-500 mb-8 font-sans">
            {mode === 'login' && 'Sign in to access your saved articles and personalized content.'}
            {mode === 'register' && 'Join The Pulse Journal for premium journalism and features.'}
            {mode === 'reset' && 'Enter your email to receive a password reset link.'}
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>

            {mode !== 'reset' && (
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-[#c8232c] transition-colors disabled:opacity-70"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-500 font-sans">
            {mode === 'login' && (
              <>
                <button type="button" onClick={() => { setMode('reset'); setError(''); setMessage(''); }} className="hover:text-black underline mr-4">Forgot Password?</button>
                <span>Don't have an account? <button type="button" onClick={() => { setMode('register'); setError(''); setMessage(''); }} className="text-black font-bold hover:underline">Sign up</button></span>
              </>
            )}
            {mode === 'register' && (
              <span>Already have an account? <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="text-black font-bold hover:underline">Sign in</button></span>
            )}
            {mode === 'reset' && (
              <span>Remembered? <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="text-black font-bold hover:underline">Back to Sign in</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

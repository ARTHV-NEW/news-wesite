import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';

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
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            firstName,
            lastName,
            email,
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${userCredential.user.uid}`);
        }

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

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Save or update user profile in Firestore
      try {
        const userDoc = doc(db, 'users', result.user.uid);
        const nameParts = result.user.displayName ? result.user.displayName.split(' ') : ['User'];
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        await setDoc(userDoc, {
          firstName,
          lastName,
          email: result.user.email,
          avatarUrl: result.user.photoURL,
          createdAt: new Date().toISOString()
        }, { merge: true }); // Use merge to not overwrite existing bio
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${result.user.uid}`);
      }

      await reloadProfile();
      onClose();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'An error occurred during Google sign in.');
      }
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

          {mode !== 'reset' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-sans">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-none bg-white hover:bg-gray-50 transition-colors disabled:opacity-70 font-sans text-sm font-medium text-gray-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          )}

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

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  User, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface UserProfile {
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  reloadProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const reloadProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, reloadProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

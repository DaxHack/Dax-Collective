// dax-main/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from '../config/firebase';

let getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut;
try {
  const firebaseAuth = require('firebase/auth');
  getAuth = firebaseAuth.getAuth;
  onAuthStateChanged = firebaseAuth.onAuthStateChanged;
  signInWithPopup = firebaseAuth.signInWithPopup;
  GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
  signOut = firebaseAuth.signOut;
} catch (e) {
  console.warn('Firebase auth not available');
}

const AuthContext = createContext({ 
  user: null, 
  loading: false,
  signIn: () => Promise.resolve(null),
  signOut: () => Promise.resolve()
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth || !onAuthStateChanged) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !signInWithPopup || !GoogleAuthProvider) {
      console.warn('Firebase auth not configured');
      return null;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    if (!auth || !signOut) {
      console.warn('Firebase auth not configured');
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn: signInWithGoogle,
    signOut: signOutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

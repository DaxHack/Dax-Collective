// src/components/SignInButton.jsx
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { UserIcon } from '@heroicons/react/24/outline';

const SignInButton = ({ className = '', size = 'md', variant = 'primary' }) => {
  const handleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      // Add scopes for Google Drive access if needed
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
      // You might want to show a toast notification here
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      onClick={handleSignIn}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <UserIcon className="w-5 h-5 mr-2" />
      Sign In with Google
    </button>
  );
};

export default SignInButton;

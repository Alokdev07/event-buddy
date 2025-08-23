// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Google Login Success
  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    // Redirect to dashboard or home page
    navigate('/dashboard'); // or wherever you want to redirect after login
  };

  // Handle Google Login Error
  const handleLoginError = (error) => {
    console.error('Login error:', error);
    setIsLoading(false);
  };

  // Handle back to home
  const handleBack = () => {
    navigate('/'); // Navigate back to home page
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Yellow Section */}
      <div className="flex-1 bg-gradient-to-br from-yellow-400 to-yellow-500 relative overflow-hidden">
        {/* Bizzabo Logo */}
        <div className="absolute top-8 left-8">
          <button 
            onClick={handleBack}
            className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <span className="text-yellow-400 font-bold text-lg rotate-180">B</span>
          </button>
        </div>
        
        {/* Decorative Curve */}
        <div className="absolute bottom-0 left-0 w-full h-full flex items-center justify-center">
          <svg 
            width="300" 
            height="400" 
            viewBox="0 0 300 400" 
            className="opacity-20"
          >
            <path
              d="M50 350 Q150 50 250 350"
              stroke="black"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50 relative">
        {/* Close Button */}
        <button
          onClick={handleBack}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to EventBuddy
            </h1>
            <p className="text-gray-600 mb-2">
              We're happy to have you here.
            </p>
            <p className="text-gray-600">
              Sign in to get started.
            </p>
          </div>

          {/* Google Login Button */}
          <div className="mb-8">
            <GoogleLoginButton 
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Need Help?{' '}
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

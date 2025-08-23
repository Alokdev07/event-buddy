// src/components/HeroSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleRequestDemo = () => {
    navigate('/demo');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Top Label */}
        <div className="mb-8">
          <span className="text-gray-800 text-lg font-medium">
            The  EventBuddy Experience OS
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-8">
          Modern event tech,{' '}
          <br className="hidden sm:block" />
          without the legacy baggage
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 max-w-3xl mx-auto mb-12 leading-relaxed">
          evetBuddy helps B2B event leaders run smooth, connected experiences. 
          Learn why teams are switching.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleRequestDemo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Request a Demo
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

// src/components/ProductSuite.js
import React, { useState, useEffect } from 'react';

const ProductSuite = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('product-suite');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const products = [
    {
      title: "Event Registration",
      description: "Customize registration flows for events of any size or scope with advanced form builders and payment integration.",
      icon: "📝",
      color: "from-blue-500 to-cyan-500",
      accent: "blue"
    },
    {
      title: "Website and Agenda Editor", 
      description: "Create dynamic event websites and multi-track agendas in minutes with our drag-and-drop builder.",
      icon: "🌐",
      color: "from-purple-500 to-pink-500",
      accent: "purple"
    },
    {
      title: "Mobile Event App",
      description: "Boost engagement with push notifications and AI-powered event solutions for seamless mobile experiences.",
      icon: "📱",
      color: "from-green-500 to-emerald-500",
      accent: "green"
    },
    {
      title: "Event Networking",
      description: "Connect attendees using smart matchmaking and real-time data from Klik wearable tech for meaningful interactions.",
      icon: "🤝",
      color: "from-orange-500 to-red-500",
      accent: "orange"
    },
    {
      title: "Email and Marketing Management",
      description: "Manage registrations, reminders, and post-event follow-up with built-in automation and analytics.",
      icon: "📧",
      color: "from-indigo-500 to-blue-500",
      accent: "indigo"
    },
    {
      title: "Sponsor, Exhibitor, and Speaker Management",
      description: "Simplify onboarding, promotion, and in-event performance tracking with comprehensive management tools.",
      icon: "🎤",
      color: "from-pink-500 to-rose-500",
      accent: "pink"
    },
    {
      title: "Video, Broadcasting, and Streaming",
      description: "Deliver webinar content, high-quality live streams, and hybrid sessions at scale with enterprise-grade infrastructure.",
      icon: "📹",
      color: "from-teal-500 to-cyan-500",
      accent: "teal"
    },
    {
      title: "Klik SmartBadges™",
      description: "Capture rich attendee data, enable contactless lead retrieval, and spark meaningful interactions with NFC technology.",
      icon: "🏷️",
      color: "from-yellow-500 to-orange-500",
      accent: "yellow"
    },
    {
      title: "Professional Services",
      description: "Access creative, production, and onsite execution support from our team of event experts and consultants.",
      icon: "👥",
      color: "from-violet-500 to-purple-500",
      accent: "violet"
    }
  ];

  const handleStartEvent = () => {
    window.location.href = '/Events';
  };

  const getAccentClasses = (accent) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      purple: 'border-purple-200 bg-purple-50',
      green: 'border-green-200 bg-green-50',
      orange: 'border-orange-200 bg-orange-50',
      indigo: 'border-indigo-200 bg-indigo-50',
      pink: 'border-pink-200 bg-pink-50',
      teal: 'border-teal-200 bg-teal-50',
      yellow: 'border-yellow-200 bg-yellow-50',
      violet: 'border-violet-200 bg-violet-50',
    };
    return colors[accent] || colors.blue;
  };

  return (
    <section id="product-suite" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 font-medium text-sm mb-6 shadow-sm">
            <span className="mr-2">✨</span>
            Bizzabo Product Suite
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 max-w-5xl mx-auto leading-tight mb-6">
            Get to know the{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Event Experience
            </span>{' '}
            Operating System
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools designed to create, manage, and optimize unforgettable event experiences
          </p>
        </div>

        {/* Enhanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {products.map((product, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 cursor-pointer border border-white/50 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${
                hoveredCard === index 
                  ? 'transform scale-105 shadow-2xl shadow-blue-500/10 -translate-y-2' 
                  : hoveredCard !== null 
                  ? 'transform scale-95 opacity-70' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                background: hoveredCard === index 
                  ? `linear-gradient(135deg, white 0%, ${product.accent === 'blue' ? '#eff6ff' : 
                     product.accent === 'purple' ? '#faf5ff' : 
                     product.accent === 'green' ? '#f0fdf4' : 
                     product.accent === 'orange' ? '#fff7ed' : 
                     product.accent === 'indigo' ? '#eef2ff' : 
                     product.accent === 'pink' ? '#fdf2f8' : 
                     product.accent === 'teal' ? '#f0fdfa' : 
                     product.accent === 'yellow' ? '#fffbeb' : '#faf5ff'} 100%)` 
                  : undefined 
              }}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${product.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}></div>
              
              {/* Icon */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${product.color} flex items-center justify-center text-2xl mb-6 shadow-lg transform transition-all duration-500 ${
                hoveredCard === index ? 'scale-110 rotate-6' : 'group-hover:scale-105'
              }`}>
                {product.icon}
              </div>

              {/* Content */}
              <div className="relative">
                {/* Title - Always visible */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {product.title}
                </h3>

                {/* Description - Enhanced reveal animation */}
                <div className={`overflow-hidden transition-all duration-500 ease-out ${
                  hoveredCard === index 
                    ? 'max-h-40 opacity-100 transform translate-y-0' 
                    : 'max-h-0 opacity-0 transform translate-y-4'
                }`}>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Enhanced Arrow with Learn More */}
                <div className={`flex items-center justify-between transition-all duration-500 ${
                  hoveredCard === index 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    Learn more
                  </span>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${product.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M7 17L17 7M17 7H7M17 7V17" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Call-to-Action Section */}
        <div className={`transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative text-center py-16 px-8 bg-gradient-to-r from-white via-blue-50/50 to-purple-50/50 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5"></div>
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Floating Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 font-medium text-sm mb-6 shadow-sm border border-green-200/50">
                <span className="mr-2">🚀</span>
                Ready to get started?
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Ready to Create{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Amazing Events
                </span>?
              </h3>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Discover and join exciting events in your area. Connect with like-minded people and create unforgettable memories.
              </p>
              
              {/* Enhanced Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStartEvent}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 overflow-hidden"
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center">
                    <svg 
                      className="w-5 h-5 mr-3 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2.5} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                    Start Exploring Events
                  </div>
                </button>

                {/* Secondary Action */}
                <button className="text-gray-600 hover:text-gray-800 font-medium text-lg transition-colors duration-200 flex items-center group">
                  <span className="mr-2">Learn more about features</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-sm">
                <span className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free to join
                </span>
                <span className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Instant access
                </span>
                <span className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1000+ events monthly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSuite;

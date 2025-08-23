// src/components/ProductSuite.js
import React, { useState } from 'react';

const ProductSuite = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    {
      title: "Event Registration",
      description: "Customize registration flows for events of any size or scope.",
    },
    {
      title: "Website and Agenda Editor", 
      description: "Create dynamic event websites and multi-track agendas in minutes.",
    },
    {
      title: "Mobile Event App",
      description: "Boost engagement with push notifications and AI-powered event solutions.",
    },
    {
      title: "Event Networking",
      description: "Connect attendees using smart matchmaking and real-time data from Klik wearable tech.",
    },
    {
      title: "Email and Marketing Management",
      description: "Manage registrations, reminders, and post-event follow-up with built-in automation.",
    },
    {
      title: "Sponsor, Exhibitor, and Speaker Management",
      description: "Simplify onboarding, promotion, and in-event performance tracking.",
    },
    {
      title: "Video, Broadcasting, and Streaming",
      description: "Deliver webinar content, high-quality live streams, and hybrid sessions at scale.",
    },
    {
      title: "Klik SmartBadges™",
      description: "Capture rich attendee data, enable contactless lead retrieval, and spark meaningful interactions.",
    },
    {
      title: "Professional Services",
      description: "Access creative, production, and onsite execution support.",
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-600 text-lg mb-4">Bizzabo Product Suite</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
            Get to know the Event Experience Operating System
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                hoveredCard === index 
                  ? 'transform scale-105 shadow-xl' 
                  : hoveredCard !== null 
                  ? 'transform scale-95 opacity-80' 
                  : 'shadow-md hover:shadow-lg'
              }`}
            >
              {/* Title - Always visible */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {product.title}
              </h3>

              {/* Description - Shows on hover */}
              <div className={`transition-all duration-300 ${
                hoveredCard === index 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-4 pointer-events-none'
              }`}>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Arrow - Shows on hover */}
              <div className={`flex justify-end mt-4 transition-all duration-300 ${
                hoveredCard === index 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-4'
              }`}>
                <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                    <path 
                      d="M7 17L17 7M17 7H7M17 7V17" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSuite;

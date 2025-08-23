"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle, 
  Star,
  Music,
  Camera,
  Utensils,
  Trophy,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Fixed ICS Calendar Generator Function
const generateICS = (eventDetails) => {
  try {
    // Parse the date and time properly
    const eventDate = new Date(eventDetails.date + 'T00:00:00');
    const startTimeStr = eventDetails.time.split(' - ')[0];
    const endTimeStr = eventDetails.time.split(' - ')[18];
    
    // Create proper datetime objects
    const [startHour, startMinute] = startTimeStr.includes('PM') && !startTimeStr.includes('12:') 
      ? [parseInt(startTimeStr.split(':')[0]) + 12, parseInt(startTimeStr.split(':')[18])]
      : [parseInt(startTimeStr.split(':')), parseInt(startTimeStr.split(':')[18])];
    
    const [endHour, endMinute] = endTimeStr.includes('PM') && !endTimeStr.includes('12:')
      ? [parseInt(endTimeStr.split(':')[0]) + 12, parseInt(endTimeStr.split(':')[18])]
      : [parseInt(endTimeStr.split(':')), parseInt(endTimeStr.split(':')[18])];
    
    const startDate = new Date(eventDate);
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(eventDate);
    endDate.setHours(endHour, endMinute, 0, 0);

    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Event Buddy//Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@eventbuddy.com`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description || 'Join us for an amazing cultural experience!'}`,
      `LOCATION:${eventDetails.location}, ${eventDetails.address}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Event reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    return icsContent;
  } catch (error) {
    console.error('Error generating ICS:', error);
    return null;
  }
};

// Add to Calendar Function
const addToCalendar = (eventDetails) => {
  const icsContent = generateICS(eventDetails);
  if (!icsContent) {
    alert('Error generating calendar event. Please try again.');
    return;
  }
  
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${eventDetails.title.replace(/\s+/g, '_')}_event.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// Confetti Component
const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981', '#F59E0B'];
    const newParticles = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        speedY: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
      });
    }

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y + particle.speedY,
        x: particle.x + particle.speedX,
        rotation: particle.rotation + 2,
      })).filter(particle => particle.y < (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50));
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// Fixed Countdown Timer Component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        // Parse the target date more carefully
        const targetDateTime = new Date(targetDate);
        const now = new Date();
        const difference = targetDateTime.getTime() - now.getTime();

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } catch (error) {
        console.error('Error calculating countdown:', error);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
      ].map((item, index) => (
        <motion.div
          key={item.label}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 text-center border border-white/30"
          whileHover={{ scale: 1.05 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div 
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1"
            key={item.value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {item.value.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-xs sm:text-sm text-white/80 font-medium">{item.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Simplified Schedule Updates Component
const ScheduleUpdates = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
          <span className="hidden sm:inline">Schedule Updates</span>
          <span className="sm:hidden">Schedule</span>
        </h3>
        
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg border border-white/30 text-white text-sm hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </motion.button>
      </div>
      
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - show coming soon message
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Clock className="h-8 w-8 text-white" />
            </motion.div>
            <h4 className="text-white font-semibold text-lg mb-2">More Events Coming Soon!</h4>
            <p className="text-white/80 text-sm">Stay tuned for exciting schedule updates</p>
          </motion.div>
        ) : (
          // Expanded state - show detailed message
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Exciting Updates on the Way!</h4>
              <p className="text-white/80 text-sm mb-4 max-w-sm mx-auto">
                Our team is working hard to bring you more amazing activities, performances, and experiences. 
                Check back soon for the full schedule!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Live Music', 'Food Stalls', 'Art Shows', 'Workshops'].map((activity, index) => (
                  <span 
                    key={activity}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// QR Code Share Component
const QRCodeShare = ({ eventDetails, isVisible, onClose }) => {
  const eventUrl = `https://eventbuddy.com/event/${eventDetails.title.toLowerCase().replace(/\s+/g, '-')}`;

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventDetails.title,
          text: eventDetails.description,
          url: eventUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(eventUrl).then(() => {
        alert('Event link copied to clipboard!');
      });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Share Event</h3>
          
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-4">
            <QRCode 
              value={eventUrl} 
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Scan this QR code or use the buttons below to share the event
          </p>
          
          <div className="space-y-3">
            <button
              onClick={shareEvent}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Share Event Link
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Event Success Page Component
const EventSuccessPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const eventDetails = {
    title: "Cultural Fest 2025",
    date: "2025-09-20",
    time: "10:00 AM - 10:00 PM",
    location: "Grand City Convention Center",
    address: "123 Festival Avenue, San Francisco, CA 94102",
    attendees: 2500,
    categories: ["Music", "Art", "Food", "Culture", "Entertainment"],
    description: "Join us for an amazing cultural experience with music, art, food, and celebrations.",
    organizer: {
      name: "Cultural Arts Foundation",
      email: "info@culturalarts.org",
      phone: "+1 (555) 987-6543",
      website: "www.culturalarts.org"
    }
  };

  // Create a proper target date for countdown
  const targetDateTime = `${eventDetails.date}T10:00:00`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgNi0xMC02IDEweiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative pt-8 sm:pt-16 pb-4 sm:pb-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Success Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8 backdrop-blur-sm"
          >
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">Registration Successful!</span>
          </motion.div>

          {/* Festival Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8 relative"
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Music className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </div>
            
            {/* Floating Icons */}
            {[
              { icon: <Star className="h-3 w-3 sm:h-4 sm:w-4" />, delay: 1, position: "top-0 right-6 sm:right-8" },
              { icon: <Heart className="h-3 w-3 sm:h-4 sm:w-4" />, delay: 1.2, position: "top-6 sm:top-8 right-0" },
              { icon: <Camera className="h-3 w-3 sm:h-4 sm:w-4" />, delay: 1.4, position: "bottom-0 left-6 sm:left-8" },
              { icon: <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />, delay: 1.6, position: "bottom-6 sm:bottom-8 left-0" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: item.delay,
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className={cn(
                  "absolute w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm border border-white/30",
                  item.position
                )}
              >
                {item.icon}
              </motion.div>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight"
          >
            {eventDetails.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
          >
            You're all set! Get ready for an unforgettable cultural experience with music, art, food, and celebrations.
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Event Starts In:</h2>
            <CountdownTimer targetDate={targetDateTime} />
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="max-w-6xl mx-auto px-4 pb-8 sm:pb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Schedule Updates */}
          <div className="lg:col-span-1">
            <ScheduleUpdates />
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Main Event Info */}
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Event Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Date & Time</p>
                      <p className="text-white/80 text-xs sm:text-sm">
                        {new Date(eventDetails.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-cyan-400 text-xs sm:text-sm">{eventDetails.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">{eventDetails.location}</p>
                      <p className="text-white/80 text-xs sm:text-sm">{eventDetails.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Expected Attendees</p>
                      <p className="text-green-400 text-xs sm:text-sm">{eventDetails.attendees.toLocaleString()}+ people</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Categories</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {eventDetails.categories.map((category, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Event Highlights */}
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Event Highlights</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: <Music className="h-4 w-4 sm:h-5 sm:w-5" />, title: "Live Performances", desc: "Top artists & bands" },
                  { icon: <Utensils className="h-4 w-4 sm:h-5 sm:w-5" />, title: "Food Festival", desc: "International cuisine" },
                  { icon: <Camera className="h-4 w-4 sm:h-5 sm:w-5" />, title: "Art Exhibition", desc: "Local & global artists" },
                  { icon: <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />, title: "Cultural Shows", desc: "Traditional & modern" }
                ].map((highlight, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {highlight.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-xs sm:text-sm">{highlight.title}</p>
                      <p className="text-white/70 text-xs">{highlight.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Contact & Support</h3>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base break-all">{eventDetails.organizer.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">{eventDetails.organizer.phone}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">{eventDetails.organizer.website}</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20">
                <p className="text-white/80 text-xs sm:text-sm mb-3">
                  <span className="text-cyan-400 font-semibold">Note:</span> You'll receive a confirmation email with your e-ticket shortly. Save the date and get ready to celebrate!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => addToCalendar(eventDetails)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Add to Calendar
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setShowQRCode(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 border border-white/30 flex items-center justify-center gap-2 text-white font-semibold text-sm"
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Share QR</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* QR Code Share Modal */}
      <AnimatePresence>
        {showQRCode && (
          <QRCodeShare 
            eventDetails={eventDetails} 
            isVisible={showQRCode}
            onClose={() => setShowQRCode(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="text-center py-6 sm:py-8 text-white/60 text-xs sm:text-sm border-t border-white/10"
      >
        <p>© 2025 {eventDetails.organizer.name}. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default EventSuccessPage;

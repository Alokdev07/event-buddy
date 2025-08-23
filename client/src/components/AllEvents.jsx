"use client";
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Calendar, MapPin, Users, Search, X, Star, Heart, Share2, ChevronLeft, ChevronRight, Phone, Mail, Ticket, Zap, Plus, Download, Clock, CheckCircle, Music, Camera, Utensils, Trophy, Globe, ChevronUp, ChevronDown } from 'lucide-react';
import QRCode from 'react-qr-code';

// Mock UserContext
const UserContext = createContext({ user: { college: 'MIT' } });

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Router Context for navigation
const RouterContext = createContext();

const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

const RouterProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/events');
  const [eventData, setEventData] = useState(null);

  const navigate = (route, data = null) => {
    console.log('🔄 Navigating to:', route, data ? 'with data' : 'without data');
    setCurrentRoute(route);
    if (data) {
      setEventData(data);
      console.log('✅ Event data set:', data.title);
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, eventData, setEventData }}>
      {children}
    </RouterContext.Provider>
  );
};

// Fixed DirectionAwareHover Component
const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className
}) => {
  const ref = useRef(null);
  const [direction, setDirection] = useState("left");

  const handleMouseEnter = (event) => {
    if (!ref.current) return;

    const direction = getDirection(event, ref.current);
    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  const getDirection = (ev, obj) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        "w-full h-full bg-transparent rounded-2xl overflow-hidden group/card relative cursor-pointer",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          <motion.div 
            className="group-hover/card:opacity-100 opacity-0 absolute inset-0 w-full h-full bg-gradient-to-t from-gray-900/85 via-gray-800/50 to-transparent z-20 transition-opacity duration-300" 
          />
          
          <motion.div
            variants={imageVariants}
            className="h-full w-full relative bg-gray-100 dark:bg-gray-800 overflow-hidden"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img
              alt="event"
              className={cn("h-full w-full object-cover transition-transform duration-300", imageClassName)}
              width="1000"
              height="1000"
              src={imageUrl}
            />
          </motion.div>
          
          <motion.div
            variants={textVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "absolute inset-0 p-4 sm:p-6 z-30 flex flex-col justify-between text-white pointer-events-none group-hover/card:pointer-events-auto",
              childrenClassName
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Fixed animation variants
const imageVariants = {
  initial: { scale: 1 },
  exit: { scale: 1 },
  top: { scale: 1.05, y: 5 },
  bottom: { scale: 1.05, y: -5 },
  left: { scale: 1.05, x: 5 },
  right: { scale: 1.05, x: -5 },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  exit: { opacity: 0, y: 20 },
  top: { opacity: 1, y: 0 },
  bottom: { opacity: 1, y: 0 },
  left: { opacity: 1, y: 0 },
  right: { opacity: 1, y: 0 },
};

// Fixed TracingBeam Component with Better Visibility
const TracingBeam = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, [children]);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full", className)}
    >
      <div className="absolute top-0 left-4 sm:left-8 md:left-12 lg:left-16 xl:left-20 z-10 hidden md:block">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            boxShadow: scrollYProgress.get() > 0 ? "none" : "rgba(59, 130, 246, 0.5) 0px 0px 20px",
          }}
          className="ml-[27px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-300 bg-white shadow-lg"
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? "#3B82F6" : "#10B981",
              borderColor: scrollYProgress.get() > 0 ? "#3B82F6" : "#059669",
            }}
            className="h-3 w-3 rounded-full border-2 border-blue-400"
          />
        </motion.div>
        
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#E5E7EB"
            strokeOpacity="0.6"
            strokeWidth="2"
            transition={{ duration: 10 }}
          />
          
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            className="motion-reduce:hidden drop-shadow-lg"
            transition={{ duration: 10 }}
          />
          
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#60A5FA" stopOpacity="0" />
              <stop stopColor="#3B82F6" />
              <stop offset="0.4" stopColor="#8B5CF6" />
              <stop offset="0.8" stopColor="#A855F7" />
              <stop offset="1" stopColor="#EC4899" stopOpacity="0" />
            </motion.linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      
      <div ref={contentRef} className="w-full md:ml-8 lg:ml-12 xl:ml-16">
        {children}
      </div>
    </motion.div>
  );
};

// Modal Context and Components
const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState(null);

  return (
    <ModalContext.Provider value={{ open, setOpen, eventData, setEventData }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalTrigger = ({ children, className, onClick }) => {
  const { setOpen } = useModal();
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
    setOpen(true);
  };

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-center relative overflow-hidden pointer-events-auto",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({ children, className }) => {
  const { open } = useModal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const modalRef = useRef(null);
  const { setOpen } = useModal();

  useOutsideClick(modalRef, () => setOpen(false));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            backdropFilter: "blur(15px)"
          }}
          exit={{ 
            opacity: 0,
            backdropFilter: "blur(0px)"
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60"
        >
          <motion.div
            ref={modalRef}
            className={cn(
              "relative z-10 w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-y-auto shadow-2xl",
              className
            )}
            initial={{ opacity: 0, scale: 0.9, rotateX: 15, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: 10, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col flex-1 p-0", className)}>
      {children}
    </div>
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button 
      onClick={() => setOpen(false)} 
      className="absolute top-4 right-4 group z-20 bg-white/95 hover:bg-white dark:bg-gray-800/95 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-600"
    >
      <X className="text-gray-600 dark:text-gray-300 h-5 w-5 group-hover:scale-110 group-hover:rotate-90 transition-all duration-200" />
    </button>
  );
};

export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

// Compact Loader Component
const CompactLoader = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl",
          sizeClasses[size]
        )}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Zap className={cn("text-white", size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : size === "xl" ? "h-10 w-10" : "h-6 w-6")} />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Enhanced Loading Screen
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Event Buddy
            </h1>
          </div>
          <p className="text-lg text-cyan-200/80 font-medium">Your Ultimate Event Discovery Platform</p>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium bg-gradient-to-br from-gray-100 to-gray-300 bg-clip-text text-transparent mb-8 leading-tight"
        >
          Discover Events <br /> Like Never Before
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
        </motion.div>
      </div>
    </div>
  );
};

// Mock data
const mockEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    date: "2025-09-15",
    time: "10:00 AM - 6:00 PM",
    location: "MIT Campus",
    college: "MIT",
    city: "Boston",
    type: "College Events",
    category: "Workshop",
    price: "Free",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop"
    ],
    description: "Join us for an exciting summit on the latest tech innovations, featuring industry leaders and cutting-edge demonstrations.",
    attendees: 250,
    popularity: 95,
    rating: 4.8,
    tags: ["AI", "Machine Learning", "Innovation"],
    organizer: {
      name: "MIT Tech Society",
      email: "contact@mittechsociety.edu",
      phone: "+1 (555) 123-4567"
    },
    agenda: [
      { time: "10:00 AM", activity: "Registration & Welcome Coffee" },
      { time: "10:30 AM", activity: "Keynote: Future of AI" },
      { time: "2:00 PM", activity: "Workshop: Hands-on ML" }
    ]
  },
  {
    id: 2,
    title: "Cultural Fest 2025",
    date: "2025-09-20",
    time: "6:00 PM - 10:00 PM",
    location: "City Convention Center",
    college: "Stanford",
    city: "San Francisco",
    type: "Local Events",
    category: "Cultural",
    price: "Paid",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop"
    ],
    description: "Experience diverse cultures through music, dance, and art in this spectacular celebration.",
    attendees: 500,
    popularity: 88,
    rating: 4.6,
    tags: ["Music", "Dance", "Art"],
    organizer: {
      name: "Cultural Arts Foundation",
      email: "info@culturalarts.org",
      phone: "+1 (555) 987-6543"
    },
    agenda: [
      { time: "6:00 PM", activity: "Opening Ceremony" },
      { time: "8:30 PM", activity: "Live Music Concert" }
    ]
  }
];

// Enhanced Image Carousel for Modal
const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-t-2xl">
      <motion.img
        key={currentIndex}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        src={images[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-colors duration-200 border border-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-colors duration-200 border border-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-200",
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// **FIXED** Event Details Modal Content with Registration Flow
const EventDetailsModal = () => {
  const { eventData } = useModal();
  const { setOpen } = useModal();
  const { navigate } = useRouter();
  const [modalLoading, setModalLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (eventData) {
      setModalLoading(true);
      const timer = setTimeout(() => {
        setModalLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [eventData]);

  const toggleFavorite = (eventId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  // **FIXED** Registration Handler with proper routing
  const handleRegistration = async () => {
    if (!eventData) return;
    
    console.log('🎯 Starting registration for:', eventData.title);
    setIsRegistering(true);
    
    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Registration completed successfully');
      
      // Close modal first
      setOpen(false);
      
      // Create event slug from title
      const eventSlug = eventData.title.toLowerCase().replace(/\s+/g, '-');
      console.log('🔗 Generated slug:', eventSlug);
      
      // Navigate to event success page with event data
      navigate(`/event/${eventSlug}`, eventData);
      
      console.log('🚀 Navigation triggered to:', `/event/${eventSlug}`);
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!eventData) return null;

  return (
    <ModalContent className="p-0">
      {modalLoading ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 px-4">
          <CompactLoader size="lg" className="mb-6 sm:mb-8" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Loading Event Details</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Please wait while we fetch the latest information...</p>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col">
          <ImageCarousel images={eventData.images || [eventData.image]} title={eventData.title} />
          
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 bg-white dark:bg-gray-900">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold",
                  eventData.price === 'Free' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                )}>
                  {eventData.price}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{eventData.rating}</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{eventData.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{eventData.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Event Details</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{formatDate(eventData.date)} at {eventData.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-red-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{eventData.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{eventData.attendees} attendees</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Ticket className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-purple-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{eventData.category}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {eventData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 rounded-full text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Organizer</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{eventData.organizer?.name}</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm break-all">{eventData.organizer?.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{eventData.organizer?.phone}</span>
                    </div>
                  </div>
                </div>

                {eventData.agenda && eventData.agenda.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Agenda</h4>
                    <div className="space-y-2">
                      {eventData.agenda.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="font-medium text-blue-600 dark:text-blue-400 text-xs sm:text-sm flex-shrink-0">{item.time}</span>
                          <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{item.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: isRegistering ? 1 : 1.02 }}
                whileTap={{ scale: isRegistering ? 1 : 0.98 }}
                disabled={isRegistering}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                onClick={handleRegistration}
              >
                {isRegistering ? (
                  <>
                    <CompactLoader size="sm" />
                    <span>Registering...</span>
                  </>
                ) : (
                  'Register Now'
                )}
              </motion.button>
              <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFavorite(eventData.id)}
                  className={cn(
                    "p-3 sm:p-4 rounded-xl transition-all duration-200 flex-shrink-0 border",
                    favorites.has(eventData.id)
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 border-red-200 dark:border-red-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                  )}
                >
                  <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", favorites.has(eventData.id) ? 'fill-current' : '')} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-colors duration-200 flex-shrink-0 border border-gray-200 dark:border-gray-600"
                  onClick={() => alert('Share functionality coming soon!')}
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContent>
  );
};

// Create Event Card Component
const CreateEventCard = () => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative cursor-pointer h-[450px]"
      onClick={() => navigate('/Create')}
    >
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col items-center justify-center p-8">
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
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
        >
          <Plus className="h-10 w-10 text-white" />
        </motion.div>
        
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          Want to have your own event?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Create and host your own amazing event. It's easy and free!
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Create Event
        </motion.button>
      </div>
    </motion.div>
  );
};

// Enhanced Event Card
const EventCard = ({ event, onFavoriteToggle, isFavorite, onViewDetails }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[450px] w-full"
    >
      <DirectionAwareHover
        imageUrl={event.image}
        className="w-full h-full shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-start">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/30",
            event.price === 'Free' ? 'bg-emerald-500/90 text-white' : 'bg-blue-500/90 text-white'
          )}>
            {event.price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(event.id);
            }}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/30 transition-colors duration-200 pointer-events-auto border border-white/20"
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              )} 
            />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold text-sm">{event.rating}</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight drop-shadow-md">
            {event.title}
          </h3>
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center text-white/95">
              <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="drop-shadow">{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex items-center text-white/95">
              <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate drop-shadow">{event.location}</span>
            </div>
            <div className="flex items-center text-white/95">
              <Users className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="drop-shadow">{event.attendees} attendees</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {event.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/25 backdrop-blur-sm border border-white/30 rounded-full text-xs font-medium text-white shadow-sm"
              >
                {tag}
              </span>
            ))}
            {event.tags?.length > 2 && (
              <span className="px-2 py-1 bg-white/25 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/30">
                +{event.tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <ModalTrigger
              onClick={() => onViewDetails(event)}
              className="flex-1 bg-white/25 backdrop-blur-sm hover:bg-white/35 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm border border-white/30 shadow-lg"
            >
              View Details
            </ModalTrigger>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/25 backdrop-blur-sm hover:bg-white/35 rounded-lg transition-colors duration-200 border border-white/30 pointer-events-auto shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                alert('Share functionality coming soon!');
              }}
            >
              <Share2 className="h-4 w-4 text-white" />
            </motion.button>
          </div>
        </div>
      </DirectionAwareHover>
    </motion.div>
  );
};

// All Events Page Component
const AllEventsPage = () => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const { setEventData } = useModal();
  
  const [eventType, setEventType] = useState('All Events');
  const [collegeSearch, setCollegeSearch] = useState(user?.college || '');
  const [citySearch, setCitySearch] = useState('');
  const [sortBy, setSortBy] = useState('Upcoming');
  const [categoryFilters, setCategoryFilters] = useState({
    Workshop: false,
    Hackathon: false,
    Cultural: false,
    Sports: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (eventType === 'College Events') {
      filtered = filtered.filter(event => event.type === 'College Events');
      if (collegeSearch) {
        filtered = filtered.filter(event => 
          event.college.toLowerCase().includes(collegeSearch.toLowerCase())
        );
      }
    } else if (eventType === 'Local Events') {
      filtered = filtered.filter(event => event.type === 'Local Events');
      if (citySearch) {
        filtered = filtered.filter(event => 
          event.city && event.city.toLowerCase().includes(citySearch.toLowerCase())
        );
      }
    }

    const activeCategories = Object.keys(categoryFilters).filter(key => categoryFilters[key]);
    if (activeCategories.length > 0) {
      filtered = filtered.filter(event => activeCategories.includes(event.category));
    }

    switch (sortBy) {
      case 'Upcoming':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'Free':
        filtered.sort((a, b) => a.price === 'Free' ? -1 : 1);
        break;
      case 'Paid':
        filtered.sort((a, b) => a.price === 'Paid' ? -1 : 1);
        break;
      case 'Popular':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    setFilteredEvents(filtered);
  }, [events, eventType, collegeSearch, citySearch, sortBy, categoryFilters]);

  const handleCategoryFilter = (category) => {
    setCategoryFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleFavorite = (eventId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  const resetFilters = () => {
    setEventType('All Events');
    setCollegeSearch('');
    setCitySearch('');
    setSortBy('Upcoming');
    setCategoryFilters({
      Workshop: false,
      Hackathon: false,
      Cultural: false,
      Sports: false
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 w-full">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 sm:mb-8"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Event Buddy</h1>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent leading-tight">
              All Events
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Discover amazing events happening around you
            </p>
            <div className="flex items-center justify-center gap-2 text-cyan-200">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">{filteredEvents.length} Events Available</span>
            </div>
          </motion.div>
        </div>
      </div>

      <TracingBeam className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 w-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100"
                  >
                    <option>All Events</option>
                    <option>College Events</option>
                    <option>Local Events</option>
                  </select>
                </div>

                <AnimatePresence>
                  {eventType === 'College Events' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, height: 0 }}
                      animate={{ opacity: 1, scale: 1, height: "auto" }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">College Name</label>
                      <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          placeholder="Enter college name"
                          value={collegeSearch}
                          onChange={(e) => setCollegeSearch(e.target.value)}
                          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {eventType === 'Local Events' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, height: 0 }}
                      animate={{ opacity: 1, scale: 1, height: "auto" }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          placeholder="Enter city name"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100"
                  >
                    <option>Upcoming</option>
                    <option>Free</option>
                    <option>Paid</option>
                    <option>Popular</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full p-3 sm:p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 font-semibold text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Reset All</span>
                    <span className="sm:hidden">Reset</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Categories</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {Object.keys(categoryFilters).map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryFilter(category)}
                      className={cn(
                        "px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl md:rounded-2xl border-2 font-semibold transition-all duration-200 text-xs sm:text-sm md:text-base",
                        categoryFilters[category]
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white shadow-lg'
                          : 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-white/80 dark:hover:bg-gray-700/80'
                      )}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key="events-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full"
              >
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EventCard
                      event={event}
                      onFavoriteToggle={toggleFavorite}
                      isFavorite={favorites.has(event.id)}
                      onViewDetails={setEventData}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: filteredEvents.length * 0.1 + 0.1 }}
                >
                  <CreateEventCard />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 sm:py-16 lg:py-20"
              >
                <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 lg:mb-8">🎭</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 lg:mb-4">No events found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 lg:mb-8 px-4">Try adjusting your filters to discover more events</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </TracingBeam>

      <ModalBody>
        <EventDetailsModal />
      </ModalBody>
    </div>
  );
};

// Event Success Page Components - Fixed ICS Calendar Generator Function
const generateICS = (eventDetails) => {
  try {
    const eventDate = new Date(eventDetails.date + 'T00:00:00');
    const timeRange = eventDetails.time.split(' - ');
    const startTimeStr = timeRange[0];
    const endTimeStr = timeRange[1] || timeRange;
    
    // Parse time more carefully
    const parseTime = (timeStr) => {
      const cleanTime = timeStr.trim();
      const isPM = cleanTime.includes('PM');
      const isAM = cleanTime.includes('AM');
      const timeOnly = cleanTime.replace(/[AP]M/g, '').trim();
      const [hourStr, minuteStr] = timeOnly.split(':');
      
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr) || 0;
      
      if (isPM && hour !== 12) {
        hour += 12;
      } else if (isAM && hour === 12) {
        hour = 0;
      }
      
      return { hour, minute };
    };
    
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);
    
    const startDate = new Date(eventDate);
    startDate.setHours(startTime.hour, startTime.minute, 0, 0);
    
    const endDate = new Date(eventDate);
    endDate.setHours(endTime.hour, endTime.minute, 0, 0);

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
      `DESCRIPTION:${eventDetails.description || 'Join us for an amazing event!'}`,
      `LOCATION:${eventDetails.location}`,
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
                {['Live Music', 'Food Stalls', 'Art Shows', 'Workshops'].map((activity) => (
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

// Event Success Page Component
const EventSuccessPage = () => {
  const { navigate, eventData } = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  console.log('📄 EventSuccessPage rendered with eventData:', eventData);

  if (!eventData) {
    console.log('⚠️ No eventData found, showing fallback');
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-lg mb-6">The event information couldn't be loaded.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Back to All Events
          </button>
        </div>
      </div>
    );
  }

  // Create proper target date for countdown
  const targetDateTime = `${eventData.date}T10:00:00`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgNi0xMC02IDEweiIvPjwvZz48L2c+PC9zdmc=')] bg-repeat"></div>
      </div>

      <motion.section 
        className="relative pt-8 sm:pt-16 pb-4 sm:pb-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8 backdrop-blur-sm"
          >
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">Registration Successful!</span>
          </motion.div>

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

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight"
          >
            {eventData.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
          >
            You're all set! Get ready for an unforgettable experience with {eventData.title}.
          </motion.p>

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

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="max-w-6xl mx-auto px-4 pb-8 sm:pb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <ScheduleUpdates />
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
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
                        {new Date(eventData.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-cyan-400 text-xs sm:text-sm">{eventData.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">{eventData.location}</p>
                      <p className="text-white/80 text-xs sm:text-sm">{eventData.address || 'Address will be provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Expected Attendees</p>
                      <p className="text-green-400 text-xs sm:text-sm">{eventData.attendees.toLocaleString()}+ people</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Categories</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {eventData.tags?.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

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
                  <span className="text-white text-sm sm:text-base break-all">{eventData.organizer?.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">{eventData.organizer?.phone}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">{eventData.organizer?.website || 'www.eventbuddy.com'}</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20">
                <p className="text-white/80 text-xs sm:text-sm mb-3">
                  <span className="text-cyan-400 font-semibold">Note:</span> You'll receive a confirmation email with your e-ticket shortly. Save the date and get ready to celebrate!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => addToCalendar(eventData)}
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

      <AnimatePresence>
        {showQRCode && (
          <QRCodeShare 
            eventDetails={eventData} 
            isVisible={showQRCode}
            onClose={() => setShowQRCode(false)}
          />
        )}
      </AnimatePresence>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="text-center py-6 sm:py-8 text-white/60 text-xs sm:text-sm border-t border-white/10"
      >
        <p>© 2025 {eventData.organizer?.name || 'Event Buddy'}. All rights reserved.</p>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 text-cyan-400 hover:text-cyan-300 underline"
        >
          ← Back to All Events
        </button>
      </motion.footer>
    </div>
  );
};

// Main App Component with Router
const App = () => {
  const { currentRoute } = useRouter();

  return (
    <ModalProvider>
      {currentRoute === '/events' ? (
        <AllEventsPage />
      ) : currentRoute.startsWith('/event/') ? (
        <EventSuccessPage />
      ) : (
        <AllEventsPage />
      )}
    </ModalProvider>
  );
};

// Root App with Router Provider
const AppWithRouter = () => {
  return (
    <RouterProvider>
      <App />
    </RouterProvider>
  );
};

export default AppWithRouter;


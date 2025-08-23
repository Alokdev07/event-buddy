// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Make sure to create/use AuthContext

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    {
      label: 'Products',
      dropdown: [
        { label: 'Event Marketing', href: '/products/marketing' },
        { label: 'Event Management', href: '/products/management' },
        { label: 'Event Experience', href: '/products/experience' },
        { label: 'Lead Capture', href: '/products/leads' },
        { label: 'Networking', href: '/products/networking' },
      ]
    },
    {
      label: 'Solutions',
      dropdown: [
        { label: 'Corporate Events', href: '/solutions/corporate' },
        { label: 'Conferences', href: '/solutions/conferences' },
        { label: 'Trade Shows', href: '/solutions/tradeshows' },
        { label: 'Webinars', href: '/solutions/webinars' },
        { label: 'Hybrid Events', href: '/solutions/hybrid' },
      ]
    },
    {
      label: 'Klik',
      href: '/klik'
    },
    {
      label: 'Resources',
      dropdown: [
        { label: 'Blog', href: '/resources/blog' },
        { label: 'Case Studies', href: '/resources/cases' },
        { label: 'Whitepapers', href: '/resources/whitepapers' },
        { label: 'Webinars', href: '/resources/webinars' },
        { label: 'Help Center', href: '/resources/help' },
      ]
    },
    {
      label: 'About Us',
      dropdown: [
        { label: 'Company', href: '/about/company' },
        { label: 'Leadership', href: '/about/leadership' },
        { label: 'Careers', href: '/about/careers' },
        { label: 'News', href: '/about/news' },
        { label: 'Contact', href: '/about/contact' },
      ]
    },
    {
      label: 'Pricing',
      href: '/pricing'
    }
  ];

  const handleDropdownToggle = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    closeDropdowns();
    navigate('/login');
  };

  const handleDemoClick = () => {
    closeDropdowns();
    navigate('/demo');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
      closeDropdowns();
    };

    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeDropdowns();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDropdowns();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Icon Components
  const ChevronDownIcon = ({ className }) => (
    <svg className={className} width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const SearchIcon = ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const MenuIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CloseIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <nav 
      ref={navbarRef} 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'pt-5' : 'pt-0'
      }`}
    >
      {/* Desktop Navigation */}
      <div className={`hidden lg:block max-w-7xl mx-auto px-6 transition-all duration-500 ${
        isScrolled 
          ? 'transform translate-y-5' 
          : 'transform translate-y-0'
      }`}>
        <div 
          className={`flex items-center justify-between rounded-full px-6 py-4 transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/80 backdrop-blur-md shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]' 
              : 'bg-transparent'
          }`}
          style={{
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
          }}
        >
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
          >
            EventBuddy
          </Link>

          {/* Navigation Items */}
          <div 
            onMouseLeave={() => setHovered(null)}
            className="flex items-center space-x-1"
          >
            {navItems.map((item, idx) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <div
                    onMouseEnter={() => {
                      setActiveDropdown(item.label);
                      setHovered(idx);
                    }}
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                      setHovered(null);
                    }}
                  >
                    <button
                      className="relative flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-full"
                      onClick={() => handleDropdownToggle(item.label)}
                    >
                      {hovered === idx && (
                        <div
                          className="absolute inset-0 bg-gray-100 rounded-full transition-all duration-200"
                          style={{
                            animation: 'fadeIn 0.2s ease-in-out'
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                      <ChevronDownIcon 
                        className={`relative z-10 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {/* Dropdown Menu */}
                    {activeDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 opacity-0 translate-y-[-10px] animate-dropdown"
                      >
                        <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-150"
                            onClick={closeDropdowns}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    onMouseEnter={() => setHovered(idx)}
                    className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-full"
                    onClick={closeDropdowns}
                  >
                    {hovered === idx && (
                      <div
                        className="absolute inset-0 bg-gray-100 rounded-full transition-all duration-200"
                        style={{
                          animation: 'fadeIn 0.2s ease-in-out'
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDemoClick}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
            >
              Get a Demo
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.picture &&
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                }
                <span className="text-sm text-gray-600">Hi, {user?.name || user?.given_name}</span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200"
              >
                Login
              </button>
            )}
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-110 rounded-full transition-all duration-200"
              onClick={() => navigate('/search')}
              aria-label="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden max-w-[calc(100vw-2rem)] mx-auto px-4 transition-all duration-500 ${
        isScrolled 
          ? 'transform translate-y-5' 
          : 'transform translate-y-0'
      }`}>
        <div 
          className={`flex flex-col rounded-2xl px-4 py-3 transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/80 backdrop-blur-md shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]' 
              : 'bg-white shadow-sm'
          }`}
          style={{
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
          }}
        >
          <div className="flex w-full items-center justify-between">
            {/* Mobile Logo */}
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              EventBuddy
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDemoClick}
                className="bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-200"
              >
                Demo
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:scale-110 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="w-full mt-4 animate-slideDown">
              <div className="flex flex-col space-y-2 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full px-3 py-3 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:scale-[0.98] rounded-lg font-medium transition-all duration-200"
                          onClick={() => handleDropdownToggle(item.label)}
                        >
                          <span>{item.label}</span>
                          <ChevronDownIcon 
                            className={`transition-transform duration-200 ${
                              activeDropdown === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {activeDropdown === item.label && (
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-slideDown">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.label}
                                to={subItem.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                onClick={closeDropdowns}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:scale-[0.98] rounded-lg font-medium transition-all duration-200"
                        onClick={closeDropdowns}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                {/* Mobile Bottom Actions */}
                {isAuthenticated ? (
                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                    <div className="px-3 py-2 flex items-center space-x-2">
                      {user?.picture &&
                        <img src={user.picture} alt="Profile" className="w-6 h-6 rounded-full" />
                      }
                      <span className="text-sm text-gray-600">Hi, {user?.name || user?.given_name}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        closeDropdowns();
                      }}
                      className="flex items-center w-full text-left px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        closeDropdowns();
                      }}
                      className="flex items-center w-full text-left px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                    <button
                      onClick={handleLoginClick}
                      className="flex items-center w-full text-left px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:scale-[0.98] rounded-lg font-medium transition-all duration-200"
                    >
                      Login
                    </button>
                  </div>
                )}
                <button 
                  className="flex items-center space-x-2 w-full px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:scale-[0.98] rounded-lg font-medium transition-all duration-200"
                  onClick={() => {
                    navigate('/search');
                    closeDropdowns();
                  }}
                >
                  <SearchIcon className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

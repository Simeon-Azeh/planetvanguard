"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bars3Icon, 
  XMarkIcon,
  HeartIcon,
  HandRaisedIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useScrollLock } from '../hooks/useScrollLock';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileView, setMobileView] = useState('main'); // 'main' or 'projects'
  const dropdownRef = useRef(null);

  useScrollLock(isOpen);

  const navItems = [
    { 
      name: 'Home', 
      href: '/' 
    },
    { 
      name: 'About', 
      href: '/about' 
    },
    { 
      name: 'Projects', 
      href: '/projects',
      dropdownItems: [
        { name: 'Events', href: '/events' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Get Involved', href: '/get-involved' },
        { name: 'Resources', href: '/resources' },
        { name: 'Media', href: '/media' }
      ]
    },
    { 
      name: 'Contact', 
      href: '/contact' 
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 20);
      setScrollProgress((scrollY / height) * 100);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileView('main');
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg' 
          : 'bg-transparent'
      }`}>
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          style={{ width: `${scrollProgress}%` }} />
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-10 h-10 transform transition-all duration-300 group-hover:scale-110">
                <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                scrolled 
                  ? 'text-emerald-800 dark:text-emerald-400' 
                  : 'text-emerald-700 dark:text-emerald-300'
              }`}>
                Planet Vanguard
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(item => (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  <button
                    className={`px-4 py-2 rounded-lg transition-all duration-300 relative group 
                      inline-flex items-center ${
                      scrolled 
                        ? 'text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400' 
                        : 'text-gray-700 hover:text-emerald-500 dark:text-gray-200 dark:hover:text-emerald-300'
                    }`}
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                  >
                    {item.name}
                    {item.dropdownItems && (
                      <ChevronDownIcon className={`ml-1 w-4 h-4 transition-transform duration-300 
                        ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  </button>

                  {/* Dropdown Menu */}
                  {item.dropdownItems && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-2 w-48 rounded-xl 
                      bg-white dark:bg-black 
                      border border-emerald-100 dark:border-emerald-800
                      shadow-lg overflow-hidden
                      animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {item.dropdownItems.map(dropdownItem => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 
                            hover:bg-emerald-50 dark:hover:bg-emerald-900/50
                            hover:text-emerald-600 dark:hover:text-emerald-400
                            transition-all duration-300"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <Link 
                href="/donate"
                className="ml-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 
                  text-white rounded-lg transition-all duration-300 transform hover:scale-105
                  shadow-[0_0_15px_rgba(16,185,129,0.2)]
                  hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
                  flex items-center gap-2"
              >
                <HeartIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Donate</span>
              </Link>
              <Link 
                href="/volunteer"
                className="ml-2 px-4 py-2 border-2 border-emerald-600 
                  text-emerald-600 dark:text-emerald-400 
                  hover:bg-emerald-50 dark:hover:bg-emerald-950/50 
                  rounded-lg transition-all duration-300 transform hover:scale-105
                  flex items-center gap-2"
              >
                <HandRaisedIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Volunteer</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-[60] w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6 text-emerald-500" />
              ) : (
                <Bars3Icon className={`h-6 w-6 transition-colors duration-300 ${
                  scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-200'
                }`} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] bg-white/95 dark:bg-black/95 backdrop-blur-lg 
        transition-all duration-500 ease-in-out flex items-center justify-center md:hidden
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center space-y-8 w-full px-8">
          {mobileView === 'main' ? (
            // Main Navigation View
            <>
              {navItems.map(item => (
                <div key={item.name} className="flex flex-col items-center">
                  {item.dropdownItems ? (
                    <button
                      onClick={() => setMobileView('projects')}
                      className="text-3xl font-medium text-gray-800 dark:text-gray-200 
                        hover:text-emerald-600 dark:hover:text-emerald-400 
                        transition-all duration-300 transform hover:scale-105
                        flex items-center gap-2"
                    >
                      {item.name}
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-3xl font-medium text-gray-800 dark:text-gray-200 
                        hover:text-emerald-600 dark:hover:text-emerald-400 
                        transition-all duration-300 transform hover:scale-105"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link 
                href="/donate"
                className="w-full px-8 py-4 bg-emerald-600 hover:bg-emerald-700 
                  text-white rounded-lg transition-all duration-300 transform hover:scale-105
                  shadow-[0_0_15px_rgba(16,185,129,0.2)]
                  hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
                  flex items-center justify-center gap-2"
                onClick={closeMobileMenu}
              >
                <HeartIcon className="w-6 h-6" />
                <span>Donate</span>
              </Link>
              <Link 
                href="/volunteer"
                className="w-full px-8 py-4 border-2 border-emerald-600 
                  text-emerald-600 dark:text-emerald-400 
                  hover:bg-emerald-50 dark:hover:bg-emerald-950/50 
                  rounded-lg transition-all duration-300 transform hover:scale-105
                  flex items-center justify-center gap-2"
                onClick={closeMobileMenu}
              >
                <HandRaisedIcon className="w-6 h-6" />
                <span>Volunteer</span>
              </Link>
            </>
          ) : (
            // Projects Submenu View
            <div className="w-full animate-in slide-in-from-right-2 duration-300">
              <button
                onClick={() => setMobileView('main')}
                className="mb-8 flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
              >
                <ChevronLeftIcon className="w-6 h-6" />
                <span>Back to Menu</span>
              </button>
              <div className="space-y-6">
                {navItems.find(item => item.name === 'Projects').dropdownItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-2xl text-gray-800 dark:text-gray-200
                      hover:text-emerald-600 dark:hover:text-emerald-400
                      transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
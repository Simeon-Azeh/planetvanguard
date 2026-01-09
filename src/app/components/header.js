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
  ChevronRightIcon,
  CalendarDaysIcon,
  TrophyIcon,
  UserGroupIcon,
  BookOpenIcon,
  PhotoIcon,
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useScrollLock } from '../hooks/useScrollLock';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileView, setMobileView] = useState('main');
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useScrollLock(isOpen);

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon
    },
    {
      name: 'About',
      href: '/about',
      icon: InformationCircleIcon
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: SparklesIcon
    },
    {
      name: 'Explore',
      href: '#',
      icon: BookOpenIcon,
      dropdownItems: [
        {
          name: 'Events',
          href: '/events',
          icon: CalendarDaysIcon,
          description: 'Join our upcoming workshops and initiatives'
        },
        {
          name: 'Success Stories',
          href: '/success-stories',
          icon: TrophyIcon,
          description: 'See the impact we\'ve made together'
        },
        {
          name: 'Get Involved',
          href: '/get-involved',
          icon: UserGroupIcon,
          description: 'Volunteer and make a difference'
        },
        {
          name: 'Resources',
          href: '/resources',
          icon: BookOpenIcon,
          description: 'Educational materials and guides'
        },
        {
          name: 'Media',
          href: '/media',
          icon: PhotoIcon,
          description: 'Photos, videos, and press coverage'
        }
      ]
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: EnvelopeIcon
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 20);
      setScrollProgress((scrollY / height) * 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownEnter = (itemName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileView('main');
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-lg shadow-emerald-500/5'
        : 'bg-gradient-to-b from-black/20 to-transparent'
        }`}>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }} />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                <Image src="/logo.svg" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${scrolled
                  ? ' md:text-gray-900 dark:text-white'
                  : 'text-emerald-900 md:text-emerald-800 dark:text-white'
                  }`}>
                  Planet Vanguard
                </span>
                <span className={`text-xs font-medium transition-colors duration-300 ${scrolled
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-emerald-900 dark:text-emerald-400'
                  }`}>
                  Protecting Our Future
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(item => (
                <div
                  key={item.name}
                  className="relative"
                  ref={item.dropdownItems ? dropdownRef : null}
                  onMouseEnter={() => item.dropdownItems && handleDropdownEnter(item.name)}
                  onMouseLeave={() => item.dropdownItems && handleDropdownLeave()}
                >
                  {item.dropdownItems ? (
                    // Dropdown Button
                    <button
                      className={`px-4 py-2.5 rounded-xl transition-all duration-300 relative group 
                        inline-flex items-center gap-2 font-medium ${scrolled
                          ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-200 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/50'
                          : 'text-emerald-800/90 hover:text-emerald-700 hover:bg-emerald-800/10'
                        } ${activeDropdown === item.name ? (scrolled ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-emerald-800/10 text-emerald-700') : ''}`}
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 
                        ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    // Regular Navigation Link
                    <Link
                      href={item.href}
                      className={`px-4 py-2.5 rounded-xl transition-all duration-300 relative group 
                        inline-flex items-center gap-2 font-medium ${scrolled
                          ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-200 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/50'
                          : 'text-emerald-800/90 hover:text-emerald-700 hover:bg-emerald-800/10'
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  )}

                  {/* Enhanced Mega Dropdown Menu */}
                  {item.dropdownItems && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl 
                        bg-white dark:bg-gray-900 
                        border border-gray-100 dark:border-gray-800
                        shadow-2xl shadow-emerald-500/10
                        overflow-hidden
                        animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseEnter={() => handleDropdownEnter(item.name)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Explore Our Work
                        </p>
                      </div>

                      <div className="p-2">
                        {item.dropdownItems.map(dropdownItem => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="flex items-start gap-3 px-3 py-3 rounded-xl
                              text-gray-700 dark:text-gray-300 
                              hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 
                              dark:hover:from-emerald-950/50 dark:hover:to-teal-950/50
                              transition-all duration-300 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <dropdownItem.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {dropdownItem.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {dropdownItem.description}
                              </p>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300 mt-1" />
                          </Link>
                        ))}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                        <Link
                          href="/get-involved"
                          className="flex items-center justify-between text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span>Explore all options</span>
                          <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200/50 dark:border-gray-700/50">
                <Link
                  href="/get-involved"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 
                    text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5
                    shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30
                    flex items-center gap-2"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span>Donate</span>
                </Link>
                <Link
                  href="/volunteer"
                  className={`px-5 py-2.5 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5
                    flex items-center gap-2 border-2 ${scrolled
                      ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50'
                      : 'border-emerald-800/50 text-emerald-800 hover:bg-emerald-800/10 hover:border-emerald-700'
                    }`}
                >
                  <HandRaisedIcon className="w-5 h-5" />
                  <span>Volunteer</span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden relative z-[60] w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10'
                }`}
              aria-label="Toggle menu"
            >
              <div className={`w-6 transform transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Bars3Icon className={`h-6 w-6 transition-colors duration-300 ${scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-emerald-800'
                    }`} />
                )}
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] bg-white dark:bg-gray-950 
        transition-all duration-500 ease-in-out lg:hidden
        ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>

        {/* Mobile Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <div className="relative w-10 h-10">
              <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Planet Vanguard
            </span>
          </Link>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {mobileView === 'main' ? (
            <div className="space-y-2">
              {navItems.map(item => (
                <div key={item.name}>
                  {item.dropdownItems ? (
                    <button
                      onClick={() => setMobileView('explore')}
                      className="w-full flex items-center justify-between px-4 py-4 rounded-2xl
                        bg-gray-50 dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50
                        text-gray-900 dark:text-white transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Explore our initiatives</p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl
                        hover:bg-gray-50 dark:hover:bg-gray-900
                        text-gray-900 dark:text-white transition-all duration-300"
                      onClick={closeMobileMenu}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="font-semibold text-lg">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Action Buttons */}
              <div className="pt-6 space-y-3">
                <Link
                  href="/get-involved"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 
                    bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
                    text-white font-semibold text-lg rounded-2xl transition-all duration-300
                    shadow-lg shadow-emerald-500/25"
                  onClick={closeMobileMenu}
                >
                  <HeartIcon className="w-6 h-6" />
                  <span>Donate Now</span>
                </Link>
                <Link
                  href="/volunteer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 
                    border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400
                    font-semibold text-lg rounded-2xl transition-all duration-300
                    hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                  onClick={closeMobileMenu}
                >
                  <HandRaisedIcon className="w-6 h-6" />
                  <span>Become a Volunteer</span>
                </Link>
              </div>
            </div>
          ) : (
            // Explore Submenu View
            <div className="animate-in slide-in-from-right duration-300">
              <button
                onClick={() => setMobileView('main')}
                className="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400 font-medium"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span>Back to Menu</span>
              </button>

              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
                Explore
              </h3>

              <div className="space-y-2">
                {navItems.find(item => item.name === 'Explore')?.dropdownItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-start gap-4 px-4 py-4 rounded-2xl
                      hover:bg-gray-50 dark:hover:bg-gray-900
                      transition-all duration-300 group"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Protecting our planet, one step at a time
          </p>
        </div>
      </div>
    </>
  );
}
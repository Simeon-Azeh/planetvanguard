"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useScrollLock } from '../hooks/useScrollLock';
import { 
   
    HeartIcon,
    HandRaisedIcon 
  } from '@heroicons/react/24/outline';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useScrollLock(isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 20);
      setScrollProgress((scrollY / height) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg' 
          : 'bg-transparent'
      }`}>
        {/* Progress Bar */}
        <div 
          className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          style={{ width: `${scrollProgress}%` }}
        />
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-10 h-10 transform transition-all duration-300 group-hover:scale-110">
                <Image 
                  src="/logo.svg" 
                  alt="Logo" 
                  fill
                  className="object-contain"
                />
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
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                    scrolled 
                      ? 'text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400' 
                      : 'text-gray-700 hover:text-emerald-500 dark:text-gray-200 dark:hover:text-emerald-300'
                  }`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
              {/* Action Buttons */}
              <Link 
  href="/donate"
  className="ml-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 
    text-white rounded-lg 
    transition-all duration-300 transform hover:scale-105
    shadow-[0_0_15px_rgba(16,185,129,0.2)]
    hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
    flex items-center gap-2"
>
  <HeartIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
  <span>Donate</span>
</Link>
<Link 
  href="/volunteer"
  className="ml-2 px-4 py-2 
    border-2 border-emerald-600 
    text-emerald-600 dark:text-emerald-400 
    hover:bg-emerald-50 dark:hover:bg-emerald-950/50 
    rounded-lg 
    transition-all duration-300 transform hover:scale-105
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
              <div className={`w-6 transform transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Bars3Icon className={`h-6 w-6 transition-colors duration-300 ${
                    scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-200'
                  }`} />
                )}
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] bg-white/95 dark:bg-black/95 backdrop-blur-lg transition-all duration-500 ease-in-out flex items-center justify-center md:hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-all duration-300 transform hover:scale-105"
          aria-label="Close menu"
        >
          <XMarkIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </button>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="text-3xl font-medium text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* Mobile Action Buttons */}
          <Link 
  href="/donate"
  className="ml-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 
    text-white rounded-lg 
    transition-all duration-300 transform hover:scale-105
    shadow-[0_0_15px_rgba(16,185,129,0.2)]
    hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
    flex items-center gap-2"
>
  <HeartIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
  <span>Donate</span>
</Link>
<Link 
  href="/volunteer"
  className="ml-2 px-4 py-2 
    border-2 border-emerald-600 
    text-emerald-600 dark:text-emerald-400 
    hover:bg-emerald-50 dark:hover:bg-emerald-950/50 
    rounded-lg 
    transition-all duration-300 transform hover:scale-105
    flex items-center gap-2"
>
  <HandRaisedIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
  <span>Volunteer</span>
</Link>
        </div>
      </div>
    </>
  );
}
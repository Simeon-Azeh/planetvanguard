"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRightIcon, PlayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Climate Action";
  const [scrolled, setScrolled] = useState(false);

  // Typing effect
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-teal-50 to-blue-50 
        dark:from-emerald-950 dark:via-teal-950 dark:to-blue-950" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-700/10 
          rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-blue-300/20 dark:bg-blue-700/10 
          rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-teal-300/20 dark:bg-teal-700/10 
          rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-[0.03] dark:opacity-[0.05]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Left content */}
        <div className="flex-1 text-center md:text-left z-10">
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 
                      text-emerald-700 dark:text-emerald-300 text-sm rounded-full border border-emerald-200 border-solid dark:border-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Non-profit organization working across Africa
          </div>

          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-gray-800 dark:text-white leading-tight mb-6">
            Empowering African Youth for
            <div className="h-16 md:h-20">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                {" "}{typedText}
                <span className="animate-blink">|</span>
              </span>
            </div>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
            Join us in creating sustainable solutions and building a greener future for Africa and beyond.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-12">
            <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl 
              flex items-center gap-2 transition-all transform hover:scale-105 
              shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30">
              Get Started
              <ArrowRightIcon className="w-5 h-5 animate-bounce-x" />
            </button>
            <button className="px-8 py-4 border-2 border-emerald-600 border-solid text-emerald-600 
                          hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 
                          rounded-xl transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>

          {/* Impact numbers */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">20+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">500K</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Trees Planted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">10K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Youth Trained</div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative z-10">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
            <Image
              src="/hero-img.svg"
              alt="Climate Action"
              width={600}
              height={600}
              className="relative transform hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 
        ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 animate-bounce">
          <span className="text-xs">Scroll Down</span>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Floating Play Button */}
      <a
        href="https://youtube.com/your-channel-link"
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-8 right-8 z-40 
          flex items-center gap-3
          bg-emerald-600 dark:bg-emerald-500 
          hover:bg-emerald-700 dark:hover:bg-emerald-600
          rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]
          hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
          px-5 py-5 hover:pr-8
          transition-all duration-300 ease-in-out"
      >
        <div className="relative">
          <PlayIcon className="w-6 h-6 text-white 
            transition-all duration-300 group-hover:scale-110" />
          <span className="absolute -inset-1 animate-ping rounded-full 
            bg-white/30" />
        </div>
        <span className="max-w-0 group-hover:max-w-xs whitespace-nowrap overflow-hidden 
          transition-all duration-300 text-white font-medium opacity-0 group-hover:opacity-100">
          Watch our story
        </span>
      </a>
    </div>
  );
}
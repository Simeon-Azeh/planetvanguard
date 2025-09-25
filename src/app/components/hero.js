"use client"
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRightIcon, PlayIcon, ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Climate Action";
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const numbersRef = useRef(null);

  // Counter states
  const [countries, setCountries] = useState(0);
  const [trees, setTrees] = useState(0);
  const [youth, setYouth] = useState(0);

  // Typing effect with improved animation
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      // Reset and restart after a pause
      const resetTimeout = setTimeout(() => {
        setTypedText("");
      }, 3000);
      return () => clearTimeout(resetTimeout);
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

  // Intersection Observer for number animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (numbersRef.current) {
      observer.observe(numbersRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Counter animation function
  const animateCounters = () => {
    // Countries counter (0 to 3)
    let countriesCount = 0;
    const countriesInterval = setInterval(() => {
      countriesCount += 1;
      setCountries(countriesCount);
      if (countriesCount >= 3) clearInterval(countriesInterval);
    }, 200);

    // Trees counter (0 to 10000)
    let treesCount = 0;
    const treesInterval = setInterval(() => {
      treesCount += 500;
      setTrees(treesCount);
      if (treesCount >= 10000) {
        setTrees(10000);
        clearInterval(treesInterval);
      }
    }, 100);

    // Youth counter (0 to 200)
    let youthCount = 0;
    const youthInterval = setInterval(() => {
      youthCount += 10;
      setYouth(youthCount);
      if (youthCount >= 200) {
        setYouth(200);
        clearInterval(youthInterval);
      }
    }, 150);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 
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

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700 bg-[length:40px_40px] opacity-[0.03] dark:opacity-[0.05]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center gap-12">
        {/* Left content */}
        <div className="flex-1 text-center lg:text-left z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 
            bg-gradient-to-r from-emerald-100 to-teal-100 
            dark:from-emerald-900/40 dark:to-teal-900/40 
            text-emerald-700 dark:text-emerald-300 text-sm rounded-full 
            border border-emerald-200 dark:border-emerald-800
            shadow-lg shadow-emerald-500/10">
            <SparklesIcon className="w-4 h-4" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Non-profit organization working across Africa
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Empowering African Youth for
            <div className="h-16 md:h-20 xl:h-24">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 animate-gradient-x">
                {" "}{typedText}
                <span className="animate-pulse text-emerald-600">|</span>
              </span>
            </div>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Join us in creating sustainable solutions and building a greener future for Africa and beyond. 
            Together, we can turn voices into action.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
            <Link href="/get-involved" className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
              hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl 
              flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 
              shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40
              border border-emerald-500/20">
              Get Involved
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/events" className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 
              hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 
              rounded-xl transition-all duration-300 transform hover:scale-105
              hover:shadow-lg hover:shadow-emerald-500/20">
              Learn More
            </Link>
          </div>

          {/* Enhanced Impact numbers */}
          <div ref={numbersRef} className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center group">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 
                border border-emerald-200/50 dark:border-emerald-700/50
                hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300
                hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {countries}+
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Countries
                </div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 
                border border-emerald-200/50 dark:border-emerald-700/50
                hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300
                hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {formatNumber(trees)}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Trees Planted
                </div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 
                border border-emerald-200/50 dark:border-emerald-700/50
                hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300
                hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {youth}+
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Youth Trained
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative z-10">
          <div className="relative animate-float">
            <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 
              rounded-full blur-2xl opacity-70 animate-pulse-slow"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 
              rounded-full blur-xl animate-spin-slow"></div>
            <Image
              src="/hero-img.svg"
              alt="Climate Action Illustration"
              width={600}
              height={600}
              className="relative transform hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 
        ${scrolled ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 animate-bounce">
          <span className="text-xs font-medium">Scroll Down</span>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Enhanced Floating Play Button */}
      <button
        onClick={() => setShowVideo(true)}
        className="group fixed bottom-8 right-8 z-40 
          flex items-center gap-0
          bg-gradient-to-r from-emerald-600 to-teal-600
          hover:from-emerald-700 hover:to-teal-700
          rounded-full shadow-2xl shadow-emerald-500/25
          hover:shadow-emerald-500/40
          transition-all duration-500 ease-out
          overflow-hidden
          hover:pr-6"
      >
        <div className="relative p-4">
          <div className="relative">
            <PlayIcon className="w-6 h-6 text-white z-10 relative
              transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 animate-ping rounded-full 
              bg-white/20 group-hover:bg-white/30" />
            <div className="absolute inset-0 animate-pulse rounded-full 
              bg-white/10 animation-delay-1000" />
          </div>
        </div>
        <div className="max-w-0 group-hover:max-w-32 whitespace-nowrap overflow-hidden 
          transition-all duration-500 ease-out pr-0 group-hover:pr-2">
          <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 delay-200">
            Our Story
          </span>
        </div>
      </button>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-4xl w-full aspect-video"
            onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 
                rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Planet Vanguard Story"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
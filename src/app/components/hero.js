"use client"
import Image from 'next/image';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950" />
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Left content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 dark:text-emerald-400 leading-tight mb-6">
            Empowering African Youth for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              {" "}Climate Action
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
            Join us in creating sustainable solutions and building a greener future for Africa and beyond.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-all transform hover:scale-105">
              Get Started
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 rounded-xl transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <Image
            src="/hero-img.svg"
            alt="Climate Action"
            width={600}
            height={600}
            className="transform hover:scale-105 transition-transform duration-500 animate-float"
          />
        </div>
      </div>

      {/* Floating Play Button - Now correctly positioned */}
     {/* Floating Play Button */}
{/* Floating Play Button - Repositioned to bottom-left */}
<a 
  href="https://youtube.com/your-channel-link" 
  target="_blank"
  rel="noopener noreferrer"
  className="group fixed bottom-8 left-8 z-40 
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
"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, LightBulbIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';

const projectData = [
  {
    id: 1,
    image: "/project1.jpg",
    title: "Solar Power Revolution",
    description: "Lighting up rural communities with clean, renewable energy",
    impact: "500+ homes powered"
  },
  {
    id: 2,
    image: "/project2.jpg",
    title: "Zero Waste Communities",
    description: "Transforming waste into resources and sustainable solutions",
    impact: "80% waste reduction"
  },
  {
    id: 3,
    image: "/project3.jpg",
    title: "Forest Restoration",
    description: "Replanting ecosystems and protecting biodiversity",
    impact: "10,000+ trees planted"
  },
  {
    id: 4,
    image: "/project4.jpg",
    title: "Water Guardians",
    description: "Conserving precious water resources for future generations",
    impact: "60% water saved"
  }
];

export default function AboutPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projectData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-black dark:via-emerald-950/20 dark:to-black">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full
          bg-gradient-to-br from-emerald-300/15 via-teal-300/10 to-cyan-300/15
          dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-cyan-900/20
          blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full
          bg-gradient-to-tr from-blue-300/15 via-emerald-300/10 to-teal-300/15
          dark:from-blue-900/20 dark:via-emerald-900/15 dark:to-teal-900/20
          blur-3xl pointer-events-none animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full
          bg-gradient-to-r from-emerald-200/20 to-teal-200/20
          dark:from-emerald-800/30 dark:to-teal-800/30
          blur-2xl pointer-events-none animate-spin-slow" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700 bg-[length:60px_60px] opacity-[0.02] dark:opacity-[0.03]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - Creative Floating Grid */}
          <div className="relative order-2 lg:order-1 h-[500px] md:h-[600px] lg:h-[650px]">
            {/* Main Featured Card - Large Center */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                w-[60%] h-[55%] z-20 group"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl
                transition-all duration-700 ease-out transform
                ${hoveredCard === 0 ? 'scale-105 rotate-1 z-30 shadow-emerald-500/40' : 'scale-100 rotate-0'}
                hover:shadow-2xl hover:shadow-emerald-500/30`}>
                <Image
                  src={projectData[currentIndex].image}
                  alt={projectData[currentIndex].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition-all duration-700 ease-out
                    group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                  from-emerald-900/95 via-emerald-900/50 to-transparent
                  opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="space-y-3">
                    <h3 className="text-white font-bold text-xl md:text-2xl leading-tight drop-shadow-lg">
                      {projectData[currentIndex].title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">
                      {projectData[currentIndex].description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <SparklesIcon className="w-5 h-5 text-emerald-300" />
                      <span className="text-emerald-200 text-sm font-semibold">
                        {projectData[currentIndex].impact}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
            </div>

            {/* Top Left Card - Floating */}
            <div
              className="absolute top-4 left-4 w-[35%] h-[35%] z-15 group"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl
                transition-all duration-700 ease-out transform
                ${hoveredCard === 1 ? 'scale-110 -rotate-2 z-30 shadow-teal-500/40' : 'scale-100 rotate-0'}
                hover:shadow-xl hover:shadow-teal-500/30`}>
                <Image
                  src={projectData[(currentIndex + 1) % projectData.length].image}
                  alt={projectData[(currentIndex + 1) % projectData.length].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-cover transition-all duration-700 ease-out
                    group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                  from-teal-900/95 via-teal-900/60 to-transparent
                  opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-lg">
                    {projectData[(currentIndex + 1) % projectData.length].title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <SparklesIcon className="w-3 h-3 text-teal-300" />
                    <span className="text-teal-200 text-xs font-medium">
                      {projectData[(currentIndex + 1) % projectData.length].impact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right Card - Floating */}
            <div
              className="absolute top-8 right-8 w-[32%] h-[38%] z-10 group"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl
                transition-all duration-700 ease-out transform
                ${hoveredCard === 2 ? 'scale-110 rotate-3 z-30 shadow-cyan-500/40' : 'scale-100 rotate-0'}
                hover:shadow-xl hover:shadow-cyan-500/30`}>
                <Image
                  src={projectData[(currentIndex + 2) % projectData.length].image}
                  alt={projectData[(currentIndex + 2) % projectData.length].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 32vw"
                  className="object-cover transition-all duration-700 ease-out
                    group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                  from-cyan-900/95 via-cyan-900/60 to-transparent
                  opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-lg">
                    {projectData[(currentIndex + 2) % projectData.length].title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <SparklesIcon className="w-3 h-3 text-cyan-300" />
                    <span className="text-cyan-200 text-xs font-medium">
                      {projectData[(currentIndex + 2) % projectData.length].impact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Left Card - Floating */}
            <div
              className="absolute bottom-12 left-6 w-[38%] h-[32%] z-15 group"
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl
                transition-all duration-700 ease-out transform
                ${hoveredCard === 3 ? 'scale-110 -rotate-1 z-30 shadow-blue-500/40' : 'scale-100 rotate-0'}
                hover:shadow-xl hover:shadow-blue-500/30`}>
                <Image
                  src={projectData[(currentIndex + 3) % projectData.length].image}
                  alt={projectData[(currentIndex + 3) % projectData.length].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 38vw"
                  className="object-cover transition-all duration-700 ease-out
                    group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                  from-blue-900/95 via-blue-900/60 to-transparent
                  opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-lg">
                    {projectData[(currentIndex + 3) % projectData.length].title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <SparklesIcon className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200 text-xs font-medium">
                      {projectData[(currentIndex + 3) % projectData.length].impact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right Card - Small Accent */}
            <div
              className="absolute bottom-4 right-4 w-[28%] h-[28%] z-10 group"
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-lg
                transition-all duration-700 ease-out transform
                ${hoveredCard === 4 ? 'scale-110 rotate-2 z-30 shadow-purple-500/40' : 'scale-100 rotate-0'}
                hover:shadow-lg hover:shadow-purple-500/30`}>
                <Image
                  src={projectData[(currentIndex + 4) % projectData.length].image}
                  alt={projectData[(currentIndex + 4) % projectData.length].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 28vw"
                  className="object-cover transition-all duration-700 ease-out
                    group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                  from-purple-900/95 via-purple-900/60 to-transparent
                  opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-xs md:text-sm leading-tight drop-shadow-lg">
                    {projectData[(currentIndex + 4) % projectData.length].title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <SparklesIcon className="w-2 h-2 text-purple-300" />
                    <span className="text-purple-200 text-xs font-medium">
                      {projectData[(currentIndex + 4) % projectData.length].impact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Decorative Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-emerald-400/8 rounded-full
              blur-lg animate-float animation-delay-1000" />
            <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-teal-400/10 rounded-full
              blur-md animate-bounce animation-delay-2000" />
            <div className="absolute top-2/3 left-1/6 w-8 h-8 bg-cyan-400/12 rounded-full
              blur-sm animate-pulse animation-delay-3000" />
            <div className="absolute bottom-1/4 right-1/6 w-10 h-10 bg-blue-400/8 rounded-full
              blur-md animate-float animation-delay-4000" />
            <div className="absolute top-1/6 right-1/4 w-6 h-6 bg-purple-400/15 rounded-full
              blur-sm animate-bounce animation-delay-5000" />
          </div>

          {/* Right Content - Enhanced Text */}
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2
              bg-gradient-to-r from-emerald-100 to-teal-100
              dark:from-emerald-900/40 dark:to-teal-900/40
              text-emerald-700 dark:text-emerald-300 text-sm rounded-full
              border border-emerald-200 dark:border-emerald-800
              shadow-lg shadow-emerald-500/10">
              <HeartIcon className="w-4 h-4 animate-pulse" />
              <span className="font-medium">Our Mission</span>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Creating Lasting Change Across{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                  Africa
                </span>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                We're not just planting trees or installing solar panels. We're building
                <span className="font-semibold text-emerald-600 dark:text-emerald-400"> sustainable communities</span>,
                empowering local leaders, and creating economic opportunities that last.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                Every project we undertake is designed to create ripple effects that benefit
                entire communities, ensuring that the change we create is lasting and transformative.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center group">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400
                  group-hover:scale-110 transition-transform duration-300">
                  500+
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Lives Impacted
                </div>
              </div>
              <div className="text-center group">
                <div className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400
                  group-hover:scale-110 transition-transform duration-300">
                  25+
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Communities
                </div>
              </div>
              <div className="text-center group">
                <div className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400
                  group-hover:scale-110 transition-transform duration-300">
                  2030
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Vision Year
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4
                  bg-gradient-to-r from-emerald-600 to-teal-600
                  hover:from-emerald-700 hover:to-teal-700
                  text-white rounded-xl font-semibold
                  transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                  shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                Explore Our Work
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4
                  border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400
                  hover:bg-emerald-50 dark:hover:bg-emerald-950/50
                  rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                  hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <LightBulbIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
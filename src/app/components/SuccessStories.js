"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const stories = [
  {
    id: 1,
    title: "Solar Power Initiative",
    location: "Lagos, Nigeria",
    image: "/project1.jpg",
    description: "Implemented solar panels in 50+ homes, reducing carbon emissions by 40%",
    impact: "500+ lives improved"
  },
  {
    id: 2,
    title: "Community Garden Project",
    location: "Nairobi, Kenya",
    image: "/success2.jpg",
    description: "Created sustainable food sources for local communities",
    impact: "200+ families supported"
  },
  {
    id: 3,
    title: "Youth Education Program",
    location: "Accra, Ghana",
    image: "/success3.webp",
    description: "Trained 1000+ youth in environmental conservation",
    impact: "20+ schools reached"
  },
  {
    id: 4,
    title: "Water Conservation",
    location: "Kampala, Uganda",
    image: "/project4.jpg",
    description: "Implemented water saving techniques in farming",
    impact: "60% water saved"
  }
];

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (stories.length - 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 2 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-12 text-center">
          Our Success Stories
        </h2>

        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10
              p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg
              hover:bg-emerald-50 dark:hover:bg-emerald-900/50
              transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
              p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg
              hover:bg-emerald-50 dark:hover:bg-emerald-900/50
              transition-all duration-300 transform hover:scale-110"
          >
            <ChevronRightIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(currentIndex, currentIndex + 3).map((story) => (
              <div 
                key={story.id}
                className="group relative bg-white dark:bg-black/50 rounded-2xl overflow-hidden
                  shadow-lg hover:shadow-xl transition-all duration-300
                  transform hover:scale-[1.02]"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-400 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500 mb-3">
                    {story.location}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {story.description}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <span className="text-sm font-semibold">Impact:</span>
                    <span className="text-sm">{story.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const projectData = [
  {
    id: 1,
    image: "/project1.jpg",
    title: "Solar Energy Initiative",
    description: "Bringing renewable energy solutions to rural communities"
  },
  {
    id: 2,
    image: "/project2.jpg",
    title: "Waste Management",
    description: "Implementing sustainable waste reduction programs"
  },
  {
    id: 3,
    image: "/project3.jpg",
    title: "Tree Planting",
    description: "Restoring forests and improving biodiversity"
  },
  {
    id: 4,
    image: "/project4.jpg",
    title: "Water Conservation",
    description: "Protecting water resources for future generations"
  }
];

export default function AboutPreview() {
  const [currentProjects, setCurrentProjects] = useState([0, 1]);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentProjects(prev => {
          const newIndices = [
            (prev[0] + 2) % projectData.length,
            (prev[1] + 2) % projectData.length
          ];
          return newIndices;
        });
        setIsFlipping(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content - Project Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
            {currentProjects.map((projectIndex, i) => (
  <div
    key={projectData[projectIndex].id}
    className={`relative group rounded-2xl overflow-hidden shadow-lg aspect-[3/4]
      ${i === 1 ? 'translate-y-8' : ''} 
      transform transition-all duration-500
      ${isFlipping ? 'rotate-y-180 scale-0' : 'rotate-y-0 scale-100'}`}
  >
    <div className="w-full h-full relative">
      <Image
        src={projectData[projectIndex].image}
        alt={projectData[projectIndex].title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-emerald-600/70 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        flex flex-col justify-end p-6">
        <h3 className="text-white font-semibold text-lg mb-2">
          {projectData[projectIndex].title}
        </h3>
        <p className="text-white/90 text-sm">
          {projectData[projectIndex].description}
        </p>
      </div>
    </div>
  </div>
))}
            </div>
          </div>

          {/* Right Content */}
          {/* ...existing content... */}
          <div className="space-y-8">
  <div>
    <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">
      Making Our World{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
        Cleaner & Greener
      </span>
    </h2>
    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
      Through innovative projects and community engagement, we're building 
      a sustainable future for Africa. Our initiatives focus on renewable 
      energy, waste management, and environmental education.
    </p>
  </div>
  <div className="flex flex-wrap gap-4">
    <Link 
      href="/projects"
      className="group inline-flex items-center gap-2 px-6 py-3 
        bg-emerald-600 hover:bg-emerald-700 
        text-white rounded-xl 
        transition-all transform hover:scale-105 
        shadow-[0_0_15px_rgba(16,185,129,0.2)]
        hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
    >
      View Our Projects
      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Link>
    <Link 
      href="/about"
      className="group inline-flex items-center gap-2 px-6 py-3 
        border-2 border-emerald-600 
        text-emerald-600 dark:text-emerald-400 
        hover:bg-emerald-50 dark:hover:bg-emerald-950/50 
        rounded-xl transition-all transform hover:scale-105"
    >
      Learn More
      <LightBulbIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
    </Link>
  </div>
</div>

        </div>
      </div>

      {/* Background Elements */}
      {/* ...existing background elements... */}
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
  bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
<div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
  bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />
    </section>
  );
}
"use client"
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function MissionVision() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/mission-vision.svg"
              alt="Our Mission and Vision"
              fill
              className="object-cover animate-float"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent " />
          </div>

          {/* Content Column */}
          <div className="space-y-12">
            {/* Mission Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                To empower African youth through sustainable environmental initiatives, 
                fostering innovation and creating lasting positive impact on communities 
                and ecosystems across the continent.
              </p>
            </div>

            {/* Vision Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                A thriving Africa where young leaders drive environmental sustainability, 
                creating prosperous communities that live in harmony with nature, setting 
                an example for global environmental stewardship.
              </p>
            </div>

            {/* Values List */}
            <div className="grid grid-cols-2 gap-4">
              {[
                'Innovation',
                'Sustainability',
                'Community',
                'Education'
              ].map((value) => (
                <div 
                  key={value}
                  className="flex items-center gap-2 p-3 rounded-lg
                    bg-emerald-50 dark:bg-emerald-900/30
                    border border-emerald-100 dark:border-emerald-800"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-800 dark:text-emerald-400 font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
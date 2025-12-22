"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';

// Default fallback data
const defaultData = {
  mission: {
    title: "Our Mission",
    content: "To empower African youth through sustainable environmental initiatives, fostering innovation and creating lasting positive impact on communities and ecosystems across the continent.",
    image: "/mission-vision.svg"
  },
  vision: {
    title: "Our Vision",
    content: "A thriving Africa where young leaders drive environmental sustainability, creating prosperous communities that live in harmony with nature, setting an example for global environmental stewardship."
  },
  values: ["Innovation", "Sustainability", "Community", "Education"],
  missionStats: [
    { value: "10+", label: "Years Experience" },
    { value: "50K+", label: "Lives Impacted" }
  ]
};

// Skeleton Loader Component
function MissionVisionSkeleton() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Skeleton */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 animate-pulse" />

          {/* Content Skeleton */}
          <div className="space-y-12">
            {/* Mission Skeleton */}
            <div className="space-y-4">
              <div className="h-10 bg-emerald-200 dark:bg-emerald-800 rounded-xl w-48 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
              </div>
            </div>

            {/* Vision Skeleton */}
            <div className="space-y-4">
              <div className="h-10 bg-emerald-200 dark:bg-emerald-800 rounded-xl w-40 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
              </div>
            </div>

            {/* Values Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MissionVision() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData(defaultData);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <MissionVisionSkeleton />;
  }

  const mission = data?.mission || defaultData.mission;
  const vision = data?.vision || defaultData.vision;
  const values = data?.values || defaultData.values;
  const missionStats = data?.missionStats || defaultData.missionStats;

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
          <div className="relative h-[500px] rounded-2xl overflow-hidden group">
            <Image
              src={mission.image || "/mission-vision.svg"}
              alt="Our Mission and Vision"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/30 to-transparent" />

            {/* Floating Stats */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-4">
              {missionStats.map((stat, index) => (
                <div key={index} className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-emerald-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Column */}
          <div className="space-y-10">
            {/* Mission Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 
                text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {mission.title}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {mission.content}
              </p>
            </div>

            {/* Vision Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 
                text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                {vision.title}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {vision.content}
              </p>
            </div>

            {/* Values Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Our Core Values</h3>
              <div className="grid grid-cols-2 gap-3">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 p-4 rounded-xl
                      bg-white dark:bg-gray-800/50
                      border border-emerald-100 dark:border-emerald-800
                      hover:border-emerald-300 dark:hover:border-emerald-600
                      hover:shadow-lg hover:shadow-emerald-500/10
                      transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 
                      group-hover:scale-125 transition-transform duration-300" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
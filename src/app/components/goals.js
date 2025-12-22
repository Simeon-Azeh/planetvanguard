"use client"
import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
  LightBulbIcon,
  GlobeAltIcon,
  UsersIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  HeartIcon,
  RocketLaunchIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// Icon mapping for dynamic goals
const iconMap = {
  LightBulbIcon,
  GlobeAltIcon,
  UsersIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  HeartIcon,
  RocketLaunchIcon,
  AcademicCapIcon
};

// Default fallback data
const defaultGoals = [
  {
    id: 1,
    title: "Environmental Education",
    description: "Educate 1 million youth on climate action by 2025",
    icon: "LightBulbIcon",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 2,
    title: "Community Impact",
    description: "Establish sustainable programs in 100 communities",
    icon: "UsersIcon",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 3,
    title: "Global Partnerships",
    description: "Build network of international environmental organizations",
    icon: "GlobeAltIcon",
    color: "from-teal-500 to-cyan-500"
  },
  {
    id: 4,
    title: "Carbon Reduction",
    description: "Reduce carbon emissions by 50% in target areas",
    icon: "ArrowTrendingDownIcon",
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: 5,
    title: "Innovation Hub",
    description: "Create platform for sustainable technology solutions",
    icon: "SparklesIcon",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: 6,
    title: "Youth Leadership",
    description: "Train 5000 environmental leaders by 2025",
    icon: "HeartIcon",
    color: "from-indigo-500 to-violet-500"
  }
];

const colorGradients = [
  "from-green-500 to-emerald-500",
  "from-emerald-500 to-teal-500",
  "from-teal-500 to-cyan-500",
  "from-cyan-500 to-blue-500",
  "from-blue-500 to-indigo-500",
  "from-indigo-500 to-violet-500"
];

// Skeleton Loader Component
function GoalsSkeleton() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-black">
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-emerald-200 dark:bg-emerald-800 rounded-xl w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full mx-auto animate-pulse" />
        </div>

        {/* Goals Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white dark:bg-black/50 border border-emerald-100 dark:border-emerald-800 animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Skeleton */}
              <div className="w-12 h-12 bg-emerald-200 dark:bg-emerald-800 rounded-xl mb-4" />
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const parallaxRef = useRef(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        parallaxRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchGoals = async () => {
    try {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().goals) {
        setGoals(docSnap.data().goals);
      } else {
        setGoals(defaultGoals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setGoals(defaultGoals);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GoalsSkeleton />;
  }

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-black">
      {/* Parallax Background with Grid Pattern */}
      <div
        ref={parallaxRef}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] dark:opacity-[0.1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 
            text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-4">
            <SparklesIcon className="w-4 h-4" />
            Strategic Objectives
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Goals</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ambitious targets driving our mission forward, creating lasting impact
            across Africa through sustainable environmental initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => {
            const IconComponent = iconMap[goal.icon] || SparklesIcon;
            const colorGradient = colorGradients[index % colorGradients.length];

            return (
              <div
                key={goal.id || index}
                className="group relative p-6 rounded-2xl 
                  bg-white dark:bg-gray-800/50 
                  border border-gray-200 dark:border-gray-700
                  hover:border-emerald-300 dark:hover:border-emerald-600
                  transition-all duration-300 transform hover:-translate-y-1
                  shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  backdrop-blur-sm"
              >
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                  bg-gradient-to-br ${colorGradient} transition-opacity duration-300`} />

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorGradient} 
                  flex items-center justify-center mb-5 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] 
                  transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3
                  group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {goal.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {goal.description}
                </p>

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {Math.floor(Math.random() * 40 + 60)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colorGradient} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
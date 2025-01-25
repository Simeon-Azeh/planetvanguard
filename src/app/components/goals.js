"use client"
import { useEffect, useRef } from 'react';
import { 
  LightBulbIcon, 
  GlobeAltIcon, 
  UsersIcon, 
 PaperAirplaneIcon,
  SparklesIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

const goals = [
  {
    id: 1,
    title: "Environmental Education",
    description: "Educate 1 million youth on climate action by 2025",
    icon: LightBulbIcon,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 2,
    title: "Community Impact",
    description: "Establish sustainable programs in 100 communities",
    icon: UsersIcon,
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 3,
    title: "Global Partnerships",
    description: "Build network of international environmental organizations",
    icon: GlobeAltIcon,
    color: "from-teal-500 to-cyan-500"
  },
  {
    id: 4,
    title: "Carbon Reduction",
    description: "Reduce carbon emissions by 50% in target areas",
    icon:  PaperAirplaneIcon,
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: 5,
    title: "Innovation Hub",
    description: "Create platform for sustainable technology solutions",
    icon: SparklesIcon,
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: 6,
    title: "Youth Leadership",
    description: "Train 5000 environmental leaders by 2025",
    icon: HeartIcon,
    color: "from-indigo-500 to-violet-500"
  }
];

export default function Goals() {
  const parallaxRef = useRef(null);

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
          <h2 className="text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">
            Our Goals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ambitious targets driving our mission forward, creating lasting impact 
            across Africa through sustainable environmental initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((goal) => (
            <div 
              key={goal.id}
              className="group relative p-6 rounded-2xl 
                bg-white dark:bg-black/50 
                border border-emerald-100 dark:border-emerald-800
                hover:border-emerald-300 dark:hover:border-emerald-600
                transition-all duration-300 transform hover:-translate-y-1
                shadow-lg hover:shadow-xl"
            >
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                bg-gradient-to-br ${goal.color} transition-opacity duration-300`} />
              
              <goal.icon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-4
                transform transition-transform duration-300 group-hover:scale-110" />
              
              <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-400 mb-2">
                {goal.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300">
                {goal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
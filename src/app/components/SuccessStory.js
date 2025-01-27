"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ChevronLeftIcon, 
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const stories = [
  {
    id: 1,
    title: "Solar Power Initiative",
    location: "Lagos, Nigeria",
    image: "/project1.jpg",
    description: "Implemented solar panels in 50+ homes, reducing carbon emissions by 40%",
    impact: "500+ lives improved",
    duration: "12 months",
    budget: "$150,000",
    team: "15 members",
    challenges: [
      "Limited infrastructure",
      "Technical training needs",
      "Weather conditions"
    ],
    solutions: [
      "Partnership with local technicians",
      "Community training programs",
      "Weather-resistant equipment"
    ],
    sustainability: [
      "40% carbon reduction",
      "Local maintenance team",
      "Renewable energy education"
    ],
    metrics: {
      homes: 50,
      carbonReduction: "40%",
      employmentCreated: 25,
      energySavings: "60%"
    }
  },
  // ... Update other stories with similar data structure
];
const BackButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="relative z-10 mb-6 inline-flex items-center gap-2 px-6 py-3 
        bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg 
        transition-all duration-300 hover:scale-105 shadow-lg
        hover:shadow-emerald-500/25 group"
    >
      <ChevronLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      <span>Back to Stories</span>
    </button>
  );

export default function SuccessStory() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  // ... existing timeLeft state and functions

  const TabButton = ({ name, current }) => (
    <button
      onClick={() => setActiveTab(name.toLowerCase())}
      className={`px-4 py-2 rounded-lg transition-all ${
        current === name.toLowerCase()
          ? 'bg-emerald-600 text-white'
          : 'hover:bg-emerald-50 dark:hover:bg-emerald-900'
      }`}
    >
      {name}
    </button>
  );

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl flex items-center gap-4">
      <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
        <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  if (selectedStory) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950" />
        <div className="absolute inset-0 bg-grid-lines opacity-[0.1]" />
        
        <BackButton onClick={() => setSelectedStory(null)} />

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8  backdrop-blur-sm relative">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            {selectedStory.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={MapPinIcon} title="Location" value={selectedStory.location} />
            <StatCard icon={ClockIcon} title="Duration" value={selectedStory.duration} />
            <StatCard icon={UserGroupIcon} title="Team Size" value={selectedStory.team} />
            <StatCard icon={CurrencyDollarIcon} title="Budget" value={selectedStory.budget} />
          </div>

          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
            <Image
              src={selectedStory.image}
              alt={selectedStory.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="md:flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <TabButton name="Overview" current={activeTab} />
            <TabButton name="Challenges" current={activeTab} />
            <TabButton name="Solutions" current={activeTab} />
            <TabButton name="Impact" current={activeTab} />
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <p>{selectedStory.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedStory.metrics).map(([key, value]) => (
                    <div key={key} className="bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-lg">
                      <h3 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-4">
                {selectedStory.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                    <span>{challenge}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className="space-y-4">
                {selectedStory.solutions.map((solution, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <LightBulbIcon className="w-5 h-5 text-emerald-500" />
                    <span>{solution}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-4">
                {selectedStory.sustainability.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950" />
        <div className="absolute inset-0 bg-grid-lines opacity-[0.1]" />
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-600 to-green-500 
        dark:from-emerald-400 dark:to-green-300 bg-clip-text text-transparent">Success Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map(story => (
          <div key={story.id} 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden 
              border border-emerald-100 dark:border-emerald-800 transition-all duration-300 
              hover:scale-[1.02] cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="aspect-video relative">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{story.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{story.description}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{story.impact}</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
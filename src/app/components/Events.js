"use client"
import React, { useState } from 'react';
import Header from '../components/header';
import Calendar from 'react-calendar';

import { CalendarIcon, MapPinIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const events = [
  {
    id: 1,
    title: 'Climate Action Summit 2024',
    date: new Date(2024, 3, 15),
    time: '09:00 AM - 05:00 PM',
    location: 'Virtual Event',
    category: 'summit',
    description: 'Join global leaders in discussing climate action strategies.',
    registrationLink: '/register/summit-2024'
  },
  {
    id: 2,
    title: 'Sustainable Living Workshop',
    date: new Date(2024, 3, 20),
    time: '02:00 PM - 04:00 PM',
    location: 'Community Center',
    category: 'workshop',
    description: 'Learn practical tips for sustainable living.',
    registrationLink: '/register/workshop-2024'
  },
  // Add more events as needed
];

function Events() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const highlightedDates = events.map(event => event.date);

  return (
    <div className="relative bg-gradient-to-b from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
        
     
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950" />
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
       
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className=" rounded-2xl p-6 z-10">
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate}
              tileClassName={({ date }) => {
                if (highlightedDates.some(dDate => 
                  dDate.getDate() === date.getDate() &&
                  dDate.getMonth() === date.getMonth() &&
                  dDate.getFullYear() === date.getFullYear()
                )) {
                  return 'bg-emerald-100 dark:bg-emerald-900 rounded-full';
                }
              }}
              className="w-full border-none shadow-none"
            />
          </div>

          {/* Events List Section */}
          <div className="space-y-6">
          <h1 className="text-4xl font-bold text-center mb-12
        bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 
        dark:from-emerald-400 dark:via-green-300 dark:to-emerald-200
        bg-clip-text text-transparent
        animate-gradient-x"
      >
        Upcoming Events
      </h1>
      
            {events.map(event => (
              <div 
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6
                  transform transition-all duration-300 hover:scale-102 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        {event.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <ClockIcon className="h-5 w-5 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        {event.location}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                      {event.description}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${event.category === 'summit' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {event.category}
                  </span>
                </div>

                <button 
                  className="mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded-lg
                    hover:bg-emerald-700 transition-colors duration-300
                    flex items-center justify-center gap-2"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Events;
"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import EventDetails from './EventDetails';
import { XMarkIcon, PhotoIcon, UsersIcon, FireIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const pastEvents = [
  {
    id: 3,
    title: 'Urban Tree Planting Drive',
    image: '/project3.jpg',
    gallery: [
      '/project3.jpg',
      '/tree-planting-1.jpg',
      '/tree-planting-2.jpg',
    ],
    category: 'environment',
    date: 'March 2024',
    location: 'Central Park, NY',
    impact: {
      participants: 150,
      treesPlanted: 300,
      wasteCollected: '200kg',
    },
    description: 'A collaborative effort to enhance urban greenery by planting trees in Central Park.',
    fullDescription: 'Volunteers gathered to plant a variety of native trees, contributing to the city\'s ecological health and providing a greener space for residents.',
    googleDriveLink: 'https://drive.google.com/...',
    organizers: ['Alice Johnson', 'Robert Brown'],
    sponsors: ['Green Earth Initiative', 'City Council'],
  },
  {
    id: 4,
    title: 'Community Recycling Workshop',
    image: '/project4.jpg',
    gallery: [
      '/project4.jpg',
      '/recycling-workshop-1.jpg',
      '/recycling-workshop-2.jpg',
    ],
    category: 'education',
    date: 'June 2024',
    location: 'Downtown Community Center, LA',
    impact: {
      participants: 80,
      treesPlanted: 0,
      wasteCollected: '100kg',
    },
    description: 'An educational workshop focused on effective recycling practices and waste reduction.',
    fullDescription: 'Attendees learned about the importance of recycling, how to properly sort recyclables, and ways to reduce household waste through interactive sessions.',
    googleDriveLink: 'https://drive.google.com/...',
    organizers: ['Emily Davis', 'Michael Lee'],
    sponsors: ['EcoLife Foundation', 'Waste Management Inc.'],
  },
  {
    id: 5,
    title: 'River Cleanup Expedition',
    image: '/project5.jpg',
    gallery: [
      '/project5.jpg',
      '/river-cleanup-1.jpg',
      '/river-cleanup-2.jpg',
    ],
    category: 'conservation',
    date: 'September 2024',
    location: 'Green River, KY',
    impact: {
      participants: 120,
      treesPlanted: 0,
      wasteCollected: '750kg',
    },
    description: 'A mission to clean and restore the natural beauty of Green River through community effort.',
    fullDescription: 'Volunteers navigated the riverbanks and waters, removing debris and pollutants to improve the habitat for wildlife and ensure cleaner water for the community.',
    googleDriveLink: 'https://drive.google.com/...',
    organizers: ['Sarah Wilson', 'David Martinez'],
    sponsors: ['River Guardians', 'Outdoor Enthusiasts Club'],
  },
  {
    id: 6,
    title: 'Wildlife Habitat Restoration',
    image: '/project6.jpg',
    gallery: [
      '/project6.jpg',
      '/habitat-restoration-1.jpg',
      '/habitat-restoration-2.jpg',
    ],
    category: 'conservation',
    date: 'November 2024',
    location: 'Blue Ridge Mountains, VA',
    impact: {
      participants: 200,
      treesPlanted: 500,
      wasteCollected: '300kg',
    },
    description: 'An initiative aimed at restoring habitats for native wildlife in the Blue Ridge Mountains.',
    fullDescription: 'Participants engaged in planting native flora, removing invasive species, and setting up shelters to support the local fauna, promoting biodiversity in the region.',
    googleDriveLink: 'https://drive.google.com/...',
    organizers: ['Laura Thompson', 'James Anderson'],
    sponsors: ['Wildlife Conservation Society', 'Nature Enthusiasts Group'],
  },
];

export default function PastEvents() {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (selectedEvent) {
    return <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
  }

  return (
    <section className="py-16 relative z-10"> 
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950" />
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />

      <h1 className="text-4xl font-bold text-center mb-12 relative z-20 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 dark:from-emerald-400 dark:via-green-300 dark:to-emerald-200 bg-clip-text text-transparent animate-gradient-x">
        Past Events
      </h1>
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 mb-16">
        {pastEvents.map(event => (
          <div key={event.id} 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
              rounded-2xl overflow-hidden border border-emerald-100 
              dark:border-emerald-800 transition-all duration-300 
              hover:scale-[1.02] cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="aspect-video relative">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                  {event.date}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {event.description}
              </p>
              
              {/* Impact Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                <div className="text-center">
                  <UsersIcon className="h-6 w-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">Participants</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {event.impact.participants}
                  </p>
                </div>
                <div className="text-center">
                  <FireIcon className="h-6 w-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">Trees Planted</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {event.impact.treesPlanted}
                  </p>
                </div>
                <div className="text-center">
                  <HeartIcon className="h-6 w-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">Waste Collected</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {event.impact.wasteCollected}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href={'/gallery'}
          
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <PhotoIcon className="w-6 h-6" />
          View Full Events Gallery
        </Link>
      </div>
    
    </section>
  );
}
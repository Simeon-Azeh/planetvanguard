"use client"
import { useState } from 'react';
import Image from 'next/image';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,  
  BuildingOffice2Icon, 
  UserGroupIcon,
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline';

export default function EventDetails({ event, onBack }) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 
        text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Back to Events
      </button>

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 
        backdrop-blur-sm border border-emerald-50 dark:border-emerald-900">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-500 
          dark:from-emerald-400 dark:to-green-300 bg-clip-text text-transparent">{event.title}</h1>
        
        {/* Image Carousel */}
        <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={event.gallery[currentImage]}
            alt={`${event.title} - Image ${currentImage + 1}`}
            fill
            className="object-cover transition-transform duration-500"
          />
          <button
            onClick={() => setCurrentImage(prev => prev === 0 ? event.gallery.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full
              hover:bg-black/70 transition-all duration-300"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentImage(prev => prev === event.gallery.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full
              hover:bg-black/70 transition-all duration-300"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {event.gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                  ${currentImage === index ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                About This Event
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {event.fullDescription}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Event Details</h3>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{event.date}</span>
                </li>
                <li className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <MapPinIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{event.location}</span>
                </li>
                <li className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <UsersIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{event.impact.participants} Participants</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <UserGroupIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Organizers
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                {event.organizers.map((organizer, index) => (
                  <li key={index} className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                    {organizer}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <BuildingOffice2Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Sponsors
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                {event.sponsors.map((sponsor, index) => (
                  <li key={index} className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                    {sponsor}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Impact & Results
              </h2>
              {/* Add your Impact Stats Component here */}
            </div>
            
            <div className="mt-8">
              <a
                href={event.googleDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white 
                  rounded-lg hover:bg-emerald-700 transition-all duration-300 transform 
                  hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              >
                <CloudArrowDownIcon className="w-5 h-5 transition-transform duration-300 
                  group-hover:translate-y-1" />
                <span>Download Event Photos</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
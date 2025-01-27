"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function EventDetails({ event }) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        
        {/* Image Carousel */}
        <div className="relative aspect-video mb-8">
          <Image
            src={event.gallery[currentImage]}
            alt={`${event.title} - Image ${currentImage + 1}`}
            fill
            className="object-cover rounded-xl"
          />
          <button
            onClick={() => setCurrentImage(prev => prev === 0 ? event.gallery.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentImage(prev => prev === event.gallery.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-600 dark:text-gray-300">{event.fullDescription}</p>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Event Details</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>📅 Date: {event.date}</li>
                <li>📍 Location: {event.location}</li>
                <li>👥 Participants: {event.impact.participants}</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Impact & Results</h2>
            {/* Impact Stats Component */}
            
            <div className="mt-8">
              <a
                href={event.googleDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Download Event Photos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
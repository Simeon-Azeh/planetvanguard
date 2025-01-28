"use client"
import React, { useState } from 'react';
import { PlayIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const galleryItems = [
  {
    id: 1,
    type: 'image',
    url: '/project3.jpg',
    title: 'Tree Planting Initiative',
    category: 'Events'
  },
  {
    id: 2,
    type: 'video',
    thumbnailUrl: '/project2.jpg',
    videoId: 'your-youtube-id-1',
    title: 'Climate Summit 2024',
    category: 'Summits',
    duration: '2:45'
  },
  // Add more items...
];

const ImageCard = ({ item, onClick }) => (
  <div 
    onClick={onClick}
    className="relative group cursor-pointer overflow-hidden rounded-xl"
  >
    <img 
      src={item.url} 
      alt={item.title}
      className="w-full h-64 object-cover transition-transform duration-500
        group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent
      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-300">{item.category}</p>
      </div>
    </div>
  </div>
);

const VideoCard = ({ item }) => (
    <div className="relative group cursor-pointer overflow-hidden rounded-xl">
      <img 
        src={item.thumbnailUrl} 
        alt={item.title}
        className="w-full h-64 object-cover transition-transform duration-500
          group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-white text-sm bg-black/50 px-2 py-1 rounded-full">
          {item.duration}
        </span>
      </div>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center
        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayIcon className="w-16 h-16 text-white" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-300">{item.category}</p>
        </div>
      </div>
    </div>
  );

const ImageLightbox = ({ image, onClose }) => (
  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-white hover:text-gray-300"
    >
      <XMarkIcon className="w-6 h-6" />
    </button>
    <img 
      src={image.url} 
      alt={image.title}
      className="max-w-full max-h-[90vh] object-contain"
    />
  </div>
);

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];
  
  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white 
      dark:from-green-900 dark:to-gray-800 relative py-24 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
       

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap
                ${activeCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/70 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id}>
              {item.type === 'image' ? (
                <ImageCard 
                  item={item} 
                  onClick={() => setSelectedImage(item)}
                />
              ) : (
                <VideoCard item={item} />
              )}
            </div>
          ))}
        </div>
       
      </div>

      {selectedImage && (
        <ImageLightbox 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
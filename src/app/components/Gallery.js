"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

const VideoCard = ({ item }) => {
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(item.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : item.url;

  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-xl">
      <img 
        src={thumbnailUrl} 
        alt={item.title}
        className="w-full h-64 object-cover transition-transform duration-500
          group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-300">{item.category}</p>
        </div>
      </div>
    </div>
  );
};

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
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGalleryItems(itemsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(galleryItems.map(item => item.category).filter(Boolean))];
  
  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-white dark:from-green-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white 
      dark:from-green-900 dark:to-gray-800 relative py-24 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-emerald-800 dark:text-emerald-400 md:text-4xl">
            Our Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Moments from our journey towards a sustainable future
          </p>
        </div>

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

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="text-6xl mb-4 animate-bounce">📸</div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No gallery items yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back soon for amazing photos and videos!
            </p>
          </div>
        ) : (
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
        )}
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
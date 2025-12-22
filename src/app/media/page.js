"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Header from '../components/header';
import Footer from '../components/footer';
import {
  PhotoIcon,
  VideoCameraIcon,
  PlayIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  FolderIcon,
  SparklesIcon,
  CameraIcon,
  FilmIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function MediaPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [likedItems, setLikedItems] = useState([]);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  useEffect(() => {
    fetchGalleryItems();
    const saved = localStorage.getItem('likedGalleryItems');
    if (saved) setLikedItems(JSON.parse(saved));
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
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (itemId) => {
    setLikedItems(prev => {
      const newLiked = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem('likedGalleryItems', JSON.stringify(newLiked));
      return newLiked;
    });
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = ['all', ...new Set(galleryItems.map(item => item.category).filter(Boolean))];

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesType = activeType === 'all' || item.type === activeType;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const stats = {
    total: galleryItems.length,
    images: galleryItems.filter(i => i.type === 'image').length,
    videos: galleryItems.filter(i => i.type === 'video').length
  };

  const openLightbox = (item, index) => {
    setSelectedItem(item);
    setCurrentLightboxIndex(index);
  };

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next'
      ? (currentLightboxIndex + 1) % filteredItems.length
      : (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentLightboxIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/50 dark:via-indigo-950/50 dark:to-blue-950/50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-300/30 to-indigo-400/20 blur-3xl" />
            <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-300/30 to-purple-400/20 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
                <CameraIcon className="w-5 h-5" />
                <span>Media Gallery</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Our </span>
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Gallery
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Explore moments from our journey towards a sustainable future. Photos and videos
                from our events, projects, and community initiatives across Africa.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-white dark:bg-gray-900 shadow-lg">
                    <PhotoIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.images}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Photos</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-white dark:bg-gray-900 shadow-lg">
                    <VideoCameraIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.videos}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Videos</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-white dark:bg-gray-900 shadow-lg">
                    <FolderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length - 1}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b border-gray-100 dark:border-gray-800 sticky top-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Type Filter */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <button
                    onClick={() => setActiveType('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === 'all'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveType('image')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === 'image'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Photos
                  </button>
                  <button
                    onClick={() => setActiveType('video')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === 'video'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    <VideoCameraIcon className="w-4 h-4" />
                    Videos
                  </button>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'masonry'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 4a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              <FunnelIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                    }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-square" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <CameraIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No media found' : 'No media yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Check back soon for amazing photos and videos!'}
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                  : 'columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'
              }>
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 cursor-pointer ${viewMode === 'masonry' ? 'break-inside-avoid mb-4' : 'aspect-square'
                      }`}
                    onClick={() => openLightbox(item, index)}
                  >
                    {item.type === 'video' ? (
                      <>
                        <img
                          src={
                            getYouTubeId(item.url)
                              ? `https://img.youtube.com/vi/${getYouTubeId(item.url)}/maxresdefault.jpg`
                              : item.thumbnail || item.url
                          }
                          alt={item.title}
                          className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${viewMode === 'masonry' ? 'h-auto' : 'h-full'
                            }`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayIcon className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${viewMode === 'masonry' ? 'h-auto' : 'h-full'
                          }`}
                      />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.type === 'video'
                              ? 'bg-indigo-500/80 text-white'
                              : 'bg-purple-500/80 text-white'
                            }`}>
                            {item.type === 'video' ? (
                              <span className="flex items-center gap-1">
                                <FilmIcon className="w-3 h-3" />
                                Video
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <PhotoIcon className="w-3 h-3" />
                                Photo
                              </span>
                            )}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(item.id);
                            }}
                            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            {likedItems.includes(item.id) ? (
                              <HeartSolidIcon className="w-4 h-4 text-rose-500" />
                            ) : (
                              <HeartIcon className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>
                        <h3 className="text-white font-semibold text-sm truncate">
                          {item.title}
                        </h3>
                        {item.category && (
                          <p className="text-white/70 text-xs truncate">
                            {item.category}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(item, index);
                        }}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Count */}
            {!loading && filteredItems.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredItems.length} of {galleryItems.length} items
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <SparklesIcon className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Share Your Moments
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Have photos or videos from our events? We'd love to feature them in our gallery.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <CameraIcon className="w-5 h-5" />
              Submit Your Media
            </a>
          </div>
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          {/* Navigation */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Content */}
          <div className="w-full max-w-5xl mx-4">
            {selectedItem.type === 'video' ? (
              <div className="aspect-video rounded-xl overflow-hidden">
                {getYouTubeId(selectedItem.url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedItem.url)}?autoplay=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={selectedItem.url} controls autoPlay className="w-full h-full" />
                )}
              </div>
            ) : (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="max-w-full max-h-[80vh] mx-auto object-contain rounded-xl"
              />
            )}

            {/* Info Bar */}
            <div className="mt-4 flex items-center justify-between text-white">
              <div>
                <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/70">
                  {selectedItem.category && (
                    <span className="flex items-center gap-1">
                      <FolderIcon className="w-4 h-4" />
                      {selectedItem.category}
                    </span>
                  )}
                  {selectedItem.createdAt && (
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(selectedItem.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLike(selectedItem.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {likedItems.includes(selectedItem.id) ? (
                    <HeartSolidIcon className="w-5 h-5 text-rose-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span className="text-sm">Like</span>
                </button>
                <button
                  onClick={() => navigator.share?.({ title: selectedItem.title, url: selectedItem.url })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ShareIcon className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Counter */}
            <div className="mt-4 text-center text-white/50 text-sm">
              {currentLightboxIndex + 1} / {filteredItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

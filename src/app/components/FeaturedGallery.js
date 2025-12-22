"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Link from 'next/link';
import { PhotoIcon, ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function FeaturedGallery() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = async () => {
        try {
            const q = query(
                collection(db, 'gallery'),
                orderBy('createdAt', 'desc'),
                limit(6)
            );
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

    if (loading) {
        return (
            <section className="relative py-24 overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/30 dark:to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (galleryItems.length === 0) {
        return null; // Don't show section if no gallery items
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/30 dark:to-black">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
            <div className="absolute -right-64 top-1/2 w-96 h-96 rounded-full 
        bg-purple-300/20 blur-3xl dark:bg-purple-900/20 pointer-events-none" />
            <div className="absolute -left-64 top-1/2 w-96 h-96 rounded-full 
        bg-pink-300/20 blur-3xl dark:bg-pink-900/20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Our Impact in{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                                Action
                            </span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                            See the real-world impact of our initiatives through photos and videos from the field.
                        </p>
                    </div>
                    <Link
                        href="/media"
                        className="inline-flex items-center gap-2 px-6 py-3 mt-4 md:mt-0
              bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg 
              hover:from-purple-700 hover:to-pink-600
              transition-all duration-300 shadow-lg hover:shadow-xl
              transform hover:scale-105 font-semibold group"
                    >
                        View Full Gallery
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {galleryItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`group relative overflow-hidden rounded-2xl
                ${index === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''}
                ${index === 0 ? 'h-64 md:h-full' : 'h-32 md:h-48'}
                cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300
                transform hover:scale-[1.02]`}
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: 'fadeIn 0.5s ease-out forwards'
                            }}
                        >
                            {/* Image/Video Thumbnail */}
                            <img
                                src={item.type === 'video' && item.url?.includes('youtube')
                                    ? `https://img.youtube.com/vi/${item.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/maxresdefault.jpg`
                                    : item.url
                                }
                                alt={item.title || 'Gallery item'}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                                {/* Play Icon for Videos */}
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm
                      flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                            <PlayIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                    {item.title && (
                                        <h3 className={`text-white font-semibold mb-1
                      ${index === 0 ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
                                            {item.title}
                                        </h3>
                                    )}
                                    {item.category && (
                                        <span className="inline-block px-2 py-1 text-xs bg-white/20 backdrop-blur-sm 
                      text-white rounded-full">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Category Badge (Always Visible) */}
                            {item.type && (
                                <div className="absolute top-3 right-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold 
                    bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full
                    ${item.type === 'video' ? 'text-purple-600' : 'text-pink-600'}`}>
                                        {item.type === 'video' ? (
                                            <PlayIcon className="w-3 h-3" />
                                        ) : (
                                            <PhotoIcon className="w-3 h-3" />
                                        )}
                                        {item.type}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Stats or Additional Info */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg
            backdrop-blur-sm border border-purple-100 dark:border-purple-900/30">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            {galleryItems.filter(i => i.type === 'image').length}+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Photos</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg
            backdrop-blur-sm border border-purple-100 dark:border-purple-900/30">
                        <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                            {galleryItems.filter(i => i.type === 'video').length}+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Videos</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg
            backdrop-blur-sm border border-purple-100 dark:border-purple-900/30">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            {[...new Set(galleryItems.map(i => i.category))].length}+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg
            backdrop-blur-sm border border-purple-100 dark:border-purple-900/30">
                        <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                            {galleryItems.length}+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total Items</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

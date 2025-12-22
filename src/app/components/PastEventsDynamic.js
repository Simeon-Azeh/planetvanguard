"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';
import Link from 'next/link';
import {
    XMarkIcon,
    PhotoIcon,
    UsersIcon,
    FireIcon,
    HeartIcon,
    CalendarIcon,
    MapPinIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

// Skeleton Loader
function PastEventsSkeleton() {
    return (
        <section className="py-20 relative bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-48 mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-80 mx-auto animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                            <div className="p-6 space-y-4">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-full" />
                                <div className="grid grid-cols-3 gap-2">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function PastEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchPastEvents();
    }, []);

    const fetchPastEvents = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const q = query(
                collection(db, 'events'),
                where('date', '<', today),
                orderBy('date', 'desc')
            );
            const snapshot = await getDocs(q);
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching past events:', error);
            // Fallback: fetch all events and filter client-side
            try {
                const q = query(collection(db, 'events'), orderBy('date', 'desc'));
                const snapshot = await getDocs(q);
                const today = new Date().toISOString().split('T')[0];
                const eventsData = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(event => event.date < today);
                setEvents(eventsData);
            } catch (fallbackError) {
                console.error('Fallback fetch failed:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const openGallery = (event, index = 0) => {
        setSelectedEvent(event);
        setCurrentImageIndex(index);
        setShowGallery(true);
    };

    const closeGallery = () => {
        setShowGallery(false);
        setSelectedEvent(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (selectedEvent?.gallery) {
            setCurrentImageIndex((prev) =>
                prev === selectedEvent.gallery.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedEvent?.gallery) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedEvent.gallery.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
        return <PastEventsSkeleton />;
    }

    if (events.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Past Events Yet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Events will appear here once they've concluded.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 relative bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-lines opacity-[0.03] dark:opacity-[0.02]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4
                        bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 
                        dark:from-emerald-400 dark:via-green-300 dark:to-emerald-200
                        bg-clip-text text-transparent">
                        Past Events
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore our previous events and see the impact we've made together
                    </p>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
                                border border-gray-100 dark:border-gray-700
                                hover:shadow-xl hover:shadow-emerald-500/10
                                transition-all duration-300"
                        >
                            {/* Event Image */}
                            <div className="relative h-48 overflow-hidden cursor-pointer"
                                onClick={() => event.gallery?.length > 0 && openGallery(event)}>
                                {event.image ? (
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                        <CalendarIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Gallery indicator */}
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1
                                        bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                                        <PhotoIcon className="w-4 h-4" />
                                        {event.gallery.length}
                                    </div>
                                )}

                                {/* Date Badge */}
                                <div className="absolute bottom-4 left-4 px-3 py-1
                                    bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                                    text-gray-900 dark:text-white text-sm font-medium rounded-full">
                                    {formatDate(event.date)}
                                </div>
                            </div>

                            {/* Event Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                    {event.title}
                                </h3>

                                {event.location && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <MapPinIcon className="w-4 h-4 text-emerald-600" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                )}

                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                    {event.description}
                                </p>

                                {/* Impact Stats */}
                                {event.impact && (
                                    <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                        {event.impact.participants > 0 && (
                                            <div className="text-center">
                                                <UsersIcon className="h-5 w-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Participants</p>
                                                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                                    {event.impact.participants}
                                                </p>
                                            </div>
                                        )}
                                        {event.impact.treesPlanted > 0 && (
                                            <div className="text-center">
                                                <FireIcon className="h-5 w-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Trees</p>
                                                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                                    {event.impact.treesPlanted}
                                                </p>
                                            </div>
                                        )}
                                        {event.impact.wasteCollected && (
                                            <div className="text-center">
                                                <HeartIcon className="h-5 w-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Waste</p>
                                                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                                    {event.impact.wasteCollected}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* View Details Link */}
                                {event.googleDriveLink && (
                                    <Link
                                        href={event.googleDriveLink}
                                        target="_blank"
                                        className="mt-4 flex items-center justify-center gap-2 w-full py-2
                                            text-emerald-600 dark:text-emerald-400 hover:text-emerald-700
                                            font-medium text-sm transition-colors"
                                    >
                                        <PhotoIcon className="w-4 h-4" />
                                        View Full Gallery
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Gallery Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/media"
                        className="inline-flex items-center gap-2 px-8 py-4 
                            bg-emerald-600 hover:bg-emerald-700 text-white 
                            rounded-xl font-semibold transition-all duration-300 
                            transform hover:scale-105 shadow-lg shadow-emerald-500/20"
                    >
                        <PhotoIcon className="w-5 h-5" />
                        View Full Events Gallery
                    </Link>
                </div>
            </div>

            {/* Image Gallery Modal */}
            {showGallery && selectedEvent && selectedEvent.gallery && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <button
                        onClick={closeGallery}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-8 h-8" />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>

                    <div className="relative max-w-4xl w-full aspect-video">
                        <Image
                            src={selectedEvent.gallery[currentImageIndex]}
                            alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2
                        bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                        {currentImageIndex + 1} / {selectedEvent.gallery.length}
                    </div>
                </div>
            )}
        </section>
    );
}

"use client"
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Link from 'next/link';
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    ArrowRightIcon,
    UserGroupIcon,
    SparklesIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function FeaturedEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const q = query(
                collection(db, 'events'),
                orderBy('date', 'asc'),
                limit(6)
            );
            const snapshot = await getDocs(q);
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter for upcoming events
            const now = new Date();
            const upcomingEvents = eventsData.filter(event => {
                const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
                return eventDate >= now;
            });

            setEvents(upcomingEvents.slice(0, 4));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const eventDate = date.toDate ? date.toDate() : new Date(date);
        return eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (date) => {
        if (!date) return '';
        const eventDate = date.toDate ? date.toDate() : new Date(date);
        return eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDateParts = (date) => {
        if (!date) return { day: '', month: '', year: '' };
        const eventDate = date.toDate ? date.toDate() : new Date(date);
        return {
            day: eventDate.getDate(),
            month: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            year: eventDate.getFullYear()
        };
    };

    const getDaysUntil = (date) => {
        if (!date) return null;
        const eventDate = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffTime = eventDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const scrollToCard = (direction) => {
        if (scrollContainerRef.current) {
            const cardWidth = 340;
            const newIndex = direction === 'left'
                ? Math.max(0, activeIndex - 1)
                : Math.min(events.length - 1, activeIndex + 1);
            setActiveIndex(newIndex);
            scrollContainerRef.current.scrollTo({
                left: newIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-teal-50/50 to-white dark:from-gray-950 dark:via-teal-950/20 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-teal-200 dark:border-teal-800 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading upcoming events...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-teal-50/50 to-white dark:from-gray-950 dark:via-teal-950/20 dark:to-gray-950">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full 
                    bg-gradient-to-br from-teal-300/30 to-cyan-400/20 blur-3xl dark:from-teal-800/20 dark:to-cyan-900/10" />
                <div className="absolute -left-32 top-1/2 w-80 h-80 rounded-full 
                    bg-gradient-to-tr from-emerald-300/20 to-teal-300/30 blur-3xl dark:from-emerald-900/10 dark:to-teal-800/20" />
                <div className="absolute right-1/4 bottom-0 w-64 h-64 rounded-full 
                    bg-gradient-to-tl from-cyan-300/20 to-teal-200/30 blur-3xl dark:from-cyan-900/10 dark:to-teal-800/10" />
            </div>

            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Enhanced Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 
                            text-sm font-medium mb-4">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Don't Miss Out</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-gray-900 dark:text-white">Upcoming </span>
                            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                Events
                            </span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            Join us in making a difference. Participate in our upcoming events,
                            workshops, and community initiatives for environmental change.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Navigation Arrows for mobile/tablet */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                onClick={() => scrollToCard('left')}
                                disabled={activeIndex === 0}
                                className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg 
                                    hover:shadow-xl transition-all duration-300 disabled:opacity-50
                                    disabled:cursor-not-allowed border border-gray-100 dark:border-gray-700"
                            >
                                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={() => scrollToCard('right')}
                                disabled={activeIndex === events.length - 1}
                                className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg 
                                    hover:shadow-xl transition-all duration-300 disabled:opacity-50
                                    disabled:cursor-not-allowed border border-gray-100 dark:border-gray-700"
                            >
                                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>

                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 px-6 py-3.5
                                bg-gradient-to-r from-teal-600 to-cyan-600 
                                hover:from-teal-700 hover:to-cyan-700
                                text-white rounded-xl transition-all duration-300 
                                shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30
                                transform hover:scale-105 hover:-translate-y-0.5 
                                font-semibold group"
                        >
                            View All Events
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Events Grid/Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-6 
                        overflow-x-auto lg:overflow-visible pb-4 lg:pb-0
                        snap-x snap-mandatory lg:snap-none
                        scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {events.map((event, index) => {
                        const dateParts = getDateParts(event.date);
                        const daysUntil = getDaysUntil(event.date);

                        return (
                            <Link
                                key={event.id}
                                href={`/events/${event.id}`}
                                className="group flex-shrink-0 w-[320px] lg:w-auto snap-center
                                    bg-white dark:bg-gray-900/80 rounded-2xl overflow-hidden
                                    shadow-lg hover:shadow-2xl transition-all duration-500
                                    transform hover:-translate-y-2 backdrop-blur-sm
                                    border border-gray-100 dark:border-gray-800
                                    hover:border-teal-200 dark:hover:border-teal-800
                                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                            >
                                {/* Event Image */}
                                <div className="relative h-44 overflow-hidden">
                                    {event.image ? (
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 
                                            flex items-center justify-center">
                                            <CalendarIcon className="w-16 h-16 text-white/50" />
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    {/* Date Badge - Floating */}
                                    <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 rounded-xl 
                                        px-3 py-2 shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 leading-none">
                                                {dateParts.day}
                                            </div>
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                {dateParts.month}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Days Until Badge */}
                                    {daysUntil !== null && daysUntil <= 7 && daysUntil > 0 && (
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full 
                                            bg-gradient-to-r from-orange-500 to-red-500 
                                            text-white text-xs font-bold shadow-lg
                                            animate-pulse">
                                            {daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days left`}
                                        </div>
                                    )}

                                    {/* Category Badge - Bottom */}
                                    {event.category && (
                                        <div className="absolute bottom-4 left-4">
                                            <span className="inline-block px-3 py-1.5 text-xs font-semibold 
                                                text-white bg-white/20 backdrop-blur-md rounded-full 
                                                border border-white/30">
                                                {event.category}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Event Content */}
                                <div className="p-5">
                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 
                                        group-hover:text-teal-600 dark:group-hover:text-teal-400 
                                        transition-colors line-clamp-2 leading-tight">
                                        {event.title}
                                    </h3>

                                    {/* Event Details */}
                                    <div className="space-y-2.5 mb-4">
                                        {/* Time */}
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 
                                                flex items-center justify-center mr-3 flex-shrink-0">
                                                <ClockIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            <span className="font-medium">{formatTime(event.date)}</span>
                                        </div>

                                        {/* Location */}
                                        {event.location && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 
                                                    flex items-center justify-center mr-3 flex-shrink-0">
                                                    <MapPinIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                                </div>
                                                <span className="truncate font-medium">{event.location}</span>
                                            </div>
                                        )}

                                        {/* Attendees */}
                                        {event.maxAttendees && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 
                                                    flex items-center justify-center mr-3 flex-shrink-0">
                                                    <UserGroupIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-medium">
                                                        {event.currentAttendees || 0} / {event.maxAttendees}
                                                    </span>
                                                    {/* Progress bar */}
                                                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(100, ((event.currentAttendees || 0) / event.maxAttendees) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Details Link */}
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <span className="inline-flex items-center text-teal-600 dark:text-teal-400 
                                            font-semibold text-sm group-hover:gap-2 transition-all">
                                            View Details
                                            <ArrowRightIcon className="w-4 h-4 ml-1 opacity-0 -translate-x-2 
                                                group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Pagination Dots (Mobile) */}
                <div className="flex justify-center gap-2 mt-6 lg:hidden">
                    {events.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveIndex(index);
                                scrollContainerRef.current?.scrollTo({
                                    left: index * 340,
                                    behavior: 'smooth'
                                });
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                                ${activeIndex === index
                                    ? 'w-8 bg-teal-600 dark:bg-teal-400'
                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-teal-300 dark:hover:bg-teal-700'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

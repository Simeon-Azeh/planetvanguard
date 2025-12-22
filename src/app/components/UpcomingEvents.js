"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    UserGroupIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    TicketIcon,
    ArrowRightIcon,
    GlobeAltIcon,
    BuildingOfficeIcon,
    LinkIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

// Skeleton Loader
function UpcomingEventsSkeleton() {
    return (
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-64 mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                            <div className="p-6 space-y-4">
                                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                                <div className="h-10 bg-emerald-200 dark:bg-emerald-800 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function UpcomingEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrationForm, setRegistrationForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        dietaryRequirements: '',
        specialNeeds: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [checkingEmail, setCheckingEmail] = useState(false);

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    const fetchUpcomingEvents = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const q = query(
                collection(db, 'events'),
                where('date', '>=', today),
                orderBy('date', 'asc')
            );
            const snapshot = await getDocs(q);
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
            // Fallback: fetch all events and filter client-side
            try {
                const q = query(collection(db, 'events'), orderBy('date', 'desc'));
                const snapshot = await getDocs(q);
                const today = new Date().toISOString().split('T')[0];
                const eventsData = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(event => event.date >= today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(eventsData);
            } catch (fallbackError) {
                console.error('Fallback fetch failed:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const isRegistrationOpen = (event) => {
        if (!event.registrationDeadline) return true;
        const deadline = new Date(event.registrationDeadline);
        return new Date() <= deadline;
    };

    const hasCapacity = (event) => {
        // If capacity is not set or is undefined, allow unlimited registrations
        if (event.capacity === undefined || event.capacity === null || event.capacity === '') return true;
        return event.capacity > 0;
    };

    const canRegister = (event) => {
        return isRegistrationOpen(event) && hasCapacity(event);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCardClick = (event) => {
        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const handleRegisterClick = (event, e) => {
        if (e) e.stopPropagation();
        setSelectedEvent(event);
        setShowRegistrationModal(true);
        setSubmitSuccess(false);
        setSubmitError('');
    };

    const checkDuplicateEmail = async (email, eventId) => {
        try {
            const q = query(
                collection(db, 'eventRegistrations'),
                where('eventId', '==', eventId),
                where('email', '==', email.toLowerCase().trim())
            );
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            console.error('Error checking duplicate email:', error);
            return false;
        }
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');
        setCheckingEmail(true);

        try {
            // Check for duplicate email registration
            const isDuplicate = await checkDuplicateEmail(registrationForm.email, selectedEvent.id);
            setCheckingEmail(false);

            if (isDuplicate) {
                setSubmitError('This email has already been registered for this event.');
                setSubmitting(false);
                return;
            }

            // Check if there's still capacity
            if (selectedEvent.capacity !== undefined && selectedEvent.capacity !== null && selectedEvent.capacity <= 0) {
                setSubmitError('Sorry, this event is now full.');
                setSubmitting(false);
                return;
            }

            // Add registration
            await addDoc(collection(db, 'eventRegistrations'), {
                eventId: selectedEvent.id,
                eventTitle: selectedEvent.title,
                eventDate: selectedEvent.date,
                ...registrationForm,
                email: registrationForm.email.toLowerCase().trim(),
                registeredAt: serverTimestamp(),
                status: 'pending'
            });

            // Decrease capacity by 1 if capacity is set
            if (selectedEvent.capacity !== undefined && selectedEvent.capacity !== null && selectedEvent.capacity > 0) {
                await updateDoc(doc(db, 'events', selectedEvent.id), {
                    capacity: increment(-1)
                });

                // Update local state
                setEvents(prevEvents =>
                    prevEvents.map(evt =>
                        evt.id === selectedEvent.id
                            ? { ...evt, capacity: evt.capacity - 1 }
                            : evt
                    )
                );

                // Update selected event
                setSelectedEvent(prev => ({ ...prev, capacity: prev.capacity - 1 }));
            }

            setSubmitSuccess(true);
            setRegistrationForm({
                fullName: '',
                email: '',
                phone: '',
                organization: '',
                dietaryRequirements: '',
                specialNeeds: ''
            });

            setTimeout(() => {
                setShowRegistrationModal(false);
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error registering:', error);
            setSubmitError('Failed to register. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedEvent(null);
    };

    const closeRegistrationModal = () => {
        setShowRegistrationModal(false);
        setSubmitSuccess(false);
        setSubmitError('');
    };

    if (loading) {
        return <UpcomingEventsSkeleton />;
    }

    if (events.length === 0) {
        return (
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Upcoming Events</h2>
                    <p className="text-gray-600 dark:text-gray-400">Check back soon for new events!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4
                        bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 
                        dark:from-emerald-400 dark:via-green-300 dark:to-emerald-200
                        bg-clip-text text-transparent">
                        Upcoming Events
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Register for our upcoming events and be part of the change
                    </p>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => handleCardClick(event)}
                            className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden
                                border border-gray-100 dark:border-gray-800
                                hover:shadow-xl hover:shadow-emerald-500/10
                                transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                        >
                            {/* Event Image */}
                            <div className="relative h-48 overflow-hidden">
                                {event.image ? (
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                        <CalendarIcon className="w-16 h-16 text-white/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Category Badge */}
                                {event.category && (
                                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium
                                        bg-white/90 dark:bg-gray-900/90 text-emerald-700 dark:text-emerald-400
                                        rounded-full backdrop-blur-sm">
                                        {event.category}
                                    </span>
                                )}

                                {/* Featured Badge */}
                                {event.featured && (
                                    <span className="absolute top-4 right-4 px-3 py-1 text-xs font-medium
                                        bg-amber-500 text-white rounded-full">
                                        Featured
                                    </span>
                                )}

                                {/* Capacity Badge */}
                                {event.capacity !== undefined && event.capacity !== null && event.capacity <= 0 && (
                                    <span className="absolute top-4 right-4 px-3 py-1 text-xs font-medium
                                        bg-red-500 text-white rounded-full">
                                        Full
                                    </span>
                                )}
                            </div>

                            {/* Event Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                                    {event.title}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CalendarIcon className="w-4 h-4 text-emerald-600" />
                                        <span>{formatDate(event.date)}</span>
                                    </div>
                                    {event.time && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <ClockIcon className="w-4 h-4 text-emerald-600" />
                                            <span>{event.time}</span>
                                        </div>
                                    )}
                                    {event.location && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPinIcon className="w-4 h-4 text-emerald-600" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    )}
                                    {event.capacity !== undefined && event.capacity !== null && (
                                        <div className={`flex items-center gap-2 text-sm ${event.capacity > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
                                            <UserGroupIcon className="w-4 h-4 text-emerald-600" />
                                            <span>{event.capacity > 0 ? `${event.capacity} spots available` : 'No spots available'}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                    {event.description}
                                </p>

                                {/* View Details / Register Button */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCardClick(event); }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                                            bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                                            text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                                    >
                                        <InformationCircleIcon className="w-5 h-5" />
                                        Details
                                    </button>
                                    {canRegister(event) ? (
                                        <button
                                            onClick={(e) => handleRegisterClick(event, e)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                                                bg-emerald-600 hover:bg-emerald-700 text-white
                                                rounded-xl font-medium transition-colors"
                                        >
                                            <TicketIcon className="w-5 h-5" />
                                            Register
                                        </button>
                                    ) : !hasCapacity(event) ? (
                                        <div className="flex-1 text-center py-3 bg-red-100 dark:bg-red-900/20
                                            text-red-600 dark:text-red-400 rounded-xl font-medium">
                                            Event Full
                                        </div>
                                    ) : (
                                        <div className="flex-1 text-center py-3 bg-gray-100 dark:bg-gray-800
                                            text-gray-500 dark:text-gray-400 rounded-xl font-medium">
                                            Closed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Details Modal */}
            {showDetailsModal && selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header with Image */}
                        <div className="relative h-64">
                            {selectedEvent.image ? (
                                <Image
                                    src={selectedEvent.image}
                                    alt={selectedEvent.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                    <CalendarIcon className="w-24 h-24 text-white/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <button
                                onClick={closeDetailsModal}
                                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-white" />
                            </button>
                            <div className="absolute bottom-4 left-6 right-6">
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedEvent.category && (
                                        <span className="px-3 py-1 text-xs font-medium bg-emerald-500 text-white rounded-full">
                                            {selectedEvent.category}
                                        </span>
                                    )}
                                    {selectedEvent.featured && (
                                        <span className="px-3 py-1 text-xs font-medium bg-amber-500 text-white rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-white">{selectedEvent.title}</h3>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-6">
                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(selectedEvent.date)}
                                            {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.date && (
                                                <span> - {formatDate(selectedEvent.endDate)}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {selectedEvent.time && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                            <ClockIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {selectedEvent.time}
                                                {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {selectedEvent.location && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                            <MapPinIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEvent.location}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedEvent.isVirtual && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <GlobeAltIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Virtual Event</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Online</p>
                                        </div>
                                    </div>
                                )}
                                {selectedEvent.capacity !== undefined && selectedEvent.capacity !== null && (
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selectedEvent.capacity > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                            <UserGroupIcon className={`w-5 h-5 ${selectedEvent.capacity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Capacity</p>
                                            <p className={`text-sm font-medium ${selectedEvent.capacity > 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                                                {selectedEvent.capacity > 0 ? `${selectedEvent.capacity} spots left` : 'No spots available'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Event</h4>
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                    {selectedEvent.fullDescription || selectedEvent.description}
                                </p>
                            </div>

                            {/* Organizers */}
                            {selectedEvent.organizers && selectedEvent.organizers.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Organizers</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEvent.organizers.map((org, idx) => (
                                            <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                                <BuildingOfficeIcon className="w-4 h-4" />
                                                {org}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Virtual Link */}
                            {selectedEvent.isVirtual && selectedEvent.virtualLink && (
                                <div className="mb-6">
                                    <a
                                        href={selectedEvent.virtualLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        <LinkIcon className="w-5 h-5" />
                                        Join Virtual Event
                                    </a>
                                </div>
                            )}

                            {/* Registration Deadline Notice */}
                            {selectedEvent.registrationDeadline && (
                                <div className={`mb-6 p-4 rounded-xl ${isRegistrationOpen(selectedEvent) ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                    <p className={`text-sm ${isRegistrationOpen(selectedEvent) ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}`}>
                                        <strong>Registration Deadline:</strong> {formatDate(selectedEvent.registrationDeadline)}
                                        {!isRegistrationOpen(selectedEvent) && ' (Closed)'}
                                    </p>
                                </div>
                            )}

                            {/* Register Button */}
                            {canRegister(selectedEvent) ? (
                                <button
                                    onClick={(e) => { closeDetailsModal(); handleRegisterClick(selectedEvent, e); }}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4
                                        bg-emerald-600 hover:bg-emerald-700 text-white
                                        rounded-xl font-semibold transition-colors"
                                >
                                    <TicketIcon className="w-5 h-5" />
                                    Register for This Event
                                </button>
                            ) : !hasCapacity(selectedEvent) ? (
                                <div className="w-full text-center py-4 bg-red-100 dark:bg-red-900/20
                                    text-red-600 dark:text-red-400 rounded-xl font-semibold">
                                    <ExclamationCircleIcon className="w-5 h-5 inline-block mr-2" />
                                    This Event is Full
                                </div>
                            ) : (
                                <div className="w-full text-center py-4 bg-gray-100 dark:bg-gray-800
                                    text-gray-500 dark:text-gray-400 rounded-xl font-semibold">
                                    Registration Closed
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            {showRegistrationModal && selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Event Registration
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {selectedEvent.title}
                                </p>
                                {selectedEvent.capacity !== undefined && selectedEvent.capacity !== null && selectedEvent.capacity > 0 && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                        {selectedEvent.capacity} spots remaining
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={closeRegistrationModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="p-8 text-center">
                                <CheckCircleIcon className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Registration Successful!
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We&apos;ll send you a confirmation email with event details.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleRegistrationSubmit} className="p-6 space-y-4">
                                {submitError && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                                        <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                                        <span>{submitError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={registrationForm.fullName}
                                        onChange={(e) => setRegistrationForm({ ...registrationForm, fullName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={registrationForm.email}
                                        onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={registrationForm.phone}
                                        onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Organization / Company
                                    </label>
                                    <input
                                        type="text"
                                        value={registrationForm.organization}
                                        onChange={(e) => setRegistrationForm({ ...registrationForm, organization: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Your organization (optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Dietary Requirements
                                    </label>
                                    <input
                                        type="text"
                                        value={registrationForm.dietaryRequirements}
                                        onChange={(e) => setRegistrationForm({ ...registrationForm, dietaryRequirements: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Any dietary restrictions? (optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Special Needs / Accessibility
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={registrationForm.specialNeeds}
                                        onChange={(e) => setRegistrationForm({ ...registrationForm, specialNeeds: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Any special requirements? (optional)"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || checkingEmail}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3
                                        bg-emerald-600 hover:bg-emerald-700 text-white
                                        rounded-xl font-semibold transition-colors disabled:opacity-50"
                                >
                                    {submitting || checkingEmail ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {checkingEmail ? 'Checking...' : 'Registering...'}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Complete Registration
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

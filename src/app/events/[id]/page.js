"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy, addDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ShareIcon,
  HeartIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAltIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { use } from 'react';

export default function EventDetailsPage({ params }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchEvent();
    }
  }, [resolvedParams?.id]);

  const fetchEvent = async () => {
    try {
      const eventDoc = await getDoc(doc(db, 'events', resolvedParams.id));
      if (eventDoc.exists()) {
        const eventData = { id: eventDoc.id, ...eventDoc.data() };
        setEvent(eventData);
        fetchRelatedEvents(eventData.category);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const fetchRelatedEvents = async (category) => {
    try {
      const q = query(
        collection(db, 'events'),
        orderBy('date', 'asc'),
        limit(4)
      );
      const snapshot = await getDocs(q);
      const events = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(e => e.id !== resolvedParams.id)
        .slice(0, 3);
      setRelatedEvents(events);
    } catch (error) {
      console.error('Error fetching related events:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
      year: eventDate.getFullYear(),
      weekday: eventDate.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  const isUpcoming = () => {
    if (!event?.date) return false;
    const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
    return eventDate > new Date();
  };

  const getDaysUntil = () => {
    if (!event?.date) return null;
    const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Add registration to Firestore
      await addDoc(collection(db, 'eventRegistrations'), {
        eventId: event.id,
        eventTitle: event.title,
        ...registrationForm,
        registeredAt: Timestamp.now(),
        status: 'pending'
      });

      // Update event attendee count
      await updateDoc(doc(db, 'events', event.id), {
        currentAttendees: increment(1)
      });

      setRegistrationStatus('success');
      setEvent(prev => ({
        ...prev,
        currentAttendees: (prev.currentAttendees || 0) + 1
      }));

      // Reset form
      setRegistrationForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        message: ''
      });

      setTimeout(() => {
        setShowRegistrationModal(false);
        setRegistrationStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error registering:', error);
      setRegistrationStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const galleryImages = event?.gallery || (event?.image ? [event.image] : []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 
                            flex items-center justify-center">
              <CalendarDaysIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 
                                bg-teal-600 text-white rounded-xl hover:bg-teal-700 
                                transition-all font-semibold"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const dateParts = getDateParts(event.date);
  const daysUntil = getDaysUntil();
  const spotsLeft = event.maxAttendees ? event.maxAttendees - (event.currentAttendees || 0) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="pt-20">
        {/* Hero Section with Image */}
        <section className="relative">
          {/* Image Gallery */}
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gradient-to-br from-teal-400 to-cyan-600">
            {galleryImages.length > 0 ? (
              <>
                <img
                  src={galleryImages[currentImage]}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Gallery Navigation */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                                                bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all
                                                border border-white/30"
                    >
                      <ChevronLeftIcon className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                                                bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all
                                                border border-white/30"
                    >
                      <ChevronRightIcon className="w-6 h-6 text-white" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
                      {galleryImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all 
                                                        ${currentImage === index
                              ? 'w-8 bg-white'
                              : 'bg-white/50 hover:bg-white/70'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CalendarDaysIcon className="w-32 h-32 text-white/30" />
              </div>
            )}

            {/* Back Button & Actions */}
            <div className="absolute top-6 left-0 right-0 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                                        bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all
                                        text-white font-medium border border-white/30"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Back to Events</span>
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-md 
                                            hover:bg-white/30 transition-all border border-white/30"
                  >
                    {liked ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-md 
                                            hover:bg-white/30 transition-all border border-white/30"
                  >
                    <ShareIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Event Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {event.category && (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold
                                            bg-teal-500/80 text-white backdrop-blur-sm">
                      {event.category}
                    </span>
                  )}
                  {isUpcoming() ? (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold
                                            bg-green-500/80 text-white backdrop-blur-sm">
                      Upcoming
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold
                                            bg-gray-500/80 text-white backdrop-blur-sm">
                      Past Event
                    </span>
                  )}
                  {daysUntil !== null && daysUntil > 0 && daysUntil <= 7 && (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold
                                            bg-orange-500/80 text-white backdrop-blur-sm animate-pulse">
                      {daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days left`}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Info Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl
                                        bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-800/50 
                                            flex items-center justify-center flex-shrink-0">
                      <CalendarDaysIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {dateParts.month} {dateParts.day}, {dateParts.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl
                                        bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-800/50 
                                            flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatTime(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl
                                        bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-800/50 
                                            flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {event.location || 'TBA'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8
                                    border border-gray-100 dark:border-gray-800 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] ">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 
                                        flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    About This Event
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {event.fullDescription || event.description || 'No description available.'}
                    </p>
                  </div>

                  {/* Event Highlights */}
                  {event.highlights && event.highlights.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Event Highlights
                      </h3>
                      <ul className="space-y-3">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Impact Section (for past events) */}
                {event.impact && !isUpcoming() && (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 
                                        rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-teal-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Event Impact
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                      {event.impact.participants && (
                        <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] ">
                          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                            {event.impact.participants}+
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">Participants</p>
                        </div>
                      )}
                      {event.impact.treesPlanted && (
                        <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] ">
                          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {event.impact.treesPlanted}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">Trees Planted</p>
                        </div>
                      )}
                      {event.impact.wasteCollected && (
                        <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] ">
                          <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                            {event.impact.wasteCollected}kg
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">Waste Collected</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Registration Card */}
                <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl 
                                    border border-gray-100 dark:border-gray-800 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  overflow-hidden">
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-500">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm
                                                flex flex-col items-center justify-center text-white">
                        <span className="text-2xl font-bold leading-none">{dateParts.day}</span>
                        <span className="text-xs uppercase">{dateParts.month}</span>
                      </div>
                      <div className="text-white">
                        <p className="font-semibold">{dateParts.weekday}</p>
                        <p className="text-sm text-white/80">{formatTime(event.date)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Attendees Info */}
                    {event.maxAttendees && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            <UserGroupIcon className="w-4 h-4 inline mr-1" />
                            Attendees
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {event.currentAttendees || 0} / {event.maxAttendees}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, ((event.currentAttendees || 0) / event.maxAttendees) * 100)}%` }}
                          />
                        </div>
                        {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && (
                          <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 font-medium">
                            Only {spotsLeft} spots left!
                          </p>
                        )}
                      </div>
                    )}

                    {/* Price Info */}
                    <div className="flex items-center justify-between py-3 border-y border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">
                        <TicketIcon className="w-4 h-4 inline mr-1" />
                        Entry
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {event.price ? `$${event.price}` : 'Free'}
                      </span>
                    </div>

                    {/* Register Button */}
                    {isUpcoming() ? (
                      <button
                        onClick={() => setShowRegistrationModal(true)}
                        disabled={spotsLeft !== null && spotsLeft <= 0}
                        className="w-full py-4 px-6 rounded-xl font-semibold text-white
                                                    bg-gradient-to-r from-teal-600 to-cyan-600 
                                                    hover:from-teal-700 hover:to-cyan-700
                                                    transition-all duration-300 transform hover:scale-[1.02]
                                                    shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  shadow-teal-500/25 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] 
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    disabled:transform-none disabled:shadow-none
                                                    flex items-center justify-center gap-2"
                      >
                        {spotsLeft !== null && spotsLeft <= 0 ? (
                          'Event Full'
                        ) : (
                          <>
                            Register Now
                            <ArrowRightIcon className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center py-4 px-6 rounded-xl bg-gray-100 dark:bg-gray-800">
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          This event has ended
                        </p>
                      </div>
                    )}

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="w-full py-3 px-6 rounded-xl font-semibold
                                                border-2 border-gray-200 dark:border-gray-700
                                                text-gray-700 dark:text-gray-300
                                                hover:bg-gray-50 dark:hover:bg-gray-800
                                                transition-all flex items-center justify-center gap-2"
                    >
                      <ShareIcon className="w-5 h-5" />
                      Share Event
                    </button>
                  </div>
                </div>

                {/* Organizer Info */}
                {event.organizer && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6
                                        border border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Organized by
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50
                                                flex items-center justify-center">
                        <GlobeAltIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {event.organizer}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Event Organizer
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  More Events
                </h2>
                <Link
                  href="/events"
                  className="text-teal-600 dark:text-teal-400 font-medium 
                                        hover:text-teal-700 dark:hover:text-teal-300 
                                        flex items-center gap-1"
                >
                  View All
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEvents.map((relEvent) => {
                  const relDateParts = getDateParts(relEvent.date);
                  return (
                    <Link
                      key={relEvent.id}
                      href={`/events/${relEvent.id}`}
                      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
                                                shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  transition-all duration-300
                                                border border-gray-100 dark:border-gray-700"
                    >
                      <div className="relative h-40 overflow-hidden">
                        {relEvent.image ? (
                          <img
                            src={relEvent.image}
                            alt={relEvent.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500 
                                                        flex items-center justify-center">
                            <CalendarDaysIcon className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 
                                                    rounded-lg px-2 py-1 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] ">
                          <p className="text-lg font-bold text-teal-600 dark:text-teal-400 leading-none">
                            {relDateParts.day}
                          </p>
                          <p className="text-xs text-gray-500 uppercase">{relDateParts.month}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white 
                                                    group-hover:text-teal-600 dark:group-hover:text-teal-400 
                                                    transition-colors line-clamp-2">
                          {relEvent.title}
                        </h3>
                        {relEvent.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="truncate">{relEvent.location}</span>
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden
                        animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-500">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full 
                                    bg-white/20 hover:bg-white/30 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">Register for Event</h2>
              <p className="text-white/80 mt-1">{event.title}</p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {registrationStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30
                                        flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We've sent a confirmation email with event details.
                  </p>
                </div>
              ) : registrationStatus === 'error' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30
                                        flex items-center justify-center">
                    <XMarkIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Registration Failed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Something went wrong. Please try again.
                  </p>
                  <button
                    onClick={() => setRegistrationStatus(null)}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg
                                            text-gray-700 dark:text-gray-300 font-medium
                                            hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={registrationForm.name}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={registrationForm.email}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={registrationForm.phone}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={registrationForm.organization}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, organization: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Company or organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      rows={3}
                      value={registrationForm.message}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                      placeholder="Any dietary requirements or accessibility needs?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white
                                            bg-gradient-to-r from-teal-600 to-cyan-600 
                                            hover:from-teal-700 hover:to-cyan-700
                                            transition-all duration-300 disabled:opacity-50
                                            flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRightIcon className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
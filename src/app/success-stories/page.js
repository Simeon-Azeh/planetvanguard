"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import {
  TrophyIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  PhotoIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function SuccessStories() {
  const [pastEvents, setPastEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [impactStats, setImpactStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalProjects: 0,
    countriesReached: 3
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch past events
      const eventsQuery = query(
        collection(db, 'events'),
        orderBy('date', 'desc')
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter for past events
      const now = new Date();
      const pastEventsData = eventsData.filter(event => {
        const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
        return eventDate < now;
      });
      setPastEvents(pastEventsData);

      // Calculate total participants from past events
      const totalParticipants = pastEventsData.reduce((acc, event) => {
        return acc + (event.currentAttendees || event.impact?.participants || 0);
      }, 0);

      // Fetch projects/initiatives
      const projectsQuery = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc')
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);

      // Fetch gallery items
      const galleryQuery = query(
        collection(db, 'gallery'),
        orderBy('createdAt', 'desc'),
        limit(12)
      );
      const gallerySnapshot = await getDocs(galleryQuery);
      const galleryData = gallerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGalleryItems(galleryData);

      // Fetch approved testimonials
      const testimonialsQuery = query(
        collection(db, 'testimonials'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const testimonialsSnapshot = await getDocs(testimonialsQuery);
      const testimonialsData = testimonialsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(t => t.approved === true);
      setTestimonials(testimonialsData);

      // Update impact stats
      setImpactStats({
        totalEvents: pastEventsData.length,
        totalParticipants: totalParticipants,
        totalProjects: projectsData.filter(p => p.status === 'completed').length,
        countriesReached: 3
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'all', name: 'All', icon: SparklesIcon },
    { id: 'events', name: 'Past Events', icon: CalendarDaysIcon },
    { id: 'projects', name: 'Initiatives', icon: GlobeAltIcon },
    { id: 'gallery', name: 'Gallery', icon: PhotoIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="pt-20">
          {/* Hero Skeleton */}
          <div className="relative py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 w-48 bg-emerald-200 dark:bg-emerald-800 rounded-full" />
                <div className="h-12 w-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-300/30 to-teal-400/20 blur-3xl" />
            <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-300/30 to-emerald-400/20 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                <TrophyIcon className="w-5 h-5" />
                <span>Our Impact</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Success </span>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Stories
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Discover the impact we've made together. From community events to sustainable initiatives,
                every story represents a step towards a greener future for Africa.
              </p>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-emerald-100 dark:border-emerald-800 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center">
                  <CalendarDaysIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {impactStats.totalEvents}+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Events Completed</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-teal-100 dark:border-teal-800 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 flex items-center justify-center">
                  <UserGroupIcon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {impactStats.totalParticipants}+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lives Impacted</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-cyan-100 dark:border-cyan-800 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 flex items-center justify-center">
                  <ChartBarIcon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {impactStats.totalProjects}+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Projects Completed</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-blue-100 dark:border-blue-800 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                  <GlobeAltIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {impactStats.countriesReached}+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Countries Reached</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="sticky top-20 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  shadow-emerald-500/25'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {tab.id === 'events' && pastEvents.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                      }`}>
                      {pastEvents.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Past Events Section */}
          {(activeTab === 'all' || activeTab === 'events') && pastEvents.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Past Events
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Relive our impactful community gatherings and initiatives
                  </p>
                </div>
                <Link
                  href="/events"
                  className="hidden md:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium hover:gap-3 transition-all"
                >
                  View All Events
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.slice(0, activeTab === 'events' ? undefined : 6).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                          <CalendarDaysIcon className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Completed Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-semibold flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        Completed
                      </div>

                      {/* Date */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm opacity-80">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {event.title}
                      </h3>

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <MapPinIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}

                      {/* Impact Metrics */}
                      {(event.currentAttendees || event.impact) && (
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-4 text-sm">
                            {event.currentAttendees && (
                              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                <UserGroupIcon className="w-4 h-4" />
                                <span className="font-medium">{event.currentAttendees} attended</span>
                              </div>
                            )}
                            {event.impact?.treesPlanted && (
                              <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                                <span>🌳 {event.impact.treesPlanted} trees</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Projects/Initiatives Section */}
          {(activeTab === 'all' || activeTab === 'projects') && projects.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Our Initiatives
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ongoing and completed projects making a real difference
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, activeTab === 'projects' ? undefined : 6).map((project) => (
                  <div
                    key={project.id}
                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                          <GlobeAltIcon className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Status Badge */}
                      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${project.status === 'completed'
                          ? 'bg-emerald-500/90 text-white'
                          : project.status === 'ongoing'
                            ? 'bg-blue-500/90 text-white'
                            : 'bg-amber-500/90 text-white'
                        }`}>
                        {project.status === 'completed' ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : (
                          <ClockIcon className="w-4 h-4" />
                        )}
                        {project.status || 'Ongoing'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {project.category && (
                        <span className="inline-block px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-3">
                          {project.category}
                        </span>
                      )}

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {project.title}
                      </h3>

                      {project.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {project.description}
                        </p>
                      )}

                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>{project.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {(activeTab === 'all' || activeTab === 'gallery') && galleryItems.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Our Journey in Photos
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Visual stories from our events and initiatives
                  </p>
                </div>
                <Link
                  href="/media"
                  className="hidden md:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium hover:gap-3 transition-all"
                >
                  View Full Gallery
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.slice(0, activeTab === 'gallery' ? 12 : 8).map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer ${index === 0 ? 'col-span-2 row-span-2' : ''
                      }`}
                  >
                    <div className={`relative ${index === 0 ? 'h-80' : 'h-40'} overflow-hidden`}>
                      {item.url ? (
                        <img
                          src={item.url}
                          alt={item.title || 'Gallery image'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                          <PhotoIcon className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-center text-white p-4">
                          {item.title && (
                            <p className="font-semibold text-lg">{item.title}</p>
                          )}
                          {item.eventName && (
                            <p className="text-sm opacity-80">{item.eventName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonials Section */}
          {activeTab === 'all' && testimonials.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  What People Say
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Hear from those who've been part of our journey
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < (testimonial.rating || 5)
                              ? 'text-amber-400'
                              : 'text-gray-300 dark:text-gray-600'
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                      "{testimonial.message}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                        {testimonial.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        {testimonial.organization && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.organization}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {pastEvents.length === 0 && projects.length === 0 && galleryItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <TrophyIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Success Stories Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We're busy making an impact! Check back soon to see our completed events and initiatives.
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of Our Next Success Story
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join us in creating lasting impact for our communities and environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-involved"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] "
              >
                <HeartIcon className="w-5 h-5" />
                Get Involved
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <CalendarDaysIcon className="w-5 h-5" />
                Upcoming Events
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

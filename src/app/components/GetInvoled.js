"use client"
import React, { useState } from 'react';
import {
  UserGroupIcon,
  CalendarIcon,
  AcademicCapIcon,
  ShareIcon,
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

const MODAL_TYPES = {
  SOCIAL: 'social',
  VOLUNTEER: 'volunteer',
  EVENTS: 'events'
};

const sampleEvents = [
  {
    id: 1,
    title: "Climate Action Summit 2024",
    date: "March 15, 2024",
    location: "Kigali, Rwanda",
    type: "Summit"
  },
  {
    id: 2,
    title: "Environmental Workshop",
    date: "April 20, 2024",
    location: "Nairobi, Kenya",
    type: "Workshop"
  }
];

const ActionCard = ({ icon: Icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl
      border border-emerald-100 dark:border-emerald-800 cursor-pointer
      transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
  >
    <Icon className="w-8 h-8 text-emerald-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const EventCard = ({ title, date, location, type, onRegister }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <ClockIcon className="w-4 h-4" />
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPinIcon className="w-4 h-4" />
        <span>{location}</span>
      </div>
    </div>
    <button
      onClick={onRegister}
      className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg 
        hover:bg-emerald-700 transition-colors"
    >
      Register for {type}
    </button>
  </div>
);

const RegistrationForm = ({ event, onBack }) => (
  <div className="space-y-4">
    <button 
      onClick={onBack}
      className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
    >
      <ChevronLeftIcon className="w-5 h-5" /> Back to Events
    </button>
    
    <h3 className="font-semibold text-lg">Register for {event.title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {event.date} • {event.location}
    </p>
    
    <form className="space-y-4 mt-6">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        required
      />
      <input
        type="email"
        placeholder="Email Address"
        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        required
      />
      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-3 rounded-lg
          hover:bg-emerald-700 transition-colors"
      >
        Complete Registration
      </button>
    </form>
  </div>
);

const Modal = ({ type, isOpen, onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  if (!isOpen) return null;

  const socialLinks = [
    { name: 'WhatsApp', url: 'https://wa.me/your-number', color: 'bg-green-500' },
    { name: 'Telegram', url: 'https://t.me/your-channel', color: 'bg-blue-500' },
    { name: 'Twitter', url: 'https://twitter.com/your-handle', color: 'bg-sky-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {type === MODAL_TYPES.SOCIAL && (
          <>
            <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
            <div className="space-y-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link.color} text-white p-4 rounded-lg flex items-center 
                    justify-center transition-transform hover:scale-105`}
                >
                  Join on {link.name}
                </a>
              ))}
            </div>
          </>
        )}

        {type === MODAL_TYPES.VOLUNTEER && (
          <>
            <h2 className="text-2xl font-bold mb-6">Volunteer Registration</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                required
              />
              <textarea
                placeholder="How would you like to contribute?"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg
                  hover:bg-emerald-700 transition-colors"
              >
                Submit Application
              </button>
            </form>
          </>
        )}

        {type === MODAL_TYPES.EVENTS && (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {selectedEvent ? 'Event Registration' : 'Upcoming Events'}
            </h2>
            
            {selectedEvent ? (
              <RegistrationForm 
                event={selectedEvent}
                onBack={() => setSelectedEvent(null)}
              />
            ) : (
              <div className="space-y-4">
                {sampleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onRegister={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function GetInvolved() {
  const [modalType, setModalType] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 relative">
      <h1 className="text-4xl font-bold text-center mb-12 relative
        bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
        Get Involved
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        <ActionCard
          icon={UserGroupIcon}
          title="Join Climate Action Clubs"
          description="Connect with like-minded individuals and make a difference together."
          onClick={() => setModalType(MODAL_TYPES.SOCIAL)}
        />
        <ActionCard
          icon={CalendarIcon}
          title="Volunteer for Events"
          description="Help organize and participate in local environmental initiatives."
          onClick={() => setModalType(MODAL_TYPES.VOLUNTEER)}
        />
        <ActionCard
          icon={AcademicCapIcon}
          title="Summits & Workshops"
          description="Learn from experts and share knowledge in interactive sessions."
          onClick={() => setModalType(MODAL_TYPES.EVENTS)}
        />
      </div>

      <Modal
        type={modalType}
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
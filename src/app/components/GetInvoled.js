"use client"
import React, { useState } from 'react';
import {
  UserGroupIcon,
  CalendarIcon,
  AcademicCapIcon,
  ShareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

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

const SocialModal = ({ isOpen, onClose }) => {
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
        <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
        <div className="space-y-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} text-white p-4 rounded-lg flex items-center justify-center
                transition-transform hover:scale-105`}
            >
              Join on {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function GetInvolved() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 relative">
      
      
      <h1 className="text-4xl font-bold text-center mb-12 relative
        bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
        Get Involved
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        <ActionCard
          icon={UserGroupIcon}
          title="Join Climate Action Clubs"
          description="Connect with like-minded individuals and make a difference together."
          onClick={() => setIsModalOpen(true)}
        />
        <ActionCard
          icon={CalendarIcon}
          title="Volunteer for Events"
          description="Help organize and participate in local environmental initiatives."
          onClick={() => setIsModalOpen(true)}
        />
        <ActionCard
          icon={AcademicCapIcon}
          title="Summits & Workshops"
          description="Learn from experts and share knowledge in interactive sessions."
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <div className="mt-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl relative">
        <h2 className="text-2xl font-bold mb-6">Volunteer Registration</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700
              bg-white/50 dark:bg-gray-900/50"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700
              bg-white/50 dark:bg-gray-900/50"
          />
          <textarea
            placeholder="How would you like to contribute?"
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700
              bg-white/50 dark:bg-gray-900/50 md:col-span-2"
            rows={4}
          />
          <button
            type="submit"
            className="md:col-span-2 bg-emerald-600 text-white py-3 px-6 rounded-lg
              hover:bg-emerald-700 transition-colors"
          >
            Submit An Open Application
          </button>
        </form>
      </div>

      <SocialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
"use client"
import React, { useState } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const contactMethods = [
  {
    icon: PhoneIcon,
    title: 'Call Us',
    value: '+250 783 296 593',
    subtitle: 'Mon-Fri from 8am to 5pm'
  },
  {
    icon: EnvelopeIcon,
    title: 'Email Us',
    value: 'contact@planetvanguard.org',
    subtitle: 'We/ll respond within 24 hours'
  },
  {
    icon: MapPinIcon,
    title: 'Visit Us',
    value: 'Kigali, Rwanda',
    subtitle: 'KG 123 St, Innovation City'
  }
];

const ContactMethodCard = ({ method }) => {
  const Icon = method.icon;
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl
      border border-gray-100 dark:border-gray-700
      hover:shadow-lg transition-all duration-300">
      <Icon className="w-8 h-8 text-emerald-600 mb-4" />
      <h3 className="font-semibold mb-1">{method.title}</h3>
      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
        {method.value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {method.subtitle}
      </p>
    </div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white 
      dark:from-gray-900 dark:to-gray-800 py-24 px-8 md:px-16 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r 
            from-emerald-600 to-green-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions about our initiatives? Want to get involved? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <ContactMethodCard key={index} method={method} />
          ))}
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 
          border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-200 
                    dark:border-gray-700 dark:bg-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-200 
                    dark:border-gray-700 dark:bg-gray-900"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full p-3 rounded-lg border border-gray-200 
                  dark:border-gray-700 dark:bg-gray-900"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Message
              </label>
              <textarea
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                rows={6}
                className="w-full p-3 rounded-lg border border-gray-200 
                  dark:border-gray-700 dark:bg-gray-900"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all
                duration-300 flex items-center justify-center
                ${isSuccess 
                  ? 'bg-green-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent 
                  rounded-full animate-spin"/>
              ) : isSuccess ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Message Sent!
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
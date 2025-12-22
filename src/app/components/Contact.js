"use client"
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  HeartIcon,
  SparklesIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry', icon: QuestionMarkCircleIcon },
  { value: 'volunteer', label: 'Volunteering', icon: UserGroupIcon },
  { value: 'partnership', label: 'Partnership', icon: BuildingOfficeIcon },
  { value: 'donation', label: 'Donations', icon: HeartIcon },
  { value: 'events', label: 'Events', icon: CalendarDaysIcon },
  { value: 'media', label: 'Media/Press', icon: ChatBubbleLeftRightIcon },
];

export default function Contact() {
  const [contactInfo, setContactInfo] = useState({
    phone: '+250 783 296 593',
    email: 'contact@planetvanguard.org',
    address: 'KG 123 St, Innovation City',
    city: 'Kigali, Rwanda',
    workingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    responseTime: '24 hours',
    socialLinks: {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'general',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [recentMessages, setRecentMessages] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchContactInfo();
    fetchFaqs();
    fetchMessageCount();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'siteSettings'));
      const settings = snapshot.docs.find(doc => doc.id === 'contact');
      if (settings) {
        setContactInfo(prev => ({ ...prev, ...settings.data() }));
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const fetchFaqs = async () => {
    try {
      const q = query(
        collection(db, 'faqs'),
        where('published', '==', true),
        orderBy('order', 'asc'),
        limit(6)
      );
      const snapshot = await getDocs(q);
      setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchMessageCount = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setRecentMessages(snapshot.size);
    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date(),
        readAt: null,
        repliedAt: null,
        notes: ''
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        inquiryType: 'general',
        subject: '',
        message: '',
        preferredContact: 'email',
        urgency: 'normal'
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: 'Call Us',
      value: contactInfo.phone,
      subtitle: contactInfo.workingHours,
      action: `tel:${contactInfo.phone?.replace(/\s/g, '')}`,
      color: 'emerald'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      value: contactInfo.email,
      subtitle: `Response within ${contactInfo.responseTime}`,
      action: `mailto:${contactInfo.email}`,
      color: 'blue'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      value: contactInfo.city,
      subtitle: contactInfo.address,
      action: `https://maps.google.com/?q=${encodeURIComponent(contactInfo.address + ', ' + contactInfo.city)}`,
      color: 'purple'
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      value: contactInfo.workingHours,
      subtitle: 'Local Time (CAT)',
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'from-emerald-500 to-teal-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
      blue: 'from-blue-500 to-indigo-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      purple: 'from-purple-500 to-pink-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      orange: 'from-orange-500 to-amber-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50" />
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-300/30 to-teal-400/20 blur-3xl" />
        <div className="absolute -left-32 bottom-0 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-300/30 to-emerald-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>We're Here to Help</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Get in </span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Have questions about our environmental initiatives? Want to partner with us
              or volunteer? We'd love to hear from you. Reach out and let's make a difference together.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-600 dark:text-gray-400">Average response: {contactInfo.responseTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">{recentMessages}+ messages this month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const colorClasses = getColorClasses(method.color);
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.action || '#'}
                  target={method.action?.startsWith('http') ? '_blank' : undefined}
                  rel={method.action?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl ${colorClasses.split(' ').slice(2).join(' ')} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${colorClasses.split(' ').slice(-2).join(' ')}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{method.title}</h3>
                  <p className={`font-medium ${colorClasses.split(' ').slice(-2).join(' ')} mb-1`}>
                    {method.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{method.subtitle}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content - Form & Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">Message sent successfully!</p>
                      <p className="text-sm text-green-600 dark:text-green-400">We'll respond within {contactInfo.responseTime}.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <ExclamationCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300">Failed to send message</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Please try again or email us directly.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {inquiryTypes.map((type) => {
                        const TypeIcon = type.icon;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, inquiryType: type.value })}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.inquiryType === type.value
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                              }`}
                          >
                            <TypeIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Organization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={e => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="Company or Organization"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        value={formData.preferredContact}
                        onChange={e => setFormData({ ...formData, preferredContact: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="any">No Preference</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Urgency Level
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="low">Low - No rush</option>
                        <option value="normal">Normal</option>
                        <option value="high">High - Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  shadow-emerald-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              {/* Map */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactInfo.city || 'Kigali, Rwanda')}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm">{contactInfo.address}, {contactInfo.city}</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/get-involved"
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <UserGroupIcon className="w-5 h-5" />
                      Become a Volunteer
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/events"
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-5 h-5" />
                      Upcoming Events
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/projects"
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GlobeAltIcon className="w-5 h-5" />
                      Our Projects
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Response Info */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  What to Expect
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Confirmation Email</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">You'll receive a confirmation immediately after submitting.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Team Review</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Our team reviews your message within {contactInfo.responseTime}.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Personal Response</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">A team member will respond via your preferred contact method.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Find quick answers to common questions about our organization.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HeartIcon className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join our community of environmental advocates and help us create a sustainable future for Africa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] "
            >
              <UserGroupIcon className="w-5 h-5" />
              Get Involved Today
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              <GlobeAltIcon className="w-5 h-5" />
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
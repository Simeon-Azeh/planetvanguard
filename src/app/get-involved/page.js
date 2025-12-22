"use client"
import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import {
  HandRaisedIcon,
  HeartIcon,
  UserGroupIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

export default function GetInvolvedPage() {
  const [activeTab, setActiveTab] = useState('volunteer');
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Volunteer Form State
  const [volunteerForm, setVolunteerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    occupation: '',
    organization: '',
    interests: [],
    skills: [],
    availability: '',
    experience: '',
    motivation: '',
    howHeard: '',
    agreeToTerms: false
  });

  // Donation Interest Form State
  const [donationForm, setDonationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    donationType: 'one-time',
    estimatedAmount: '',
    currency: 'USD',
    preferredProject: '',
    message: '',
    wantReceipt: true,
    wantUpdates: true
  });

  const interestOptions = [
    'Environmental Education',
    'Tree Planting',
    'Community Outreach',
    'Event Planning',
    'Social Media',
    'Content Creation',
    'Research',
    'Fundraising',
    'Youth Mentorship',
    'Technical Support'
  ];

  const skillOptions = [
    'Project Management',
    'Graphic Design',
    'Video Production',
    'Writing/Editing',
    'Public Speaking',
    'Data Analysis',
    'Web Development',
    'Photography',
    'Translation',
    'Leadership'
  ];

  const availabilityOptions = [
    'A few hours per week',
    '1-2 days per week',
    'Weekends only',
    'Full-time (internship)',
    'Event-based only',
    'Remote only'
  ];

  const donationAmounts = [
    { amount: 25, label: 'Supporter', description: 'Plant 5 trees' },
    { amount: 50, label: 'Advocate', description: 'Support 1 workshop' },
    { amount: 100, label: 'Champion', description: 'Fund youth training' },
    { amount: 250, label: 'Leader', description: 'Sponsor a community event' },
    { amount: 500, label: 'Visionary', description: 'Launch a local initiative' },
    { amount: 0, label: 'Custom', description: 'Choose your amount' }
  ];

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'volunteerApplications'), {
        ...volunteerForm,
        status: 'pending',
        submittedAt: Timestamp.now(),
        type: 'volunteer'
      });

      setSubmitStatus('success');
      setVolunteerForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        occupation: '',
        organization: '',
        interests: [],
        skills: [],
        availability: '',
        experience: '',
        motivation: '',
        howHeard: '',
        agreeToTerms: false
      });

      setTimeout(() => {
        setShowVolunteerModal(false);
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'donationInterests'), {
        ...donationForm,
        status: 'pending',
        submittedAt: Timestamp.now(),
        type: 'donation-interest'
      });

      setSubmitStatus('success');
      setDonationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        donationType: 'one-time',
        estimatedAmount: '',
        currency: 'USD',
        preferredProject: '',
        message: '',
        wantReceipt: true,
        wantUpdates: true
      });

      setTimeout(() => {
        setShowDonationModal(false);
        setSubmitStatus(null);
      }, 4000);
    } catch (error) {
      console.error('Error submitting donation interest:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleInterest = (interest) => {
    setVolunteerForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleSkill = (skill) => {
    setVolunteerForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const waysToHelp = [
    {
      icon: HandRaisedIcon,
      title: 'Volunteer',
      description: 'Join our team of passionate volunteers making a difference in communities across Africa.',
      features: ['Flexible hours', 'Remote & on-site options', 'Training provided', 'Certificate of participation'],
      action: () => setShowVolunteerModal(true),
      color: 'emerald'
    },
    {
      icon: HeartIcon,
      title: 'Donate',
      description: 'Support our initiatives financially and help us expand our impact to more communities.',
      features: ['Tax-deductible', 'Transparent reporting', 'Choose your project', 'Monthly or one-time'],
      action: () => setShowDonationModal(true),
      color: 'rose'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Partner With Us',
      description: 'Organizations and businesses can collaborate with us on sustainability initiatives.',
      features: ['CSR partnerships', 'Sponsorship opportunities', 'Joint campaigns', 'Employee engagement'],
      action: () => window.location.href = '/contact',
      color: 'blue'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Spread the Word',
      description: 'Help us reach more people by sharing our mission on social media and in your community.',
      features: ['Social media sharing', 'Host a talk', 'Invite friends', 'Write about us'],
      action: () => window.location.href = '/contact',
      color: 'purple'
    }
  ];

  const impactStats = [
    { number: '50+', label: 'Active Volunteers', icon: UserGroupIcon },
    { number: '2K+', label: 'Trees Planted', icon: GlobeAltIcon },
    { number: '5+', label: 'Events Organized', icon: CalendarDaysIcon },
    { number: '2', label: 'Countries', icon: MapPinIcon }
  ];

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
                <SparklesIcon className="w-5 h-5" />
                <span>Make a Difference</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Get </span>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Involved
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Join our mission to create a sustainable future for Africa. Whether you volunteer your time,
                make a donation, or spread the word - every action counts towards building a greener tomorrow.
              </p>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {impactStats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-emerald-300 dark:border-emerald-800 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center">
                    <stat.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ways to Help Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ways to Contribute
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose how you'd like to support our mission. Every contribution, big or small, makes a real impact.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {waysToHelp.map((way, index) => (
                <div
                  key={index}
                  className={`group bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:border-${way.color}-200 dark:hover:border-${way.color}-800`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${way.color}-100 to-${way.color}-200 dark:from-${way.color}-900/50 dark:to-${way.color}-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <way.icon className={`w-8 h-8 text-${way.color}-600 dark:text-${way.color}-400`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {way.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {way.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {way.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircleIcon className={`w-5 h-5 text-${way.color}-500`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={way.action}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-${way.color}-500 to-${way.color}-600 hover:from-${way.color}-600 hover:to-${way.color}-700 transition-all duration-300 transform hover:scale-[1.02] shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  flex items-center justify-center gap-2`}
                  >
                    {way.title === 'Volunteer' ? 'Apply Now' : way.title === 'Donate' ? 'Express Interest' : 'Learn More'}
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Volunteer Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Volunteer With Us?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Volunteering with Planet Vanguard isn't just about giving back – it's about growing,
                  learning, and being part of a community that's creating real change.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: AcademicCapIcon, title: 'Learn New Skills', desc: 'Gain hands-on experience in sustainability, project management, and community engagement.' },
                    { icon: UserGroupIcon, title: 'Build Your Network', desc: 'Connect with like-minded individuals and professionals across Africa and beyond.' },
                    { icon: GlobeAltIcon, title: 'Make Real Impact', desc: 'See the direct results of your efforts in communities and ecosystems.' },
                    { icon: BriefcaseIcon, title: 'Career Development', desc: 'Receive certificates, recommendations, and references for your professional growth.' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to Join?</h3>
                  <p className="mb-6 text-white/90">
                    Fill out our volunteer application form and become part of our growing community of changemakers.
                  </p>
                  <button
                    onClick={() => setShowVolunteerModal(true)}
                    className="w-full py-4 px-6 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <HandRaisedIcon className="w-6 h-6" />
                    Start Your Application
                  </button>

                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-sm text-white/80 mb-4">What happens next?</p>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
                        Submit your application
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
                        We review and contact you
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
                        Complete onboarding & training
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">4</span>
                        Start making an impact!
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Support Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your donation helps us continue our work in environmental conservation and community development.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {donationAmounts.slice(0, 6).map((tier, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setDonationForm(prev => ({ ...prev, estimatedAmount: tier.amount.toString() }));
                    setShowDonationModal(true);
                  }}
                  className="group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {tier.amount > 0 ? `$${tier.amount}` : 'Custom'}
                    </span>
                    <GiftIcon className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tier.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-2xl p-8 border border-rose-100 dark:border-rose-800">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    How Donations Work
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We're currently setting up our payment system. When you express interest, our team will
                    contact you with an invoice via email. All donations are tax-deductible and you'll receive
                    a receipt for your records.
                  </p>
                </div>
                <button
                  onClick={() => setShowDonationModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  flex items-center gap-2 whitespace-nowrap"
                >
                  <HeartIcon className="w-5 h-5" />
                  Express Interest
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Have Questions?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              We're here to help. Reach out to our team for more information about volunteering, donations, or partnerships.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] "
            >
              <EnvelopeIcon className="w-5 h-5" />
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      {/* Volunteer Application Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 z-10">
              <button
                onClick={() => setShowVolunteerModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">Volunteer Application</h2>
              <p className="text-white/80 mt-1">Join our team of changemakers</p>
            </div>

            {submitStatus === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircleIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Application Submitted!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you for your interest! Our team will review your application and contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-emerald-500" />
                    Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={volunteerForm.firstName}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={volunteerForm.lastName}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={volunteerForm.phone}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={volunteerForm.country}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, country: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={volunteerForm.city}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-emerald-500" />
                    Professional Background
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={volunteerForm.occupation}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, occupation: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="e.g., Student, Engineer, Teacher"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Organization/School
                      </label>
                      <input
                        type="text"
                        value={volunteerForm.organization}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, organization: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Areas of Interest */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-emerald-500" />
                    Areas of Interest
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${volunteerForm.interests.includes(interest)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                          }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AcademicCapIcon className="w-5 h-5 text-emerald-500" />
                    Your Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${volunteerForm.skills.includes(skill)
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/50'
                          }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability *
                  </label>
                  <select
                    required
                    value={volunteerForm.availability}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select your availability</option>
                    {availabilityOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Experience & Motivation */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Previous Volunteer Experience
                    </label>
                    <textarea
                      rows={3}
                      value={volunteerForm.experience}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, experience: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      placeholder="Tell us about any previous volunteer work..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Why do you want to volunteer with us? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={volunteerForm.motivation}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, motivation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      placeholder="Share your motivation..."
                    />
                  </div>
                </div>

                {/* How did you hear */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    value={volunteerForm.howHeard}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, howHeard: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="social-media">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="event">Event</option>
                    <option value="search">Online Search</option>
                    <option value="news">News/Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={volunteerForm.agreeToTerms}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, agreeToTerms: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the volunteer terms and conditions and consent to Planet Vanguard contacting me about volunteer opportunities.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Donation Interest Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 p-6 z-10">
              <button
                onClick={() => setShowDonationModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">Express Donation Interest</h2>
              <p className="text-white/80 mt-1">We'll send you an invoice via email</p>
            </div>

            {submitStatus === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <CheckCircleIcon className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your donation interest has been received. Our team will send you an invoice via email within 24-48 hours.
                </p>
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 text-left">
                  <p className="text-sm text-rose-800 dark:text-rose-200">
                    <strong>What's next?</strong>
                    <br />
                    • Check your email for the invoice
                    <br />
                    • Complete payment via bank transfer or mobile money
                    <br />
                    • Receive your tax-deductible receipt
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDonationSubmit} className="p-6 space-y-5">
                {/* Contact Information */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={donationForm.firstName}
                      onChange={(e) => setDonationForm({ ...donationForm, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={donationForm.lastName}
                      onChange={(e) => setDonationForm({ ...donationForm, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={donationForm.email}
                    onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="We'll send the invoice here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={donationForm.phone}
                    onChange={(e) => setDonationForm({ ...donationForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization (if applicable)
                  </label>
                  <input
                    type="text"
                    value={donationForm.organization}
                    onChange={(e) => setDonationForm({ ...donationForm, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                {/* Donation Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Donation Type *
                    </label>
                    <select
                      required
                      value={donationForm.donationType}
                      onChange={(e) => setDonationForm({ ...donationForm, donationType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="one-time">One-time Donation</option>
                      <option value="monthly">Monthly Donation</option>
                      <option value="quarterly">Quarterly Donation</option>
                      <option value="annual">Annual Donation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Currency
                    </label>
                    <select
                      value={donationForm.currency}
                      onChange={(e) => setDonationForm({ ...donationForm, currency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="RWF">RWF</option>
                      <option value="KES">KES</option>
                      <option value="NGN">NGN</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Amount *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={donationForm.estimatedAmount}
                    onChange={(e) => setDonationForm({ ...donationForm, estimatedAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Project/Cause
                  </label>
                  <select
                    value={donationForm.preferredProject}
                    onChange={(e) => setDonationForm({ ...donationForm, preferredProject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Where needed most</option>
                    <option value="tree-planting">Tree Planting</option>
                    <option value="youth-education">Youth Education</option>
                    <option value="community-events">Community Events</option>
                    <option value="clean-energy">Clean Energy</option>
                    <option value="waste-management">Waste Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={donationForm.message}
                    onChange={(e) => setDonationForm({ ...donationForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                    placeholder="Any special instructions or message..."
                  />
                </div>

                {/* Preferences */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={donationForm.wantReceipt}
                      onChange={(e) => setDonationForm({ ...donationForm, wantReceipt: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I would like a tax-deductible receipt
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={donationForm.wantUpdates}
                      onChange={(e) => setDonationForm({ ...donationForm, wantUpdates: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Keep me updated on how my donation is used
                    </span>
                  </label>
                </div>

                {/* Notice */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <EnvelopeIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      After submitting, you'll receive an invoice via email within 24-48 hours with payment instructions.
                    </span>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5" />
                      Submit Donation Interest
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

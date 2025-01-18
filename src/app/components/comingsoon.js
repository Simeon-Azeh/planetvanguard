"use client"
import Image from "next/image";
import { 
  GlobeAltIcon, 
  HandRaisedIcon, 
  SparklesIcon,
  ArrowPathIcon,
  CameraIcon // Use CameraIcon as a placeholder for Instagram
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { 
    FaInstagram, 
    FaTwitter, 
    FaLinkedin, 
    FaGithub 
  } from 'react-icons/fa';
import ImageLoader from "./imageLoader";
import { db } from "../../../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const FloatingElement = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-multiply filter blur-xl animate-float ${className}`} />
);

export default function ComingSoon() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Check if email already exists
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(subscriptionsRef, where('email', '==', formData.email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage({ 
          type: 'error', 
          text: 'This email is already subscribed!' 
        });
        setIsLoading(false);
        return;
      }

      // Add new subscription
      await addDoc(subscriptionsRef, {
        name: formData.name,
        email: formData.email.toLowerCase(),
        createdAt: new Date().toISOString(),
      });

      setMessage({ 
        type: 'success', 
        text: 'Thank you for joining! We\'ll keep you updated.' 
      });
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Something went wrong. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ImageLoader />
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 relative overflow-hidden font-lato">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
        <FloatingElement className="bg-emerald-300/30 w-72 h-72 -left-20 top-20" />
        <FloatingElement className="bg-teal-300/30 w-64 h-64 left-40 bottom-20" />
        
        <main className="relative max-w-5xl mx-auto px-4 py-16 flex flex-col items-center gap-12 text-center">
          
          <h1 className="text-2xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 tracking-tight">
            Planet Vanguard - Empowering African Youths for Climate Action
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            Together, we can make a difference. Join us in our mission to create a sustainable future for all.
          </p>

          <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
            <FeatureCard 
              icon={<GlobeAltIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />}
              title="Global Impact"
              description="Working across borders for climate solutions"
            />
            <FeatureCard 
              icon={<SparklesIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />}
              title="Innovation"
              description="Leveraging technology for sustainability"
            />
            <FeatureCard 
              icon={<HandRaisedIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />}
              title="Action"
              description="Taking steps toward a greener future"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 mt-8 w-full max-w-4xl">
            <div className="flex-1">
              <form 
                onSubmit={handleSubmit}
                className="bg-white dark:bg-black/80 p-8 rounded-2xl shadow-lg animate-fade-in-up relative overflow-hidden"
              >
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl animate-border-gradient"></div>
                <div className="relative z-10 flex flex-col gap-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Sign up to receive updates and be part of our mission. Be the first to know when we launch!
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="peer w-full px-6 py-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 focus:outline-none focus:border-emerald-500 bg-white dark:bg-black placeholder-transparent transition-all"
                      placeholder="Name"
                      required
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-6 -top-3 text-sm text-emerald-600 dark:text-emerald-400 bg-white dark:bg-black px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-500"
                    >
                      Your Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="peer w-full px-6 py-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 focus:outline-none focus:border-emerald-500 bg-white dark:bg-black placeholder-transparent transition-all"
                      placeholder="Email"
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-6 -top-3 text-sm text-emerald-600 dark:text-emerald-400 bg-white dark:bg-black px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-500"
                    >
                      Your Email
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Notify Me
                          <ArrowPathIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </button>
                  {message.text && (
                    <div className={`text-sm ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'} text-center`}>
                      {message.text}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="flex-1 animate-bounce-slow">
              <Image
                src="/Environment-cuate.svg"
                alt="Climate Action"
                width={500}
                height={300}
                className="relative rounded-2xl transform transition-all duration-700 animate-float-rotate group-hover:scale-105 group-hover:rotate-2"
              />
            </div>
          </div>
       
          <div className="flex justify-center gap-6 mt-12">
            <SocialIcon 
              href="https://instagram.com" 
              Icon={FaInstagram} 
              label="Follow us on Instagram"
            />
            <SocialIcon 
              href="https://twitter.com" 
              Icon={FaTwitter} 
              label="Follow us on Twitter"
            />
            <SocialIcon 
              href="https://linkedin.com" 
              Icon={FaLinkedin} 
              label="Connect on LinkedIn"
            />
            <SocialIcon 
              href="https://github.com" 
              Icon={FaGithub} 
              label="View on GitHub"
            />
          </div>
        </main>
      </div>
    </>
  );
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="group bg-white/80 dark:bg-black/80 rounded-2xl p-8 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10 relative overflow-hidden">
    <div className="absolute inset-0 border-t-2 border-l-2 border-transparent rounded-2xl animate-border-gradient-partial"></div>
    <div className="text-emerald-600 dark:text-emerald-400 mb-6 transform transition-transform group-hover:scale-110 duration-300">{icon}</div>
    <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{description}</p>
  </div>
);

const SocialIcon = ({ href, Icon, label }) => (
  <a 
    href={href}
    aria-label={label}
    className="group p-4 bg-white/90 dark:bg-black/90 rounded-full hover:bg-emerald-500/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20"
  >
    <Icon className="w-7 h-7 text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-500 transition-colors duration-300" />
  </a>
);
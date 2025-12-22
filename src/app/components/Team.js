"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaGithub,
  FaGlobe,
  FaEnvelope
} from 'react-icons/fa6';
import { UsersIcon } from '@heroicons/react/24/outline';

// Social media platform icon mapping
const SOCIAL_ICONS = {
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  github: FaGithub,
  website: FaGlobe,
  email: FaEnvelope
};

// Default fallback team data
const defaultTeamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Executive Director",
    image: "/project1.jpg",
    bio: "Climate change activist with 10+ years experience in environmental conservation.",
    socialMedia: [
      { platform: 'twitter', url: 'https://twitter.com/sarah' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/sarah' },
      { platform: 'instagram', url: 'https://instagram.com/sarah' }
    ]
  },
  {
    id: 2,
    name: "David Mukasa",
    role: "Head of Operations",
    image: "/project2.jpg",
    bio: "Former UN sustainable development advisor, leading our community initiatives.",
    socialMedia: [
      { platform: 'twitter', url: 'https://twitter.com/david' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/david' },
      { platform: 'instagram', url: 'https://instagram.com/david' }
    ]
  }
];

// Skeleton Loader Component
function TeamSkeleton() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-emerald-200 dark:bg-emerald-800 rounded-xl w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 max-w-full mx-auto animate-pulse" />
        </div>

        {/* Team Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white dark:bg-black/50 border border-emerald-100 dark:border-emerald-800 animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Skeleton */}
              <div className="w-full aspect-square mb-6 rounded-xl bg-emerald-200 dark:bg-emerald-800" />

              {/* Name Skeleton */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />

              {/* Role Skeleton */}
              <div className="h-4 bg-emerald-100 dark:bg-emerald-900/30 rounded w-1/2 mb-4" />

              {/* Bio Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
              </div>

              {/* Social Skeleton */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().team) {
        setTeamMembers(docSnap.data().team);
      } else {
        setTeamMembers(defaultTeamMembers);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      setTeamMembers(defaultTeamMembers);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 4, teamMembers.length));
      setIsLoadingMore(false);
    }, 500);
  };

  if (loading) {
    return <TeamSkeleton />;
  }

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 
            text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-4">
            <UsersIcon className="w-4 h-4" />
            Meet The Team
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The People Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Our Mission</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet the passionate individuals driving our mission forward and creating lasting environmental impact across Africa.
          </p>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-emerald-100 dark:border-emerald-900/30">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Team Coming Soon
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              We're building an amazing team of passionate individuals.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.slice(0, visibleCount).map((member, index) => (
                <div
                  key={member.id || index}
                  className="group relative rounded-2xl overflow-hidden
                    bg-white dark:bg-gray-800/50 
                    border border-gray-200 dark:border-gray-700
                    hover:border-emerald-300 dark:hover:border-emerald-600
                    transition-all duration-300 transform hover:-translate-y-1
                    shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-lg"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeIn 0.5s ease-out forwards'
                  }}
                >
                  {/* Member Image */}
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={member.image || '/project1.jpg'}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover Social Links */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 
                      opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 
                      transition-all duration-300">
                      {member.socialMedia && member.socialMedia.map((social, index) => {
                        const IconComponent = SOCIAL_ICONS[social.platform];
                        if (!IconComponent || !social.url) return null;

                        return (
                          <Link
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          >
                            <IconComponent className="w-4 h-4 text-white" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white
                      group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < teamMembers.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleShowMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 
                    text-white rounded-xl font-semibold
                    transition-all duration-300 transform hover:scale-105
                    shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-lg hover:shadow-emerald-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    'Show More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
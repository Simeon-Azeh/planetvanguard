"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { 
    FaInstagram, 
    FaXTwitter, 
    FaLinkedin 
  } from 'react-icons/fa6';
  

const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Executive Director",
    image: "/project1.jpg",
    bio: "Climate change activist with 10+ years experience in environmental conservation.",
    socials: [
        { icon: FaXTwitter, href: "https://twitter.com/sarah" },
        { icon: FaLinkedin, href: "https://linkedin.com/in/sarah" },
        { icon: FaInstagram, href: "https://instagram.com/sarah" }
      ]
  },
  {
    id: 2,
    name: "David Mukasa",
    role: "Head of Operations",
    image: "/project2.jpg",
    bio: "Former UN sustainable development advisor, leading our community initiatives.",
    socials: [
        { icon: FaXTwitter, href: "https://twitter.com/sarah" },
        { icon: FaLinkedin, href: "https://linkedin.com/in/sarah" },
        { icon: FaInstagram, href: "https://instagram.com/sarah" }
      ]
  },
  // Add more team members...
];

export default function Team() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 4, teamMembers.length));
      setIsLoading(false);
    }, 500);
  };

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
          <h2 className="text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">
            Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet the passionate individuals driving our mission forward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.slice(0, visibleCount).map((member) => (
            <div 
              key={member.id}
              className="group relative p-6 rounded-2xl 
                bg-white dark:bg-black/50 
                border border-emerald-100 dark:border-emerald-800
                hover:border-emerald-300 dark:hover:border-emerald-600
                transition-all duration-300 transform hover:-translate-y-1
                shadow-lg hover:shadow-xl"
            >
              {/* Member Image */}
              <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Member Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-400">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-500">
                    {member.role}
                  </p>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-4 pt-4">
  {member.socials.map((social, index) => (
    <Link
      key={index}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400
        transition-colors duration-300"
    >
      <social.icon className="w-5 h-5" />
    </Link>
  ))}
</div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < teamMembers.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleShowMore}
              disabled={isLoading}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 
                text-white rounded-xl 
                transition-all duration-300 transform hover:scale-105
                shadow-[0_0_15px_rgba(16,185,129,0.2)]
                hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                'Show More'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
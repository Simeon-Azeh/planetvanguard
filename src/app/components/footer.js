"use client"
import Image from 'next/image';
import Link from 'next/link';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaYoutube
} from 'react-icons/fa6';

export default function Footer() {
  const socialLinks = [
    { icon: FaXTwitter, href: 'https://twitter.com' },
    { icon: FaInstagram, href: 'https://instagram.com' },
    { icon: FaLinkedin, href: 'https://linkedin.com' },
    { icon: FaYoutube, href: 'https://youtube.com' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-emerald-900 to-emerald-950 dark:from-black dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-white">
                Planet Vanguard
              </span>
            </Link>
            <p className="text-emerald-100">
              Empowering African youth to create sustainable solutions
              for a greener tomorrow.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-emerald-800/50 hover:bg-emerald-700/50 
                    transform hover:scale-110
                    transition-all duration-300"
                >
                  <social.icon className="w-5 h-5 text-emerald-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['About', 'Projects', 'Team', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="group flex items-center gap-2 text-emerald-100 hover:text-white 
                      transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-emerald-300">
                      ›
                    </span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {[
                { icon: PhoneIcon, text: '+250 783 296 593' },
                { icon: EnvelopeIcon, text: 'info@planetvanguard.org' },
                { icon: MapPinIcon, text: 'Kigali, Rwanda' }
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-emerald-300" />
                  <span className="text-emerald-100">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Newsletter
            </h3>
            <p className="text-emerald-100 mb-4">
              Subscribe to our newsletter for updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-emerald-800/30 border border-emerald-700
                  focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                  outline-none transition-all duration-300 text-white placeholder-emerald-300"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 
                  bg-emerald-600 hover:bg-emerald-500 text-white 
                  px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Subscribe
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-emerald-800">
          <div className="py-6 text-center text-emerald-200">
            © {new Date().getFullYear()} Planet Vanguard. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
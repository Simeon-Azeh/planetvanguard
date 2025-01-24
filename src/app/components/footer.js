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
    <footer className="relative bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-emerald-800 dark:text-emerald-400">
                Planet Vanguard
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300">
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
                  className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 
                    hover:bg-emerald-200 dark:hover:bg-emerald-800/50 
                    transform hover:scale-110
                    transition-all duration-300"
                >
                  <social.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['About', 'Projects', 'Team', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 
                      dark:hover:text-emerald-400 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {[
                { icon: PhoneIcon, text: '+234 123 456 7890' },
                { icon: EnvelopeIcon, text: 'info@planetvanguard.org' },
                { icon: MapPinIcon, text: 'Kigali, Rwanda' }
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-gray-600 dark:text-gray-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-6">
              Newsletter
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Subscribe to our newsletter for updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black 
                  border border-emerald-200 dark:border-emerald-800
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 
                  bg-emerald-600 hover:bg-emerald-700 text-white 
                  px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Subscribe
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-emerald-100 dark:border-emerald-900">
          <div className="py-6 text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Planet Vanguard. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
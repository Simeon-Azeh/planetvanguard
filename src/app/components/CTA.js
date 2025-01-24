"use client"
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full 
            animate-bounce-slow">
            <SparklesIcon className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">
          Join Us in Making a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            Difference
          </span>
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Your support helps us create sustainable solutions and empower communities 
          across Africa. Together, we can build a greener future.
        </p>

        {/* Donate Button */}
        <Link 
          href="/donate"
          className="group inline-flex items-center gap-3 px-8 py-4 
            bg-gradient-to-r from-emerald-600 to-teal-500 
            hover:from-emerald-700 hover:to-teal-600
            text-white rounded-xl
            transition-all duration-300 transform hover:scale-105
            shadow-[0_0_20px_rgba(16,185,129,0.3)]
            hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
        >
          <HeartIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold">Donate Now</span>
        </Link>
      </div>
    </section>
  );
}
"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

export default function Initiatives() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
        <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full
          bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
        <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full
          bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            {/* Skeleton Title */}
            <div className="h-12 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800
              rounded-xl mb-8 animate-pulse w-96"></div>

            {/* Skeleton Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden
                    shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-emerald-100 dark:border-emerald-900/30
                    animate-pulse"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Skeleton Image */}
                  <div className="h-48 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800"></div>

                  {/* Skeleton Content */}
                  <div className="p-6 space-y-4">
                    {/* Category Badge Skeleton */}
                    <div className="h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full w-20"></div>

                    {/* Title Skeleton */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/6"></div>
                    </div>

                    {/* Location Skeleton */}
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
                    </div>

                    {/* Impact Stats Skeleton */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-20"></div>
                        <div className="h-4 bg-emerald-100 dark:bg-emerald-900/30 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skeleton Button */}
            <div className="mt-12 flex justify-center">
              <div className="h-14 bg-emerald-200 dark:bg-emerald-800 rounded-xl w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-black dark:to-emerald-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
      <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
      <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-8">
            Our Initiatives for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              {new Date().getFullYear()}
            </span>
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-emerald-100 dark:border-emerald-900/30">
              <div className="text-6xl mb-4 animate-bounce">🌱</div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No initiatives yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Stay tuned for exciting projects coming soon!
              </p>
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project, index) => (
                  <div
                    key={project.id}
                    className="group bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden
                      shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-lg transition-all duration-300
                      transform hover:-translate-y-1 backdrop-blur-sm
                      border border-emerald-100 dark:border-emerald-900/30
                      hover:border-emerald-200 dark:hover:border-emerald-800/50"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeIn 0.5s ease-out forwards'
                    }}
                  >
                    {/* Project Image */}
                    {project.image && (
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold 
                            rounded-full backdrop-blur-sm
                            ${project.status === 'ongoing'
                              ? 'bg-blue-500/90 text-white'
                              : project.status === 'completed'
                                ? 'bg-green-500/90 text-white'
                                : 'bg-orange-500/90 text-white'
                            }`}>
                            {project.status === 'ongoing' && <ClockIcon className="w-3 h-3" />}
                            {project.status === 'completed' && <CheckCircleIcon className="w-3 h-3" />}
                            {project.status === 'planned' && <DocumentIcon className="w-3 h-3" />}
                            {project.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Project Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      {project.category && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 
                          dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3">
                          {project.category}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 
                        group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors
                        line-clamp-2">
                        {project.title}
                      </h3>

                      {/* Description */}
                      {project.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                      )}

                      {/* Location */}
                      {project.location && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <svg className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{project.location}</span>
                        </div>
                      )}

                      {/* Impact Stats */}
                      {project.impact && project.impact.beneficiaries > 0 && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Beneficiaries</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {project.impact.beneficiaries.toLocaleString()}+
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Link
                  href="/initiatives"
                  className="group inline-flex items-center gap-2 px-8 py-4
                    bg-emerald-600 hover:bg-emerald-700
                    text-white rounded-xl font-semibold
                    transition-all transform hover:scale-105
                    shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-lg
                    hover:shadow-emerald-500/30"
                >
                  View All Initiatives
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
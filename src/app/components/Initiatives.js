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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
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
              2025
            </span>
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
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
              <div className="overflow-x-auto rounded-xl bg-white dark:bg-black">
                <table className="w-full">
                  <thead className="bg-emerald-50 dark:bg-emerald-900/20">
                    <tr>
                      <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400">Title</th>
                      <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">Category</th>
                      <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">Location</th>
                      <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr
                        key={project.id}
                        className="group border-b border-emerald-50 dark:border-emerald-900/50
                          hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20
                          transition-all duration-300"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeIn 0.5s ease-out forwards'
                        }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <DocumentIcon className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {project.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                          <span className="px-2 py-1 text-xs rounded-full
                            bg-emerald-100 dark:bg-emerald-900/50
                            text-emerald-600 dark:text-emerald-400">
                            {project.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                          {project.location}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {project.status === "ongoing" ? (
                              <ClockIcon className="w-5 h-5 text-blue-500" />
                            ) : project.status === "planned" ? (
                              <DocumentIcon className="w-5 h-5 text-orange-500" />
                            ) : (
                              <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            )}
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {project.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/initiatives"
                  className="group inline-flex items-center gap-2 px-6 py-3 
                    bg-emerald-600 hover:bg-emerald-700 
                    text-white rounded-xl 
                    transition-all transform hover:scale-105 
                    shadow-[0_0_15px_rgba(16,185,129,0.2)]
                    hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
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
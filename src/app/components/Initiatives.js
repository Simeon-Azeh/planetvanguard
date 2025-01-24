"use client"
import Link from 'next/link';
import { 
  ArrowRightIcon, 
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon 
} from '@heroicons/react/24/outline';

const initiativesData = [
  {
    id: 1,
    title: "Community Solar Panels",
    tags: ["Energy", "Community"],
    date: "March 2025",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Youth Climate Workshop",
    tags: ["Education", "Youth"],
    date: "May 2025",
    status: "Planned",
  },
  {
    id: 3,
    title: "Urban Farming Project",
    tags: ["Agriculture", "Urban"],
    date: "July 2025",
    status: "Approved",
  },
  {
    id: 4,
    title: "Water Conservation",
    tags: ["Water", "Conservation"],
    date: "September 2025",
    status: "Completed",
  }
];

export default function Initiatives() {
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

          <div className="overflow-x-auto rounded-xl bg-white dark:bg-black">
            <table className="w-full">
              <thead className="bg-emerald-50 dark:bg-emerald-900/20">
                <tr>
                  <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400">Title</th>
                  <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">Tags</th>
                  <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">Date</th>
                  <th className="py-4 px-6 text-left text-emerald-600 dark:text-emerald-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {initiativesData.map((initiative, index) => (
                  <tr 
                    key={initiative.id}
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
                          {initiative.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <div className="flex gap-2">
                        {initiative.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full
                              bg-emerald-100 dark:bg-emerald-900/50
                              text-emerald-600 dark:text-emerald-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      {initiative.date}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {initiative.status === "In Progress" ? (
                          <ClockIcon className="w-5 h-5 text-blue-500" />
                        ) : initiative.status === "Planned" ? (
                          <DocumentIcon className="w-5 h-5 text-orange-500" />
                        ) : (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-gray-600 dark:text-gray-400">
                          {initiative.status}
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
        </div>
      </div>
    </section>
  );
}
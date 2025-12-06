"use client"
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header({ user, adminData }) {
    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
                <div className="ml-12 lg:ml-0">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {adminData?.name?.split(' ')[0] || 'Admin'}
                    </h2>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your content and monitor platform activity
                    </p>
                </div>

                <div className="flex items-center gap-2 lg:gap-4">
                    <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <BellIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {adminData?.name || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                                {user?.email}
                            </p>
                        </div>
                        <UserCircleIcon className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
                    </div>

                    {/* Mobile User Icon */}
                    <div className="sm:hidden">
                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}

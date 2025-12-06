"use client"
import { useState } from 'react';
import {
    HomeIcon,
    FolderIcon,
    CalendarIcon,
    PhotoIcon,
    EnvelopeIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function Sidebar({ activeTab, setActiveTab }) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'overview', name: 'Overview', icon: HomeIcon },
        { id: 'projects', name: 'Projects', icon: FolderIcon },
        { id: 'events', name: 'Events', icon: CalendarIcon },
        { id: 'gallery', name: 'Gallery', icon: PhotoIcon },
        { id: 'newsletter', name: 'Newsletter', icon: EnvelopeIcon },
    ];

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleMenuItemClick = (itemId) => {
        setActiveTab(itemId);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
                {isMobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                    <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:sticky top-0 h-screen
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col z-40 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-emerald-600">Planet Vanguard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuItemClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}

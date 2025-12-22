"use client"
import { useState, useEffect, useRef } from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default function Header({ user, adminData }) {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationsRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const notificationsData = [];

            // Fetch recent event registrations
            const registrationsQuery = query(
                collection(db, 'eventRegistrations'),
                orderBy('registeredAt', 'desc'),
                limit(5)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            registrationsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                notificationsData.push({
                    id: doc.id,
                    type: 'registration',
                    title: `New event registration: ${data.fullName}`,
                    message: `Registered for ${data.eventTitle}`,
                    timestamp: data.registeredAt,
                    status: data.status || 'pending'
                });
            });

            // Fetch recent contact messages
            const contactsQuery = query(
                collection(db, 'contacts'),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const contactsSnapshot = await getDocs(contactsQuery);
            contactsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                notificationsData.push({
                    id: doc.id,
                    type: 'contact',
                    title: `New contact message from ${data.name || 'Anonymous'}`,
                    message: data.subject || data.message?.substring(0, 50) + '...',
                    timestamp: data.createdAt
                });
            });

            // Fetch recent testimonials
            const testimonialsQuery = query(
                collection(db, 'testimonials'),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const testimonialsSnapshot = await getDocs(testimonialsQuery);
            testimonialsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                notificationsData.push({
                    id: doc.id,
                    type: 'testimonial',
                    title: `New testimonial from ${data.name}`,
                    message: data.message?.substring(0, 50) + '...',
                    timestamp: data.createdAt
                });
            });

            // Fetch recent subscriptions
            const subscriptionsQuery = query(
                collection(db, 'subscriptions'),
                orderBy('subscribedAt', 'desc'),
                limit(5)
            );
            const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
            subscriptionsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                notificationsData.push({
                    id: doc.id,
                    type: 'subscription',
                    title: `New newsletter subscription`,
                    message: `Email: ${data.email}`,
                    timestamp: data.subscribedAt
                });
            });

            // Sort all notifications by timestamp
            notificationsData.sort((a, b) => {
                const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp);
                const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp);
                return bTime - aTime;
            });

            // Take only the 10 most recent
            const recentNotifications = notificationsData.slice(0, 10);
            setNotifications(recentNotifications);

            // Count unread notifications
            setUnreadCount(recentNotifications.length);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const formatNotificationTime = (timestamp) => {
        if (!timestamp) return 'Just now';

        const now = new Date();
        const time = timestamp?.toDate?.() || new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'registration':
                return '👤';
            case 'contact':
                return '💬';
            case 'testimonial':
                return '⭐';
            case 'subscription':
                return '📧';
            default:
                return '🔔';
        }
    };

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
                    {/* Notifications */}
                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label="Notifications"
                        >
                            <BellIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl
                                bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl z-50"
                            >
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Recent Activity
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Latest updates from your platform
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-sm">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                            {formatNotificationTime(notification.timestamp)}
                                                        </p>
                                                        {notification.status && (
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${notification.status === 'approved'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                    : notification.status === 'rejected'
                                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                                }`}>
                                                                {notification.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <BellIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

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

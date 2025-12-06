"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    FolderIcon,
    CalendarIcon,
    PhotoIcon,
    EnvelopeIcon,
    ArrowTrendingUpIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Overview() {
    const [stats, setStats] = useState({
        projects: 0,
        events: 0,
        galleryItems: 0,
        subscribers: 0,
        volunteers: 0,
        contacts: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projects, events, gallery, subscribers, volunteers, contacts] = await Promise.all([
                getDocs(collection(db, 'projects')),
                getDocs(collection(db, 'events')),
                getDocs(collection(db, 'gallery')),
                getDocs(collection(db, 'subscriptions')),
                getDocs(collection(db, 'volunteers')),
                getDocs(collection(db, 'contacts'))
            ]);

            setStats({
                projects: projects.size,
                events: events.size,
                galleryItems: gallery.size,
                subscribers: subscribers.size,
                volunteers: volunteers.size,
                contacts: contacts.size
            });

            // Get recent activity
            const activity = [];

            // Recent subscribers
            const recentSubs = await getDocs(
                query(collection(db, 'subscriptions'), orderBy('timestamp', 'desc'), limit(5))
            );
            recentSubs.forEach(doc => {
                activity.push({
                    type: 'subscription',
                    data: doc.data(),
                    timestamp: doc.data().timestamp
                });
            });

            // Recent contacts
            const recentContacts = await getDocs(
                query(collection(db, 'contacts'), orderBy('timestamp', 'desc'), limit(5))
            );
            recentContacts.forEach(doc => {
                activity.push({
                    type: 'contact',
                    data: doc.data(),
                    timestamp: doc.data().timestamp
                });
            });

            // Sort by timestamp
            activity.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
            setRecentActivity(activity.slice(0, 10));

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const statCards = [
        { name: 'Projects', value: stats.projects, icon: FolderIcon, color: 'emerald' },
        { name: 'Events', value: stats.events, icon: CalendarIcon, color: 'blue' },
        { name: 'Gallery Items', value: stats.galleryItems, icon: PhotoIcon, color: 'purple' },
        { name: 'Subscribers', value: stats.subscribers, icon: EnvelopeIcon, color: 'orange' },
        { name: 'Volunteers', value: stats.volunteers, icon: UserGroupIcon, color: 'pink' },
        { name: 'Contacts', value: stats.contacts, icon: ArrowTrendingUpIcon, color: 'cyan' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg`}>
                                    <Icon className={`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>

                {recentActivity.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent activity</p>
                ) : (
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'subscription'
                                    ? 'bg-orange-100 dark:bg-orange-900/20'
                                    : 'bg-blue-100 dark:bg-blue-900/20'
                                    }`}>
                                    {activity.type === 'subscription' ? (
                                        <EnvelopeIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    ) : (
                                        <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {activity.type === 'subscription' ? 'New Newsletter Subscriber' : 'New Contact Message'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {activity.data.email || activity.data.name}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {activity.timestamp?.toDate().toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

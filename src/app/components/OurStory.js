"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Default fallback data
const defaultStory = {
    title: "Our Story",
    content: "Founded in 2020, Planet Vanguard emerged from a simple belief: that African youth hold the key to solving our continent's environmental challenges. What started as a small group of passionate environmentalists has grown into a movement spanning multiple countries, touching thousands of lives and creating lasting change.",
    highlights: [
        { year: "2020", event: "Founded in Kigali, Rwanda" },
        { year: "2021", event: "Expanded to 5 African countries" },
        { year: "2022", event: "Launched youth leadership program" },
        { year: "2023", event: "Reached 50,000+ beneficiaries" },
        { year: "2024", event: "Established innovation hub" }
    ]
};

// Skeleton Loader Component
function OurStorySkeleton() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-black">
            <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content Skeleton */}
                    <div className="space-y-6">
                        <div className="h-8 bg-emerald-200 dark:bg-emerald-800 rounded-full w-32 animate-pulse" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
                            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
                            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/6 animate-pulse" />
                        </div>
                    </div>

                    {/* Timeline Skeleton */}
                    <div className="relative pl-8 border-l-2 border-emerald-200 dark:border-emerald-800 space-y-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="relative animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="absolute -left-[25px] w-4 h-4 bg-emerald-200 dark:bg-emerald-800 rounded-full" />
                                <div className="h-6 bg-emerald-200 dark:bg-emerald-800 rounded w-16 mb-2" />
                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-48" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function OurStory() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStoryData();
    }, []);

    const fetchStoryData = async () => {
        try {
            const docRef = doc(db, 'settings', 'about');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().story) {
                setData(docSnap.data().story);
            } else {
                setData(defaultStory);
            }
        } catch (error) {
            console.error('Error fetching story data:', error);
            setData(defaultStory);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <OurStorySkeleton />;
    }

    const story = data || defaultStory;

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-black">
            {/* Background Elements */}
            <div className="absolute -right-64 -top-64 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />
            <div className="absolute -left-64 -bottom-64 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 
              text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                            <BookOpenIcon className="w-4 h-4" />
                            Our Journey
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {story.title}
                        </h2>

                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {story.content}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-emerald-100 dark:border-emerald-800
                shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  transition-shadow">
                                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">5+</div>
                                <div className="text-gray-600 dark:text-gray-400">Years of Impact</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-emerald-100 dark:border-emerald-800
                shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  transition-shadow">
                                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">25+</div>
                                <div className="text-gray-600 dark:text-gray-400">Communities Served</div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500" />

                        <div className="space-y-8">
                            {story.highlights?.map((highlight, index) => (
                                <div
                                    key={index}
                                    className="relative pl-12 group"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 w-8 h-8 rounded-full 
                    bg-gradient-to-br from-emerald-500 to-teal-500
                    flex items-center justify-center shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] 
                    transform group-hover:scale-110 transition-transform">
                                        <CheckCircleIcon className="w-4 h-4 text-white" />
                                    </div>

                                    {/* Content Card */}
                                    <div className="p-5 rounded-xl bg-white dark:bg-gray-800/50 
                    border border-gray-200 dark:border-gray-700
                    hover:border-emerald-300 dark:hover:border-emerald-600
                    shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  transition-all
                    transform hover:-translate-y-1">
                                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                            {highlight.year}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {highlight.event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

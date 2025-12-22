"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';
import { SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';

// Default fallback data
const defaultHero = {
    title: "About Planet Vanguard",
    subtitle: "Empowering African youth to lead the environmental revolution and create sustainable change across the continent.",
    image: "/about-hero.jpg"
};

const defaultHeroStats = [
    { value: "2020", label: "Founded" },
    { value: "10+", label: "Countries" },
    { value: "5k+", label: "Beneficiaries" },
    { value: "20+", label: "Projects" }
];

// Skeleton Loader Component
function AboutHeroSkeleton() {
    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-black">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 animate-pulse" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="h-6 bg-emerald-300/50 dark:bg-emerald-700/50 rounded-full w-40 mx-auto mb-6 animate-pulse" />
                    <div className="h-14 bg-white/30 dark:bg-gray-800/30 rounded-xl w-full mb-4 animate-pulse" />
                    <div className="h-14 bg-white/30 dark:bg-gray-800/30 rounded-xl w-3/4 mx-auto mb-8 animate-pulse" />
                    <div className="h-6 bg-gray-200/50 dark:bg-gray-700/50 rounded w-full mb-2 animate-pulse" />
                    <div className="h-6 bg-gray-200/50 dark:bg-gray-700/50 rounded w-5/6 mx-auto animate-pulse" />
                </div>
            </div>
        </section>
    );
}

export default function AboutHero() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const docRef = doc(db, 'settings', 'about');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().hero) {
                const heroData = docSnap.data().hero;
                // Sanitize image URL to prevent private IP issues
                if (heroData.image && heroData.image.includes('istockphoto.com')) {
                    heroData.image = '/africa-environment.jpg';
                }
                setData({
                    hero: heroData,
                    heroStats: docSnap.data().heroStats || defaultHeroStats
                });
            } else {
                setData({
                    hero: defaultHero,
                    heroStats: defaultHeroStats
                });
            }
        } catch (error) {
            console.error('Error fetching hero data:', error);
            setData({
                hero: defaultHero,
                heroStats: defaultHeroStats
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <AboutHeroSkeleton />;
    }

    const hero = data?.hero || defaultHero;
    const heroStats = data?.heroStats || defaultHeroStats;

    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={hero.image || "/africa-environment.jpg"}
                    alt="About Planet Vanguard"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-900/80 to-teal-900/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse animation-delay-2000" />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6
            bg-white/10 backdrop-blur-sm border border-white/20
            text-emerald-200 text-sm rounded-full">
                        <HeartIcon className="w-4 h-4 animate-pulse" />
                        <span className="font-medium">Our Story</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {hero.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-emerald-100 leading-relaxed max-w-2xl mx-auto mb-8">
                        {hero.subtitle}
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        {heroStats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-emerald-200 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        className="fill-white dark:fill-black"
                    />
                </svg>
            </div>
        </section>
    );
}

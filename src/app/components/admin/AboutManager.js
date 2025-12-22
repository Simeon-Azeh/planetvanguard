"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    PencilIcon,
    PlusIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

// Social media platform configurations
const SOCIAL_MEDIA_PLATFORMS = {
    twitter: { name: 'Twitter', icon: 'FaXTwitter', color: 'text-sky-500' },
    linkedin: { name: 'LinkedIn', icon: 'FaLinkedin', color: 'text-blue-600' },
    instagram: { name: 'Instagram', icon: 'FaInstagram', color: 'text-pink-500' },
    facebook: { name: 'Facebook', icon: 'FaFacebook', color: 'text-blue-700' },
    youtube: { name: 'YouTube', icon: 'FaYoutube', color: 'text-red-500' },
    github: { name: 'GitHub', icon: 'FaGithub', color: 'text-gray-800 dark:text-gray-200' },
    website: { name: 'Website', icon: 'FaGlobe', color: 'text-emerald-600' },
    email: { name: 'Email', icon: 'FaEnvelope', color: 'text-gray-600' }
};

const defaultAboutData = {
    hero: {
        title: "About Planet Vanguard",
        subtitle: "Empowering African youth to lead the environmental revolution",
        image: "/about-hero.jpg"
    },
    heroStats: [
        { value: "2020", label: "Founded" },
        { value: "10+", label: "Countries" },
        { value: "5k+", label: "Beneficiaries" },
        { value: "20+", label: "Projects" }
    ],
    mission: {
        title: "Our Mission",
        content: "To empower African youth through sustainable environmental initiatives, fostering innovation and creating lasting positive impact on communities and ecosystems across the continent.",
        image: "/mission-vision.svg"
    },
    vision: {
        title: "Our Vision",
        content: "A thriving Africa where young leaders drive environmental sustainability, creating prosperous communities that live in harmony with nature, setting an example for global environmental stewardship."
    },
    values: ["Innovation", "Sustainability", "Community", "Education"],
    missionStats: [
        { value: "10+", label: "Years Experience" },
        { value: "50K+", label: "Lives Impacted" }
    ],
    story: {
        title: "Our Story",
        content: "Founded in 2020, Planet Vanguard emerged from a simple belief: that African youth hold the key to solving our continent's environmental challenges. What started as a small group of passionate environmentalists has grown into a movement spanning multiple countries.",
        highlights: [
            { year: "2020", event: "Founded in Kigali, Rwanda" },
            { year: "2021", event: "Expanded to 5 African countries" },
            { year: "2022", event: "Launched youth leadership program" },
            { year: "2023", event: "Reached 50,000+ beneficiaries" },
            { year: "2024", event: "Established innovation hub" }
        ]
    },
    goals: [
        {
            id: 1,
            title: "Environmental Education",
            description: "Educate 1 million youth on climate action by 2025",
            icon: "LightBulbIcon"
        },
        {
            id: 2,
            title: "Community Impact",
            description: "Establish sustainable programs in 100 communities",
            icon: "UsersIcon"
        },
        {
            id: 3,
            title: "Global Partnerships",
            description: "Build network of international environmental organizations",
            icon: "GlobeAltIcon"
        },
        {
            id: 4,
            title: "Carbon Reduction",
            description: "Reduce carbon emissions by 50% in target areas",
            icon: "ArrowTrendingDownIcon"
        },
        {
            id: 5,
            title: "Innovation Hub",
            description: "Create platform for sustainable technology solutions",
            icon: "SparklesIcon"
        },
        {
            id: 6,
            title: "Youth Leadership",
            description: "Train 5000 environmental leaders by 2025",
            icon: "HeartIcon"
        }
    ],
    team: [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Executive Director",
            image: "/project1.jpg",
            bio: "Climate change activist with 10+ years experience in environmental conservation.",
            socialMedia: [
                { platform: 'twitter', url: 'https://twitter.com/sarah' },
                { platform: 'linkedin', url: 'https://linkedin.com/in/sarah' },
                { platform: 'instagram', url: 'https://instagram.com/sarah' }
            ]
        },
        {
            id: 2,
            name: "David Mukasa",
            role: "Head of Operations",
            image: "/project2.jpg",
            bio: "Former UN sustainable development advisor, leading our community initiatives.",
            socialMedia: [
                { platform: 'twitter', url: 'https://twitter.com/david' },
                { platform: 'linkedin', url: 'https://linkedin.com/in/david' },
                { platform: 'instagram', url: 'https://instagram.com/david' }
            ]
        }
    ]
};

export default function AboutManager() {
    const [aboutData, setAboutData] = useState(defaultAboutData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const [editingGoal, setEditingGoal] = useState(null);
    const [editingTeamMember, setEditingTeamMember] = useState(null);
    const [newValue, setNewValue] = useState('');

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const docRef = doc(db, 'settings', 'about');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setAboutData({ ...defaultAboutData, ...docSnap.data() });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching about data:', error);
            setLoading(false);
        }
    };

    const saveAboutData = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, 'settings', 'about');
            await setDoc(docRef, aboutData);
            alert('About page content saved successfully!');
        } catch (error) {
            console.error('Error saving about data:', error);
            alert('Failed to save. Please try again.');
        }
        setSaving(false);
    };

    const updateField = (section, field, value) => {
        setAboutData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const addValue = () => {
        if (newValue.trim()) {
            setAboutData(prev => ({
                ...prev,
                values: [...prev.values, newValue.trim()]
            }));
            setNewValue('');
        }
    };

    const removeValue = (index) => {
        setAboutData(prev => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index)
        }));
    };

    const addGoal = () => {
        const newGoal = {
            id: Date.now(),
            title: "New Goal",
            description: "Goal description",
            icon: "SparklesIcon"
        };
        setAboutData(prev => ({
            ...prev,
            goals: [...prev.goals, newGoal]
        }));
        setEditingGoal(newGoal.id);
    };

    const updateGoal = (id, field, value) => {
        setAboutData(prev => ({
            ...prev,
            goals: prev.goals.map(g => g.id === id ? { ...g, [field]: value } : g)
        }));
    };

    const removeGoal = (id) => {
        setAboutData(prev => ({
            ...prev,
            goals: prev.goals.filter(g => g.id !== id)
        }));
    };

    const addTeamMember = () => {
        const newMember = {
            id: Date.now(),
            name: "New Team Member",
            role: "Role",
            image: "/project1.jpg",
            bio: "Bio description",
            socialMedia: []
        };
        setAboutData(prev => ({
            ...prev,
            team: [...prev.team, newMember]
        }));
        setEditingTeamMember(newMember.id);
    };

    const updateTeamMember = (id, field, value) => {
        setAboutData(prev => ({
            ...prev,
            team: prev.team.map(m => m.id === id ? { ...m, [field]: value } : m)
        }));
    };

    const addTeamMemberSocial = (memberId, platform, url) => {
        setAboutData(prev => ({
            ...prev,
            team: prev.team.map(m =>
                m.id === memberId
                    ? {
                        ...m,
                        socialMedia: [...(m.socialMedia || []), { platform, url }]
                    }
                    : m
            )
        }));
    };

    const updateTeamMemberSocial = (memberId, index, platform, url) => {
        setAboutData(prev => ({
            ...prev,
            team: prev.team.map(m =>
                m.id === memberId
                    ? {
                        ...m,
                        socialMedia: (m.socialMedia || []).map((sm, i) =>
                            i === index ? { platform, url } : sm
                        )
                    }
                    : m
            )
        }));
    };

    const removeTeamMemberSocial = (memberId, index) => {
        setAboutData(prev => ({
            ...prev,
            team: prev.team.map(m =>
                m.id === memberId
                    ? {
                        ...m,
                        socialMedia: (m.socialMedia || []).filter((_, i) => i !== index)
                    }
                    : m
            )
        }));
    };

    const removeTeamMember = (id) => {
        setAboutData(prev => ({
            ...prev,
            team: prev.team.filter(m => m.id !== id)
        }));
    };

    const addStoryHighlight = () => {
        const newHighlight = { year: new Date().getFullYear().toString(), event: "New milestone" };
        setAboutData(prev => ({
            ...prev,
            story: {
                ...prev.story,
                highlights: [...(prev.story?.highlights || []), newHighlight]
            }
        }));
    };

    const updateStoryHighlight = (index, field, value) => {
        setAboutData(prev => ({
            ...prev,
            story: {
                ...prev.story,
                highlights: prev.story.highlights.map((h, i) =>
                    i === index ? { ...h, [field]: value } : h
                )
            }
        }));
    };

    const removeStoryHighlight = (index) => {
        setAboutData(prev => ({
            ...prev,
            story: {
                ...prev.story,
                highlights: prev.story.highlights.filter((_, i) => i !== index)
            }
        }));
    };

    const tabs = [
        { id: 'hero', label: 'Hero Section' },
        { id: 'stats', label: 'Statistics' },
        { id: 'mission', label: 'Mission & Vision' },
        { id: 'story', label: 'Our Story' },
        { id: 'goals', label: 'Goals' },
        { id: 'team', label: 'Team' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Page Manager</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage the content displayed on the About page</p>
                </div>
                <button
                    onClick={saveAboutData}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700
            text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckIcon className="w-5 h-5" />
                            Save All Changes
                        </>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
              ${activeTab === tab.id
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                {/* Hero Section */}
                {activeTab === 'hero' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hero Section</h3>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={aboutData.hero?.title || ''}
                                    onChange={(e) => updateField('hero', 'title', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subtitle
                                </label>
                                <textarea
                                    value={aboutData.hero?.subtitle || ''}
                                    onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hero Image URL
                                </label>
                                <input
                                    type="text"
                                    value={aboutData.hero?.image || ''}
                                    onChange={(e) => updateField('hero', 'image', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="/about-hero.jpg or https://..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics */}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h3>

                        {/* Hero Stats */}
                        <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Hero Section Stats</h4>
                            <div className="space-y-3">
                                {(aboutData.heroStats || []).map((stat, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <input
                                            type="text"
                                            value={stat.value}
                                            onChange={(e) => {
                                                const newStats = [...(aboutData.heroStats || [])];
                                                newStats[index] = { ...newStats[index], value: e.target.value };
                                                setAboutData({ ...aboutData, heroStats: newStats });
                                            }}
                                            placeholder="Value (e.g., 2020)"
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={stat.label}
                                            onChange={(e) => {
                                                const newStats = [...(aboutData.heroStats || [])];
                                                newStats[index] = { ...newStats[index], label: e.target.value };
                                                setAboutData({ ...aboutData, heroStats: newStats });
                                            }}
                                            placeholder="Label (e.g., Founded)"
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={() => {
                                                const newStats = (aboutData.heroStats || []).filter((_, i) => i !== index);
                                                setAboutData({ ...aboutData, heroStats: newStats });
                                            }}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newStats = [...(aboutData.heroStats || []), { value: '', label: '' }];
                                        setAboutData({ ...aboutData, heroStats: newStats });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700
                    hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg font-medium"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Add Hero Stat
                                </button>
                            </div>
                        </div>

                        {/* Mission Stats */}
                        <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Mission Section Stats</h4>
                            <div className="space-y-3">
                                {(aboutData.missionStats || []).map((stat, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <input
                                            type="text"
                                            value={stat.value}
                                            onChange={(e) => {
                                                const newStats = [...(aboutData.missionStats || [])];
                                                newStats[index] = { ...newStats[index], value: e.target.value };
                                                setAboutData({ ...aboutData, missionStats: newStats });
                                            }}
                                            placeholder="Value (e.g., 10+)"
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={stat.label}
                                            onChange={(e) => {
                                                const newStats = [...(aboutData.missionStats || [])];
                                                newStats[index] = { ...newStats[index], label: e.target.value };
                                                setAboutData({ ...aboutData, missionStats: newStats });
                                            }}
                                            placeholder="Label (e.g., Years Experience)"
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={() => {
                                                const newStats = (aboutData.missionStats || []).filter((_, i) => i !== index);
                                                setAboutData({ ...aboutData, missionStats: newStats });
                                            }}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newStats = [...(aboutData.missionStats || []), { value: '', label: '' }];
                                        setAboutData({ ...aboutData, missionStats: newStats });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700
                    hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg font-medium"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Add Mission Stat
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mission & Vision */}
                {activeTab === 'mission' && (
                    <div className="space-y-8">
                        {/* Mission */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mission</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mission Title
                                </label>
                                <input
                                    type="text"
                                    value={aboutData.mission?.title || ''}
                                    onChange={(e) => updateField('mission', 'title', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mission Content
                                </label>
                                <textarea
                                    value={aboutData.mission?.content || ''}
                                    onChange={(e) => updateField('mission', 'content', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vision</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Vision Title
                                </label>
                                <input
                                    type="text"
                                    value={aboutData.vision?.title || ''}
                                    onChange={(e) => updateField('vision', 'title', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Vision Content
                                </label>
                                <textarea
                                    value={aboutData.vision?.content || ''}
                                    onChange={(e) => updateField('vision', 'content', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Values */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Values</h3>
                            <div className="flex flex-wrap gap-2">
                                {aboutData.values?.map((value, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30
                      text-emerald-700 dark:text-emerald-300 rounded-full"
                                    >
                                        <span>{value}</span>
                                        <button
                                            onClick={() => removeValue(index)}
                                            className="text-emerald-600 dark:text-emerald-400 hover:text-red-500"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    placeholder="Add new value..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && addValue()}
                                />
                                <button
                                    onClick={addValue}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Our Story */}
                {activeTab === 'story' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Our Story</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Story Title
                            </label>
                            <input
                                type="text"
                                value={aboutData.story?.title || ''}
                                onChange={(e) => updateField('story', 'title', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Story Content
                            </label>
                            <textarea
                                value={aboutData.story?.content || ''}
                                onChange={(e) => updateField('story', 'content', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>

                        {/* Timeline Highlights */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 dark:text-white">Timeline Highlights</h4>
                                <button
                                    onClick={addStoryHighlight}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Add Milestone
                                </button>
                            </div>
                            <div className="space-y-3">
                                {aboutData.story?.highlights?.map((highlight, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <input
                                            type="text"
                                            value={highlight.year}
                                            onChange={(e) => updateStoryHighlight(index, 'year', e.target.value)}
                                            className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold"
                                        />
                                        <input
                                            type="text"
                                            value={highlight.event}
                                            onChange={(e) => updateStoryHighlight(index, 'event', e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            onClick={() => removeStoryHighlight(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Goals */}
                {activeTab === 'goals' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals</h3>
                            <button
                                onClick={addGoal}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Goal
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {aboutData.goals?.map((goal) => (
                                <div
                                    key={goal.id}
                                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                                >
                                    {editingGoal === goal.id ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={goal.title}
                                                onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Goal title"
                                            />
                                            <textarea
                                                value={goal.description}
                                                onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Goal description"
                                                rows={2}
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => setEditingGoal(null)}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">{goal.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingGoal(goal.id)}
                                                    className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeGoal(goal.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Team */}
                {activeTab === 'team' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h3>
                            <button
                                onClick={addTeamMember}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Team Member
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {aboutData.team?.map((member) => (
                                <div
                                    key={member.id}
                                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                                >
                                    {editingTeamMember === member.id ? (
                                        <div className="grid gap-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        value={member.name}
                                                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Role</label>
                                                    <input
                                                        type="text"
                                                        value={member.role}
                                                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Image URL</label>
                                                <input
                                                    type="text"
                                                    value={member.image}
                                                    onChange={(e) => updateTeamMember(member.id, 'image', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                                                <textarea
                                                    value={member.bio}
                                                    onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    rows={2}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Social Media</label>
                                                <div className="space-y-2">
                                                    {(member.socialMedia || []).map((social, index) => (
                                                        <div key={index} className="flex gap-2 items-center">
                                                            <select
                                                                value={social.platform}
                                                                onChange={(e) => updateTeamMemberSocial(member.id, index, e.target.value, social.url)}
                                                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                            >
                                                                {Object.entries(SOCIAL_MEDIA_PLATFORMS).map(([key, config]) => (
                                                                    <option key={key} value={key}>{config.name}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="url"
                                                                value={social.url}
                                                                onChange={(e) => updateTeamMemberSocial(member.id, index, social.platform, e.target.value)}
                                                                placeholder="https://..."
                                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                            />
                                                            <button
                                                                onClick={() => removeTeamMemberSocial(member.id, index)}
                                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <div className="flex gap-2">
                                                        <select
                                                            id={`new-platform-${member.id}`}
                                                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                        >
                                                            {Object.entries(SOCIAL_MEDIA_PLATFORMS).map(([key, config]) => (
                                                                <option key={key} value={key}>{config.name}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="url"
                                                            id={`new-url-${member.id}`}
                                                            placeholder="https://..."
                                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const platformSelect = document.getElementById(`new-platform-${member.id}`);
                                                                const urlInput = document.getElementById(`new-url-${member.id}`);
                                                                if (platformSelect.value && urlInput.value) {
                                                                    addTeamMemberSocial(member.id, platformSelect.value, urlInput.value);
                                                                    urlInput.value = '';
                                                                }
                                                            }}
                                                            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                                                        >
                                                            <PlusIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => setEditingTeamMember(null)}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center overflow-hidden">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <PhotoIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                                                <p className="text-emerald-600 dark:text-emerald-400 text-sm">{member.role}</p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">{member.bio}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingTeamMember(member.id)}
                                                    className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeTeamMember(member.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

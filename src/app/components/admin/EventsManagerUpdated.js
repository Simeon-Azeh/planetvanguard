"use client"
import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    setDoc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    CheckIcon,
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    PhotoIcon,
    UserGroupIcon,
    Cog6ToothIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

const defaultHeroSettings = {
    title: "Events & Gatherings",
    subtitle: "Join us in our mission to create lasting environmental change.",
    image: "/africa-environment.jpg",
    stats: [
        { value: "50+", label: "Events Hosted" },
        { value: "5K+", label: "Participants" },
        { value: "15+", label: "Countries" }
    ]
};

const eventCategories = [
    'Workshop',
    'Conference',
    'Summit',
    'Webinar',
    'Cleanup',
    'Tree Planting',
    'Training',
    'Networking',
    'Fundraiser',
    'Other'
];

export default function EventsManager() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('events');
    const [heroSettings, setHeroSettings] = useState(defaultHeroSettings);
    const [savingHero, setSavingHero] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fullDescription: '',
        date: '',
        endDate: '',
        time: '',
        endTime: '',
        location: '',
        category: '',
        image: '',
        gallery: [],
        registrationDeadline: '',
        capacity: 0,
        featured: false,
        isVirtual: false,
        virtualLink: '',
        organizers: [],
        sponsors: [],
        impact: {
            participants: 0,
            treesPlanted: 0,
            wasteCollected: ''
        },
        googleDriveLink: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [newOrganizer, setNewOrganizer] = useState('');
    const [newSponsor, setNewSponsor] = useState('');

    useEffect(() => {
        fetchEvents();
        fetchHeroSettings();
    }, []);

    const fetchEvents = async () => {
        try {
            const q = query(collection(db, 'events'), orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const fetchHeroSettings = async () => {
        try {
            const docRef = doc(db, 'settings', 'events');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().hero) {
                setHeroSettings(docSnap.data().hero);
            }
        } catch (error) {
            console.error('Error fetching hero settings:', error);
        }
    };

    const saveHeroSettings = async () => {
        setSavingHero(true);
        try {
            await setDoc(doc(db, 'settings', 'events'), {
                hero: heroSettings,
                updatedAt: serverTimestamp()
            }, { merge: true });
            alert('Hero settings saved successfully!');
        } catch (error) {
            console.error('Error saving hero settings:', error);
            alert('Failed to save hero settings.');
        } finally {
            setSavingHero(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const eventData = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (editingEvent) {
                await updateDoc(doc(db, 'events', editingEvent.id), eventData);
            } else {
                await addDoc(collection(db, 'events'), {
                    ...eventData,
                    createdAt: serverTimestamp()
                });
            }

            setShowModal(false);
            setEditingEvent(null);
            resetForm();
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            description: event.description || '',
            fullDescription: event.fullDescription || '',
            date: event.date || '',
            endDate: event.endDate || '',
            time: event.time || '',
            endTime: event.endTime || '',
            location: event.location || '',
            category: event.category || '',
            image: event.image || '',
            gallery: event.gallery || [],
            registrationDeadline: event.registrationDeadline || '',
            capacity: event.capacity || 0,
            featured: event.featured || false,
            isVirtual: event.isVirtual || false,
            virtualLink: event.virtualLink || '',
            organizers: event.organizers || [],
            sponsors: event.sponsors || [],
            impact: event.impact || { participants: 0, treesPlanted: 0, wasteCollected: '' },
            googleDriveLink: event.googleDriveLink || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await deleteDoc(doc(db, 'events', id));
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            fullDescription: '',
            date: '',
            endDate: '',
            time: '',
            endTime: '',
            location: '',
            category: '',
            image: '',
            gallery: [],
            registrationDeadline: '',
            capacity: 0,
            featured: false,
            isVirtual: false,
            virtualLink: '',
            organizers: [],
            sponsors: [],
            impact: { participants: 0, treesPlanted: 0, wasteCollected: '' },
            googleDriveLink: ''
        });
        setNewGalleryUrl('');
        setNewOrganizer('');
        setNewSponsor('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        resetForm();
    };

    const addGalleryImage = () => {
        if (newGalleryUrl.trim()) {
            setFormData({
                ...formData,
                gallery: [...formData.gallery, newGalleryUrl.trim()]
            });
            setNewGalleryUrl('');
        }
    };

    const removeGalleryImage = (index) => {
        setFormData({
            ...formData,
            gallery: formData.gallery.filter((_, i) => i !== index)
        });
    };

    const addOrganizer = () => {
        if (newOrganizer.trim()) {
            setFormData({
                ...formData,
                organizers: [...formData.organizers, newOrganizer.trim()]
            });
            setNewOrganizer('');
        }
    };

    const removeOrganizer = (index) => {
        setFormData({
            ...formData,
            organizers: formData.organizers.filter((_, i) => i !== index)
        });
    };

    const addSponsor = () => {
        if (newSponsor.trim()) {
            setFormData({
                ...formData,
                sponsors: [...formData.sponsors, newSponsor.trim()]
            });
            setNewSponsor('');
        }
    };

    const removeSponsor = (index) => {
        setFormData({
            ...formData,
            sponsors: formData.sponsors.filter((_, i) => i !== index)
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isUpcoming = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) >= new Date();
    };

    const addHeroStat = () => {
        setHeroSettings({
            ...heroSettings,
            stats: [...(heroSettings.stats || []), { value: '', label: '' }]
        });
    };

    const updateHeroStat = (index, field, value) => {
        const newStats = [...heroSettings.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setHeroSettings({ ...heroSettings, stats: newStats });
    };

    const removeHeroStat = (index) => {
        setHeroSettings({
            ...heroSettings,
            stats: heroSettings.stats.filter((_, i) => i !== index)
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'events', label: 'Events', icon: CalendarIcon },
        { id: 'hero', label: 'Hero Settings', icon: Cog6ToothIcon }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events Manager</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage events and page settings
                    </p>
                </div>
                {activeTab === 'events' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Event
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px
                            ${activeTab === tab.id
                                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Hero Settings Tab */}
            {activeTab === 'hero' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Events Page Hero</h3>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hero Title
                            </label>
                            <input
                                type="text"
                                value={heroSettings.title}
                                onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hero Subtitle
                            </label>
                            <textarea
                                value={heroSettings.subtitle}
                                onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })}
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
                                value={heroSettings.image}
                                onChange={(e) => setHeroSettings({ ...heroSettings, image: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="/image.jpg or https://..."
                            />
                        </div>

                        {/* Hero Stats */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hero Statistics
                            </label>
                            <div className="space-y-3">
                                {(heroSettings.stats || []).map((stat, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <input
                                            type="text"
                                            value={stat.value}
                                            onChange={(e) => updateHeroStat(index, 'value', e.target.value)}
                                            placeholder="Value (e.g., 50+)"
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={stat.label}
                                            onChange={(e) => updateHeroStat(index, 'label', e.target.value)}
                                            placeholder="Label (e.g., Events)"
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={() => removeHeroStat(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addHeroStat}
                                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Add Statistic
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={saveHeroSettings}
                        disabled={savingHero}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700
                            text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                        {savingHero ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckIcon className="w-5 h-5" />
                                Save Hero Settings
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Events List Tab */}
            {activeTab === 'events' && (
                <>
                    {events.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">No events yet. Create your first event!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {event.image && (
                                        <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                                    {event.title}
                                                </h3>
                                                <div className="flex gap-2 flex-wrap">
                                                    {isUpcoming(event.date) ? (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                            Upcoming
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                                                            Past
                                                        </span>
                                                    )}
                                                    {event.featured && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                                            Featured
                                                        </span>
                                                    )}
                                                    {event.category && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                            {event.category}
                                                        </span>
                                                    )}
                                                    {event.isVirtual && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                                                            Virtual
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                            {event.description}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            {event.date && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    <span>{formatDate(event.date)}</span>
                                                </div>
                                            )}
                                            {event.time && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <ClockIcon className="w-4 h-4" />
                                                    <span>{event.time}</span>
                                                </div>
                                            )}
                                            {event.location && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <MapPinIcon className="w-4 h-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                            {event.capacity !== undefined && event.capacity !== null && (
                                                <div className={`flex items-center gap-2 text-sm ${event.capacity > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    <UserGroupIcon className="w-4 h-4" />
                                                    <span>{event.capacity > 0 ? `Capacity: ${event.capacity} spots` : 'Full (0 spots)'}</span>
                                                </div>
                                            )}
                                            {event.gallery && event.gallery.length > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <PhotoIcon className="w-4 h-4" />
                                                    <span>{event.gallery.length} gallery images</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Event Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingEvent ? 'Edit Event' : 'Add New Event'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Basic Information</h4>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Event Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter event title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Short Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Brief description for cards"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.fullDescription}
                                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Detailed description for event page"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select category</option>
                                            {eventCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Max attendees (0 = unlimited)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Date & Time</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Registration Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.registrationDeadline}
                                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>

                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="isVirtual"
                                        checked={formData.isVirtual}
                                        onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isVirtual" className="text-sm text-gray-700 dark:text-gray-300">
                                        This is a virtual event
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {formData.isVirtual ? 'Platform / Virtual Location' : 'Physical Location'} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        placeholder={formData.isVirtual ? "e.g., Zoom, Google Meet" : "Event venue address"}
                                    />
                                </div>

                                {formData.isVirtual && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Virtual Meeting Link
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.virtualLink}
                                            onChange={(e) => setFormData({ ...formData, virtualLink: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="https://zoom.us/..."
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Media */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Media</h4>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Cover Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gallery Images
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="url"
                                            value={newGalleryUrl}
                                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Add gallery image URL"
                                        />
                                        <button
                                            type="button"
                                            onClick={addGalleryImage}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {formData.gallery.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {formData.gallery.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <XMarkIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Google Drive Gallery Link
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.googleDriveLink}
                                        onChange={(e) => setFormData({ ...formData, googleDriveLink: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                            </div>

                            {/* Impact (for past events) */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Impact Metrics (for past events)</h4>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Participants
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.impact.participants}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                impact: { ...formData.impact, participants: parseInt(e.target.value) || 0 }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Trees Planted
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.impact.treesPlanted}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                impact: { ...formData.impact, treesPlanted: parseInt(e.target.value) || 0 }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Waste Collected
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.impact.wasteCollected}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                impact: { ...formData.impact, wasteCollected: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., 500kg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Organizers & Sponsors */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Organizers & Sponsors</h4>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Organizers
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newOrganizer}
                                            onChange={(e) => setNewOrganizer(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Add organizer name"
                                        />
                                        <button
                                            type="button"
                                            onClick={addOrganizer}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.organizers.map((org, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                                                {org}
                                                <button type="button" onClick={() => removeOrganizer(index)} className="text-gray-500 hover:text-red-500">
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sponsors
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newSponsor}
                                            onChange={(e) => setNewSponsor(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Add sponsor name"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSponsor}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.sponsors.map((sponsor, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                                                {sponsor}
                                                <button type="button" onClick={() => removeSponsor(index)} className="text-gray-500 hover:text-red-500">
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                                        Featured Event
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="w-5 h-5" />
                                            {editingEvent ? 'Update Event' : 'Create Event'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, addDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    EnvelopeIcon,
    EnvelopeOpenIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    TrashIcon,
    EyeIcon,
    CheckCircleIcon,
    XMarkIcon,
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    UserIcon,
    BuildingOfficeIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    PencilIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ChevronUpDownIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function ContactManager() {
    const [activeTab, setActiveTab] = useState('messages');
    const [messages, setMessages] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [contactSettings, setContactSettings] = useState({
        phone: '+250 783 296 593',
        email: 'contact@planetvanguard.org',
        address: 'KG 123 St, Innovation City',
        city: 'Kigali, Rwanda',
        workingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
        responseTime: '24 hours',
        socialLinks: {
            twitter: '',
            facebook: '',
            instagram: '',
            linkedin: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [faqForm, setFaqForm] = useState({
        question: '',
        answer: '',
        order: 0,
        published: true
    });
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchMessages(),
                fetchFaqs(),
                fetchContactSettings()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchFaqs = async () => {
        try {
            const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    const fetchContactSettings = async () => {
        try {
            const docRef = doc(db, 'siteSettings', 'contact');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContactSettings(prev => ({ ...prev, ...docSnap.data() }));
            }
        } catch (error) {
            console.error('Error fetching contact settings:', error);
        }
    };

    const saveContactSettings = async () => {
        setSavingSettings(true);
        try {
            const docRef = doc(db, 'siteSettings', 'contact');
            await setDoc(docRef, {
                ...contactSettings,
                updatedAt: new Date()
            });
            alert('Contact settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSavingSettings(false);
        }
    };

    const updateMessageStatus = async (messageId, newStatus) => {
        try {
            const updates = { status: newStatus, updatedAt: new Date() };
            if (newStatus === 'read') updates.readAt = new Date();
            if (newStatus === 'replied') updates.repliedAt = new Date();

            await updateDoc(doc(db, 'contacts', messageId), updates);
            setMessages(messages.map(msg =>
                msg.id === messageId ? { ...msg, ...updates } : msg
            ));
            if (selectedMessage?.id === messageId) {
                setSelectedMessage({ ...selectedMessage, ...updates });
            }
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const deleteMessage = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await deleteDoc(doc(db, 'contacts', messageId));
            setMessages(messages.filter(msg => msg.id !== messageId));
            if (selectedMessage?.id === messageId) setSelectedMessage(null);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const saveFaq = async () => {
        try {
            if (editingFaq) {
                await updateDoc(doc(db, 'faqs', editingFaq.id), {
                    ...faqForm,
                    updatedAt: new Date()
                });
            } else {
                await addDoc(collection(db, 'faqs'), {
                    ...faqForm,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
            await fetchFaqs();
            setShowFaqModal(false);
            setEditingFaq(null);
            setFaqForm({ question: '', answer: '', order: 0, published: true });
        } catch (error) {
            console.error('Error saving FAQ:', error);
        }
    };

    const deleteFaq = async (faqId) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            await deleteDoc(doc(db, 'faqs', faqId));
            setFaqs(faqs.filter(f => f.id !== faqId));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        }
    };

    const moveFaq = async (index, direction) => {
        const newFaqs = [...faqs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= faqs.length) return;

        [newFaqs[index], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[index]];

        try {
            await Promise.all(newFaqs.map((faq, i) =>
                updateDoc(doc(db, 'faqs', faq.id), { order: i })
            ));
            setFaqs(newFaqs.map((faq, i) => ({ ...faq, order: i })));
        } catch (error) {
            console.error('Error reordering FAQs:', error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const configs = {
            new: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'New' },
            read: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Read' },
            replied: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Replied' },
            archived: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', label: 'Archived' }
        };
        return configs[status] || configs.new;
    };

    const getUrgencyBadge = (urgency) => {
        const configs = {
            low: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', label: 'Low' },
            normal: { color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', label: 'Normal' },
            high: { color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', label: 'Urgent' }
        };
        return configs[urgency] || configs.normal;
    };

    const getInquiryTypeLabel = (type) => {
        const types = {
            general: 'General Inquiry',
            volunteer: 'Volunteering',
            partnership: 'Partnership',
            donation: 'Donations',
            events: 'Events',
            media: 'Media/Press'
        };
        return types[type] || type;
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch =
            msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.message?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
        const matchesType = typeFilter === 'all' || msg.inquiryType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const stats = {
        total: messages.length,
        new: messages.filter(m => m.status === 'new').length,
        read: messages.filter(m => m.status === 'read').length,
        replied: messages.filter(m => m.status === 'replied').length,
        urgent: messages.filter(m => m.urgency === 'high' && m.status !== 'replied').length
    };

    const tabs = [
        { id: 'messages', label: 'Messages', icon: EnvelopeIcon, count: stats.new },
        { id: 'faqs', label: 'FAQs', icon: QuestionMarkCircleIcon, count: faqs.length },
        { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading contact data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage messages, FAQs, and contact settings</p>
                </div>
                <button
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <EnvelopeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.new}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">New</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <EnvelopeOpenIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.read}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Read</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.replied}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Replied</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.urgent}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Urgent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex gap-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${activeTab === tab.id
                                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Messages Tab */}
            {activeTab === 'messages' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="all">All Types</option>
                            <option value="general">General</option>
                            <option value="volunteer">Volunteering</option>
                            <option value="partnership">Partnership</option>
                            <option value="donation">Donations</option>
                            <option value="events">Events</option>
                            <option value="media">Media/Press</option>
                        </select>
                    </div>

                    {/* Messages List */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {filteredMessages.length === 0 ? (
                            <div className="text-center py-12">
                                <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">No messages found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredMessages.map((message) => {
                                    const statusBadge = getStatusBadge(message.status);
                                    const urgencyBadge = getUrgencyBadge(message.urgency);
                                    return (
                                        <div
                                            key={message.id}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${message.status === 'new' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                }`}
                                            onClick={() => {
                                                setSelectedMessage(message);
                                                if (message.status === 'new') {
                                                    updateMessageStatus(message.id, 'read');
                                                }
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                            {message.name}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusBadge.color}`}>
                                                            {statusBadge.label}
                                                        </span>
                                                        {message.urgency === 'high' && (
                                                            <span className={`px-2 py-0.5 text-xs rounded-full ${urgencyBadge.color}`}>
                                                                {urgencyBadge.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                        {message.email}
                                                        {message.organization && ` • ${message.organization}`}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                        {message.subject}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                        {message.message}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                        {formatDate(message.createdAt)}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                                        {getInquiryTypeLabel(message.inquiryType)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setEditingFaq(null);
                                setFaqForm({ question: '', answer: '', order: faqs.length, published: true });
                                setShowFaqModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add FAQ
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        {faqs.length === 0 ? (
                            <div className="text-center py-12">
                                <QuestionMarkCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">No FAQs yet. Add your first FAQ!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {faqs.map((faq, index) => (
                                    <div key={faq.id} className="p-4 flex items-start gap-4">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => moveFaq(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                <ArrowUpIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveFaq(index, 'down')}
                                                disabled={index === faqs.length - 1}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                <ArrowDownIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                                                {!faq.published && (
                                                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {faq.answer}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingFaq(faq);
                                                    setFaqForm(faq);
                                                    setShowFaqModal(true);
                                                }}
                                                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteFaq(faq.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={contactSettings.phone}
                                    onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={contactSettings.email}
                                    onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Street Address
                            </label>
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={contactSettings.address}
                                    onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                City / Region
                            </label>
                            <input
                                type="text"
                                value={contactSettings.city}
                                onChange={(e) => setContactSettings({ ...contactSettings, city: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Working Hours
                            </label>
                            <div className="relative">
                                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={contactSettings.workingHours}
                                    onChange={(e) => setContactSettings({ ...contactSettings, workingHours: e.target.value })}
                                    placeholder="Mon-Fri: 8:00 AM - 5:00 PM"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Response Time
                            </label>
                            <input
                                type="text"
                                value={contactSettings.responseTime}
                                onChange={(e) => setContactSettings({ ...contactSettings, responseTime: e.target.value })}
                                placeholder="24 hours"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-8 mb-4">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Twitter / X
                            </label>
                            <input
                                type="url"
                                value={contactSettings.socialLinks?.twitter || ''}
                                onChange={(e) => setContactSettings({
                                    ...contactSettings,
                                    socialLinks: { ...contactSettings.socialLinks, twitter: e.target.value }
                                })}
                                placeholder="https://twitter.com/..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={contactSettings.socialLinks?.facebook || ''}
                                onChange={(e) => setContactSettings({
                                    ...contactSettings,
                                    socialLinks: { ...contactSettings.socialLinks, facebook: e.target.value }
                                })}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={contactSettings.socialLinks?.instagram || ''}
                                onChange={(e) => setContactSettings({
                                    ...contactSettings,
                                    socialLinks: { ...contactSettings.socialLinks, instagram: e.target.value }
                                })}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={contactSettings.socialLinks?.linkedin || ''}
                                onChange={(e) => setContactSettings({
                                    ...contactSettings,
                                    socialLinks: { ...contactSettings.socialLinks, linkedin: e.target.value }
                                })}
                                placeholder="https://linkedin.com/company/..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={saveContactSettings}
                            disabled={savingSettings}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                            {savingSettings ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {selectedMessage.subject}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(selectedMessage.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Sender Info */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedMessage.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                                    {selectedMessage.phone && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.phone}</p>
                                    )}
                                    {selectedMessage.organization && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                            <BuildingOfficeIcon className="w-4 h-4" />
                                            {selectedMessage.organization}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(selectedMessage.status).color}`}>
                                    {getStatusBadge(selectedMessage.status).label}
                                </span>
                                <span className={`px-3 py-1 text-sm rounded-full ${getUrgencyBadge(selectedMessage.urgency).color}`}>
                                    {getUrgencyBadge(selectedMessage.urgency).label} Priority
                                </span>
                                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                    {getInquiryTypeLabel(selectedMessage.inquiryType)}
                                </span>
                                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                    Prefers: {selectedMessage.preferredContact || 'Email'}
                                </span>
                            </div>

                            {/* Message Content */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                    onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    Reply via Email
                                </a>
                                {selectedMessage.phone && (
                                    <a
                                        href={`tel:${selectedMessage.phone}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <PhoneIcon className="w-5 h-5" />
                                        Call
                                    </a>
                                )}
                                <button
                                    onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Archive
                                </button>
                                <button
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ Modal */}
            {showFaqModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowFaqModal(false);
                                    setEditingFaq(null);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Question
                                </label>
                                <input
                                    type="text"
                                    value={faqForm.question}
                                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                                    placeholder="What is your question?"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Answer
                                </label>
                                <textarea
                                    value={faqForm.answer}
                                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                                    rows={4}
                                    placeholder="Provide a helpful answer..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="faq-published"
                                    checked={faqForm.published}
                                    onChange={(e) => setFaqForm({ ...faqForm, published: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor="faq-published" className="text-sm text-gray-700 dark:text-gray-300">
                                    Publish this FAQ
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowFaqModal(false);
                                    setEditingFaq(null);
                                }}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveFaq}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                {editingFaq ? 'Update FAQ' : 'Add FAQ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
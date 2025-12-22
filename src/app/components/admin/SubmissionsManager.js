"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    UserGroupIcon,
    HeartIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    TrashIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    XMarkIcon,
    BriefcaseIcon,
    CurrencyDollarIcon,
    SparklesIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function SubmissionsManager() {
    const [activeTab, setActiveTab] = useState('volunteers');
    const [volunteers, setVolunteers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [updating, setUpdating] = useState(false);

    const tabs = [
        { id: 'volunteers', label: 'Volunteer Applications', icon: UserGroupIcon },
        { id: 'donations', label: 'Donation Interests', icon: HeartIcon }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch volunteer applications
            const volunteersQuery = query(
                collection(db, 'volunteerApplications'),
                orderBy('submittedAt', 'desc')
            );
            const volunteersSnapshot = await getDocs(volunteersQuery);
            const volunteersData = volunteersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVolunteers(volunteersData);

            // Fetch donation interests
            const donationsQuery = query(
                collection(db, 'donationInterests'),
                orderBy('submittedAt', 'desc')
            );
            const donationsSnapshot = await getDocs(donationsQuery);
            const donationsData = donationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDonations(donationsData);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (collectionName, itemId, newStatus) => {
        setUpdating(true);
        try {
            const docRef = doc(db, collectionName, itemId);
            await updateDoc(docRef, { status: newStatus });

            // Update local state
            if (collectionName === 'volunteerApplications') {
                setVolunteers(prev => prev.map(item =>
                    item.id === itemId ? { ...item, status: newStatus } : item
                ));
            } else {
                setDonations(prev => prev.map(item =>
                    item.id === itemId ? { ...item, status: newStatus } : item
                ));
            }

            if (selectedItem?.id === itemId) {
                setSelectedItem(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdating(false);
        }
    };

    const deleteSubmission = async (collectionName, itemId) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;

        try {
            await deleteDoc(doc(db, collectionName, itemId));

            if (collectionName === 'volunteerApplications') {
                setVolunteers(prev => prev.filter(item => item.id !== itemId));
            } else {
                setDonations(prev => prev.filter(item => item.id !== itemId));
            }

            if (selectedItem?.id === itemId) {
                setShowDetailModal(false);
                setSelectedItem(null);
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            'invoice-sent': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
                {status?.replace('-', ' ') || 'pending'}
            </span>
        );
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const currentData = activeTab === 'volunteers' ? volunteers : donations;

    const filteredData = currentData.filter(item => {
        const matchesSearch =
            item.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: currentData.length,
        pending: currentData.filter(i => i.status === 'pending').length,
        approved: currentData.filter(i => i.status === 'approved' || i.status === 'completed').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Submissions Manager
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage volunteer applications and donation interests
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                >
                    <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                {tab.id === 'volunteers' ? volunteers.length : donations.length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Approved/Completed</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    {activeTab === 'donations' && (
                        <>
                            <option value="invoice-sent">Invoice Sent</option>
                            <option value="completed">Completed</option>
                        </>
                    )}
                </select>
            </div>

            {/* Data Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {activeTab === 'volunteers' ? (
                            <UserGroupIcon className="w-8 h-8 text-gray-400" />
                        ) : (
                            <HeartIcon className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchQuery || statusFilter !== 'all'
                            ? 'No submissions match your filters'
                            : 'No submissions yet'}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    {activeTab === 'donations' && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                    )}
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium">
                                                    {item.firstName?.[0]}{item.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.firstName} {item.lastName}
                                                    </p>
                                                    {item.organization && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {item.organization}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {item.email}
                                        </td>
                                        {activeTab === 'donations' && (
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {item.currency} {item.estimatedAmount}
                                            </td>
                                        )}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(item.submittedAt)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setShowDetailModal(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteSubmission(
                                                        activeTab === 'volunteers' ? 'volunteerApplications' : 'donationInterests',
                                                        item.id
                                                    )}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className={`sticky top-0 p-6 z-10 ${activeTab === 'volunteers'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : 'bg-gradient-to-r from-rose-500 to-pink-500'
                            }`}>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedItem(null);
                                }}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-white" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                                    {selectedItem.firstName?.[0]}{selectedItem.lastName?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {selectedItem.firstName} {selectedItem.lastName}
                                    </h2>
                                    <p className="text-white/80">{selectedItem.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Actions */}
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 self-center mr-2">
                                    Update Status:
                                </span>
                                {activeTab === 'volunteers' ? (
                                    <>
                                        <button
                                            onClick={() => updateStatus('volunteerApplications', selectedItem.id, 'pending')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'pending'
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}
                                        >
                                            Pending
                                        </button>
                                        <button
                                            onClick={() => updateStatus('volunteerApplications', selectedItem.id, 'contacted')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'contacted'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}
                                        >
                                            Contacted
                                        </button>
                                        <button
                                            onClick={() => updateStatus('volunteerApplications', selectedItem.id, 'approved')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'approved'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                }`}
                                        >
                                            Approved
                                        </button>
                                        <button
                                            onClick={() => updateStatus('volunteerApplications', selectedItem.id, 'rejected')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'rejected'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                        >
                                            Rejected
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => updateStatus('donationInterests', selectedItem.id, 'pending')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'pending'
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}
                                        >
                                            Pending
                                        </button>
                                        <button
                                            onClick={() => updateStatus('donationInterests', selectedItem.id, 'contacted')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'contacted'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}
                                        >
                                            Contacted
                                        </button>
                                        <button
                                            onClick={() => updateStatus('donationInterests', selectedItem.id, 'invoice-sent')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'invoice-sent'
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400'
                                                }`}
                                        >
                                            Invoice Sent
                                        </button>
                                        <button
                                            onClick={() => updateStatus('donationInterests', selectedItem.id, 'completed')}
                                            disabled={updating}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedItem.status === 'completed'
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                }`}
                                        >
                                            Completed
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <EnvelopeIcon className="w-5 h-5 text-emerald-500" />
                                    Contact Information
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-gray-900 dark:text-white">{selectedItem.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="text-gray-900 dark:text-white">{selectedItem.phone || 'N/A'}</p>
                                    </div>
                                    {selectedItem.country && (
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Location</p>
                                            <p className="text-gray-900 dark:text-white">
                                                {selectedItem.city ? `${selectedItem.city}, ` : ''}{selectedItem.country}
                                            </p>
                                        </div>
                                    )}
                                    {selectedItem.organization && (
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Organization</p>
                                            <p className="text-gray-900 dark:text-white">{selectedItem.organization}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Volunteer-specific fields */}
                            {activeTab === 'volunteers' && (
                                <>
                                    {selectedItem.occupation && (
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                <BriefcaseIcon className="w-5 h-5 text-emerald-500" />
                                                Professional Background
                                            </h3>
                                            <div className="text-sm">
                                                <p className="text-gray-500 dark:text-gray-400">Occupation</p>
                                                <p className="text-gray-900 dark:text-white">{selectedItem.occupation}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.interests?.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                <SparklesIcon className="w-5 h-5 text-emerald-500" />
                                                Areas of Interest
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedItem.interests.map((interest, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.skills?.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedItem.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.availability && (
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Availability</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{selectedItem.availability}</p>
                                        </div>
                                    )}

                                    {selectedItem.experience && (
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Previous Experience</h3>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedItem.experience}</p>
                                        </div>
                                    )}

                                    {selectedItem.motivation && (
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Motivation</h3>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedItem.motivation}</p>
                                        </div>
                                    )}

                                    {selectedItem.howHeard && (
                                        <div className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">How they heard about us: </span>
                                            <span className="text-gray-900 dark:text-white capitalize">{selectedItem.howHeard.replace('-', ' ')}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Donation-specific fields */}
                            {activeTab === 'donations' && (
                                <>
                                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <CurrencyDollarIcon className="w-5 h-5 text-rose-500" />
                                            Donation Details
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Amount</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {selectedItem.currency} {selectedItem.estimatedAmount}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Type</p>
                                                <p className="text-gray-900 dark:text-white capitalize">{selectedItem.donationType}</p>
                                            </div>
                                            {selectedItem.preferredProject && (
                                                <div>
                                                    <p className="text-gray-500 dark:text-gray-400">Preferred Project</p>
                                                    <p className="text-gray-900 dark:text-white capitalize">
                                                        {selectedItem.preferredProject.replace('-', ' ')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedItem.message && (
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Message</h3>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedItem.message}</p>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            {selectedItem.wantReceipt ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="text-gray-700 dark:text-gray-300">Wants tax receipt</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectedItem.wantUpdates ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="text-gray-700 dark:text-gray-300">Wants updates</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Submission Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <CalendarIcon className="w-5 h-5" />
                                Submitted on {formatDate(selectedItem.submittedAt)}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <a
                                    href={`mailto:${selectedItem.email}`}
                                    className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <EnvelopeIcon className="w-5 h-5" />
                                    Send Email
                                </a>
                                <button
                                    onClick={() => deleteSubmission(
                                        activeTab === 'volunteers' ? 'volunteerApplications' : 'donationInterests',
                                        selectedItem.id
                                    )}
                                    className="py-3 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client"
import { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    TrashIcon,
    XMarkIcon,
    CheckIcon,
    CalendarIcon,
    UserGroupIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function RegistrationsManager() {
    const [registrations, setRegistrations] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch events for filter dropdown
            const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'));
            const eventsSnapshot = await getDocs(eventsQuery);
            const eventsData = eventsSnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                date: doc.data().date
            }));
            setEvents(eventsData);

            // Fetch all registrations
            const registrationsQuery = query(
                collection(db, 'eventRegistrations'),
                orderBy('registeredAt', 'desc')
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            const registrationsData = registrationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRegistrations(registrationsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateRegistrationStatus = async (id, newStatus) => {
        setUpdating(true);
        try {
            await updateDoc(doc(db, 'eventRegistrations', id), {
                status: newStatus
            });
            setRegistrations(registrations.map(reg =>
                reg.id === id ? { ...reg, status: newStatus } : reg
            ));
            if (selectedRegistration?.id === id) {
                setSelectedRegistration({ ...selectedRegistration, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        } finally {
            setUpdating(false);
        }
    };

    const deleteRegistration = async (id) => {
        if (!confirm('Are you sure you want to delete this registration?')) return;

        try {
            await deleteDoc(doc(db, 'eventRegistrations', id));
            setRegistrations(registrations.filter(reg => reg.id !== id));
            if (selectedRegistration?.id === id) {
                setShowDetails(false);
                setSelectedRegistration(null);
            }
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Failed to delete registration.');
        }
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'rejected':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
        }
    };

    const exportToCSV = () => {
        const filteredData = getFilteredRegistrations();
        if (filteredData.length === 0) {
            alert('No registrations to export.');
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Organization', 'Event', 'Event Date', 'Status', 'Registered At'];
        const rows = filteredData.map(reg => [
            reg.fullName,
            reg.email,
            reg.phone || 'N/A',
            reg.organization || 'N/A',
            reg.eventTitle,
            reg.eventDate,
            reg.status,
            formatDate(reg.registeredAt)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getFilteredRegistrations = () => {
        return registrations.filter(reg => {
            const matchesEvent = selectedEvent === 'all' || reg.eventId === selectedEvent;
            const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
            const matchesSearch = searchQuery === '' ||
                reg.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reg.organization?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesEvent && matchesStatus && matchesSearch;
        });
    };

    const filteredRegistrations = getFilteredRegistrations();

    const getEventStats = () => {
        const stats = {};
        registrations.forEach(reg => {
            if (!stats[reg.eventId]) {
                stats[reg.eventId] = {
                    title: reg.eventTitle,
                    total: 0,
                    pending: 0,
                    approved: 0,
                    rejected: 0
                };
            }
            stats[reg.eventId].total++;
            stats[reg.eventId][reg.status || 'pending']++;
        });
        return stats;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Registrations</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage and review event registrations
                    </p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                            <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{registrations.length}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Registrations</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
                            <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {registrations.filter(r => r.status === 'pending').length}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {registrations.filter(r => r.status === 'approved').length}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                            <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {registrations.filter(r => r.status === 'rejected').length}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or organization..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Event Filter */}
                    <div className="min-w-[200px]">
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="all">All Events</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>{event.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="min-w-[150px]">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Registrations Table */}
            {filteredRegistrations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
                    <UserGroupIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No registrations found.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Registrant
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Registered
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredRegistrations.map((registration) => (
                                    <tr key={registration.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {registration.fullName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {registration.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                {registration.eventTitle}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {registration.eventDate}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.status)}`}>
                                                {registration.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(registration.registeredAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRegistration(registration);
                                                        setShowDetails(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                {registration.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateRegistrationStatus(registration.id, 'approved')}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                                                        title="Approve"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {registration.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateRegistrationStatus(registration.id, 'rejected')}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                        title="Reject"
                                                    >
                                                        <XCircleIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteRegistration(registration.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
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

            {/* Registration Details Modal */}
            {showDetails && selectedRegistration && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Registration Details
                            </h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedRegistration.status)}`}>
                                    {selectedRegistration.status || 'pending'}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Contact Information</h4>

                                <div className="flex items-center gap-3">
                                    <UserGroupIcon className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900 dark:text-white">{selectedRegistration.fullName}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                    <a href={`mailto:${selectedRegistration.email}`} className="text-emerald-600 hover:underline">
                                        {selectedRegistration.email}
                                    </a>
                                </div>

                                {selectedRegistration.phone && (
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                                        <a href={`tel:${selectedRegistration.phone}`} className="text-emerald-600 hover:underline">
                                            {selectedRegistration.phone}
                                        </a>
                                    </div>
                                )}

                                {selectedRegistration.organization && (
                                    <div className="flex items-center gap-3">
                                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{selectedRegistration.organization}</span>
                                    </div>
                                )}
                            </div>

                            {/* Event Info */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Event Information</h4>

                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-gray-900 dark:text-white">{selectedRegistration.eventTitle}</p>
                                        <p className="text-sm text-gray-500">{selectedRegistration.eventDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            {(selectedRegistration.dietaryRequirements || selectedRegistration.specialNeeds) && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Additional Information</h4>

                                    {selectedRegistration.dietaryRequirements && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Dietary Requirements</p>
                                            <p className="text-gray-900 dark:text-white">{selectedRegistration.dietaryRequirements}</p>
                                        </div>
                                    )}

                                    {selectedRegistration.specialNeeds && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Special Needs / Accessibility</p>
                                            <p className="text-gray-900 dark:text-white">{selectedRegistration.specialNeeds}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Registered At */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Registered on {formatDate(selectedRegistration.registeredAt)}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {selectedRegistration.status !== 'approved' && (
                                    <button
                                        onClick={() => updateRegistrationStatus(selectedRegistration.id, 'approved')}
                                        disabled={updating}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Approve
                                    </button>
                                )}
                                {selectedRegistration.status !== 'rejected' && (
                                    <button
                                        onClick={() => updateRegistrationStatus(selectedRegistration.id, 'rejected')}
                                        disabled={updating}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                    >
                                        <XCircleIcon className="w-5 h-5" />
                                        Reject
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client"
import { useState, useEffect } from 'react';
import {
    collection,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    CheckIcon,
    XMarkIcon,
    TrashIcon,
    StarIcon as StarOutline
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, approved, pending

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const testimonialsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTestimonials(testimonialsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await updateDoc(doc(db, 'testimonials', id), {
                approved: true,
                updatedAt: new Date().toISOString()
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Error approving testimonial:', error);
            alert('Failed to approve testimonial. Please try again.');
        }
    };

    const handleReject = async (id) => {
        try {
            await updateDoc(doc(db, 'testimonials', id), {
                approved: false,
                updatedAt: new Date().toISOString()
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Error rejecting testimonial:', error);
            alert('Failed to reject testimonial. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await deleteDoc(doc(db, 'testimonials', id));
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Failed to delete testimonial. Please try again.');
        }
    };

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'approved') return t.approved === true;
        if (filter === 'pending') return t.approved === false || t.approved === undefined;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage and approve testimonials from your community
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        All ({testimonials.length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'approved'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        Approved ({testimonials.filter(t => t.approved === true).length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        Pending ({testimonials.filter(t => t.approved === false || t.approved === undefined).length})
                    </button>
                </div>
            </div>

            {filteredTestimonials.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No testimonials {filter !== 'all' ? `in ${filter} status` : 'yet'}.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border 
                                ${testimonial.approved
                                    ? 'border-emerald-200 dark:border-emerald-800'
                                    : 'border-yellow-200 dark:border-yellow-800'
                                } p-6 hover:shadow-md transition-shadow`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </h3>
                                        {testimonial.approved ? (
                                            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 
                                                dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full">
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 
                                                dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    {testimonial.role && (
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                            {testimonial.role}
                                        </p>
                                    )}
                                    {testimonial.organization && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {testimonial.organization}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {testimonial.email}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {!testimonial.approved && (
                                        <button
                                            onClick={() => handleApprove(testimonial.id)}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 
                                                rounded-lg transition-colors"
                                            title="Approve"
                                        >
                                            <CheckIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    {testimonial.approved && (
                                        <button
                                            onClick={() => handleReject(testimonial.id)}
                                            className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 
                                                rounded-lg transition-colors"
                                            title="Unapprove"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
                                            rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    i < (testimonial.rating || 0) ? (
                                        <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
                                    ) : (
                                        <StarOutline key={i} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                    )
                                ))}
                            </div>

                            {/* Message */}
                            <p className="text-gray-600 dark:text-gray-300 mb-3 italic">
                                "{testimonial.message}"
                            </p>

                            {/* Timestamp */}
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Submitted: {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

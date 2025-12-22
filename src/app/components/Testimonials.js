"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    ChatBubbleLeftIcon,
    PlusIcon,
    XMarkIcon,
    StarIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        organization: '',
        message: '',
        rating: 5,
        email: ''
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const q = query(
                collection(db, 'testimonials'),
                orderBy('createdAt', 'desc'),
                limit(6)
            );
            const snapshot = await getDocs(q);
            const testimonialsData = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(t => t.approved === true); // Only show approved testimonials

            setTestimonials(testimonialsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'testimonials'), {
                ...formData,
                approved: false, // Requires admin approval
                createdAt: new Date().toISOString(),
            });

            setSubmitted(true);
            setFormData({
                name: '',
                role: '',
                organization: '',
                message: '',
                rating: 5,
                email: ''
            });

            setTimeout(() => {
                setShowModal(false);
                setSubmitted(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            alert('Failed to submit testimonial. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const setRating = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    if (loading) {
        return (
            <section className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-black">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-lines opacity-[0.1] dark:opacity-[0.1]" />
            <div className="absolute -right-64 top-1/2 w-96 h-96 rounded-full 
        bg-teal-300/20 blur-3xl dark:bg-teal-900/20 pointer-events-none" />
            <div className="absolute -left-64 top-1/2 w-96 h-96 rounded-full 
        bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">
                        What People Are Saying
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                        Hear from our community members, volunteers, and partners about their experience with Planet Vanguard
                    </p>
                </div>

                {testimonials.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-2xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  backdrop-blur-sm">
                        <ChatBubbleLeftIcon className="w-16 h-16 mx-auto text-emerald-600 dark:text-emerald-400 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No testimonials yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Be the first to share your experience!
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg 
                hover:bg-emerald-700 transition-colors shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] "
                        >
                            <PlusIcon className="w-5 h-5" />
                            Share Your Story
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Testimonials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  
                    hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  transition-all duration-300 transform hover:-translate-y-1
                    backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: 'fadeIn 0.5s ease-out forwards'
                                    }}
                                >
                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            i < testimonial.rating ? (
                                                <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                                            ) : (
                                                <StarIcon key={i} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                            )
                                        ))}
                                    </div>

                                    {/* Message */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                                        "{testimonial.message}"
                                    </p>

                                    {/* Author Info */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </p>
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
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-lg 
                  hover:bg-emerald-700 transition-all duration-300 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] 
                  transform hover:scale-105 font-semibold"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Share Your Experience
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Share Your Experience
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <CheckCircleIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Thank You!
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Your testimonial has been submitted and is pending approval.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Role/Title
                                        </label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Volunteer, Partner, etc."
                                        />
                                    </div>

                                    {/* Organization */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Organization
                                        </label>
                                        <input
                                            type="text"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Your organization (optional)"
                                        />
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rating *
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    {star <= formData.rating ? (
                                                        <StarIconSolid className="w-8 h-8 text-yellow-400" />
                                                    ) : (
                                                        <StarIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Your Experience *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                            placeholder="Share your experience with Planet Vanguard..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 
                        text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
                        dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg 
                        hover:bg-emerald-700 transition-colors disabled:opacity-50 
                        disabled:cursor-not-allowed font-semibold"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Testimonial'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

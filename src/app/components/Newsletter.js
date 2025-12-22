"use client"
import { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Newsletter() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Check if email exists
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(subscriptionsRef, where('email', '==', formData.email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage({
          type: 'error',
          text: 'This email is already subscribed!'
        });
        return;
      }

      // Add new subscription
      await addDoc(subscriptionsRef, {
        name: formData.name,
        email: formData.email.toLowerCase(),
        createdAt: new Date().toISOString(),
      });

      setMessage({
        type: 'success',
        text: 'Thank you for joining! We\'ll keep you updated.'
      });
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 
        dark:from-emerald-950/30 dark:to-teal-950/30">
        <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700 opacity-[0.2]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Text content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block mb-4">
                <span className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 
                  bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                  <SparklesIcon className="h-4 w-4" />
                  Join Our Community
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 
                to-teal-500 bg-clip-text text-transparent">
                Stay Updated on Our Climate Initiatives
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Join our newsletter to receive the latest updates on our projects, events,
                and ways you can get involved in creating a sustainable future for Africa.
              </p>

              <ul className="space-y-2 mb-8">
                {['Exclusive event invitations', 'Project updates', 'Volunteer opportunities'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">Subscribe to Our Newsletter</h3>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 focus:outline-none rounded-lg border-0 focus:ring-2 focus:ring-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 focus:outline-none rounded-lg border-0 focus:ring-2 focus:ring-white"
                    placeholder="john@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-emerald-700 font-medium py-3 px-6 rounded-lg
                    hover:bg-gray-100 transition-colors flex items-center justify-center gap-2
                    disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="h-5 w-5" />
                      Subscribe Now
                    </>
                  )}
                </button>

                {message.type && (
                  <div className={`rounded-lg p-3 flex items-start gap-2 ${message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {message.type === 'success' ? (
                      <CheckCircleIcon className="h-5 w-5 shrink-0" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 shrink-0" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                )}

                <p className="text-xs text-white/80 text-center mt-4">
                  We respect your privacy and will never share your information.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl"></div>
      </div>
    </section>
  );
}
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import Sidebar from '@/app/components/admin/Sidebar';
import Header from '@/app/components/admin/Header';
import Overview from '@/app/components/admin/Overview';
import ProjectsManager from '@/app/components/admin/ProjectsManager';
import EventsManager from '@/app/components/admin/EventsManagerUpdated';
import GalleryManager from '@/app/components/admin/GalleryManager';
import TestimonialsManager from '@/app/components/admin/TestimonialsManager';
import NewsletterManager from '@/app/components/admin/NewsletterManager';
import AboutManager from '@/app/components/admin/AboutManager';
import RegistrationsManager from '@/app/components/admin/RegistrationsManager';
import SubmissionsManager from '@/app/components/admin/SubmissionsManager';
import BlogManager from '@/app/components/admin/BlogManager';
import ContactManager from '@/app/components/admin/ContactManager';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }

      // Check if user email is authorized
      if (!currentUser.email.endsWith('@planetvanguard.org')) {
        await auth.signOut();
        router.push('/admin/login');
        return;
      }

      setUser(currentUser);

      // Fetch admin data from users collection
      try {
        // Users collection is keyed by UID now, so read by currentUser.uid
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setAdminData(userDoc.data());
        } else {
          await auth.signOut();
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        await auth.signOut();
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex min-h-screen w-full flex-1 flex-col lg:w-auto">
          <Header user={user} adminData={adminData} />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {activeTab === 'overview' && <Overview />}
            {activeTab === 'about' && <AboutManager />}
            {activeTab === 'projects' && <ProjectsManager />}
            {activeTab === 'events' && <EventsManager />}
            {activeTab === 'registrations' && <RegistrationsManager />}
            {activeTab === 'submissions' && <SubmissionsManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'testimonials' && <TestimonialsManager />}
            {activeTab === 'newsletter' && <NewsletterManager />}
            {activeTab === 'blog' && <BlogManager />}
            {activeTab === 'contact' && <ContactManager />}
          </main>
        </div>
      </div>
    </div>
  );
}

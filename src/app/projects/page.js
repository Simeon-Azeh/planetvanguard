"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import {
    MapPinIcon,
    CalendarIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowRightIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    GlobeAltIcon,
    ChartBarIcon,
    FolderOpenIcon,
    XMarkIcon,
    TagIcon,
    CurrencyDollarIcon,
    BuildingOfficeIcon,
    ArrowTrendingUpIcon,
    CheckBadgeIcon,
    PlayCircleIcon,
    PauseCircleIcon,
    DocumentCheckIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeStatus, setActiveStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };

    const getStatusConfig = (status) => {
        const configs = {
            ongoing: {
                label: 'Ongoing',
                color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                icon: PlayCircleIcon,
                dotColor: 'bg-blue-500'
            },
            completed: {
                label: 'Completed',
                color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                icon: CheckBadgeIcon,
                dotColor: 'bg-green-500'
            },
            planned: {
                label: 'Planned',
                color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                icon: RocketLaunchIcon,
                dotColor: 'bg-purple-500'
            },
            paused: {
                label: 'Paused',
                color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                icon: PauseCircleIcon,
                dotColor: 'bg-yellow-500'
            }
        };
        return configs[status] || configs.ongoing;
    };

    const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
    const statuses = ['all', 'ongoing', 'completed', 'planned'];

    const filteredProjects = projects.filter(project => {
        const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
        const matchesStatus = activeStatus === 'all' || project.status === activeStatus;
        const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.location?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesStatus && matchesSearch;
    });

    const featuredProjects = projects.filter(p => p.featured);

    const stats = {
        total: projects.length,
        ongoing: projects.filter(p => p.status === 'ongoing').length,
        completed: projects.filter(p => p.status === 'completed').length,
        beneficiaries: projects.reduce((sum, p) => sum + (p.impact?.beneficiaries || 0), 0)
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Header />
            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-300/30 to-teal-400/20 blur-3xl" />
                        <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-300/30 to-emerald-400/20 blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                                <FolderOpenIcon className="w-5 h-5" />
                                <span>Our Initiatives</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="text-gray-900 dark:text-white">Our </span>
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                    Projects
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                Discover our impactful initiatives across Africa. From environmental conservation
                                to community development, we're building a sustainable future together.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-emerald-100 dark:border-emerald-800 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center">
                                    <FolderOpenIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-blue-100 dark:border-blue-800 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                                    <PlayCircleIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.ongoing}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Projects</p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-green-100 dark:border-green-800 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 flex items-center justify-center">
                                    <CheckBadgeIcon className="w-7 h-7 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.completed}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-purple-100 dark:border-purple-800 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex items-center justify-center">
                                    <UserGroupIcon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stats.beneficiaries.toLocaleString()}+
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiaries</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="py-8 border-b border-gray-100 dark:border-gray-800 sticky top-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                                {statuses.map((status) => {
                                    const config = status !== 'all' ? getStatusConfig(status) : null;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setActiveStatus(status)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeStatus === status
                                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] '
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {config && <config.icon className="w-4 h-4" />}
                                            {status === 'all' ? 'All Status' : config?.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                            <FunnelIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                        }`}
                                >
                                    {category === 'all' ? 'All Categories' : category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Projects */}
                {featuredProjects.length > 0 && activeCategory === 'all' && activeStatus === 'all' && !searchQuery && (
                    <section className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-2 mb-8">
                                <SparklesIcon className="w-6 h-6 text-yellow-500" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {featuredProjects.slice(0, 2).map((project) => {
                                    const statusConfig = getStatusConfig(project.status);
                                    return (
                                        <div
                                            key={project.id}
                                            onClick={() => setSelectedProject(project)}
                                            className="group cursor-pointer bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={project.image || '/project1.jpg'}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                                                        <SparklesIcon className="w-3 h-3" />
                                                        Featured
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.color}`}>
                                                        <statusConfig.icon className="w-3 h-3" />
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                                    <div className="flex items-center gap-4 text-white/80 text-sm">
                                                        {project.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPinIcon className="w-4 h-4" />
                                                                {project.location}
                                                            </span>
                                                        )}
                                                        {project.category && (
                                                            <span className="flex items-center gap-1">
                                                                <TagIcon className="w-4 h-4" />
                                                                {project.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-6">
                                                    {project.description}
                                                </p>

                                                {project.impact && (
                                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                                        {project.impact.beneficiaries > 0 && (
                                                            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                                                <UserGroupIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    {project.impact.beneficiaries.toLocaleString()}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Beneficiaries</p>
                                                            </div>
                                                        )}
                                                        {project.impact.duration && (
                                                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                                <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    {project.impact.duration}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                                                            </div>
                                                        )}
                                                        {project.impact.budget && (
                                                            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                                                <CurrencyDollarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    {project.impact.budget}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                                                    View Project Details
                                                    <ArrowRightIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* All Projects Grid */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {activeCategory !== 'all' || activeStatus !== 'all' || searchQuery
                                    ? 'Filtered Projects'
                                    : 'All Projects'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-48 mb-4" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-3" />
                                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <FolderOpenIcon className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {searchQuery ? 'No projects found' : 'No projects yet'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {searchQuery
                                        ? 'Try adjusting your search or filters'
                                        : 'Check back soon for exciting initiatives!'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProjects.map((project) => {
                                    const statusConfig = getStatusConfig(project.status);
                                    return (
                                        <div
                                            key={project.id}
                                            onClick={() => setSelectedProject(project)}
                                            className="group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.09)]  border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={project.image || '/project1.jpg'}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.color}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                {project.category && (
                                                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs">
                                                        {project.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {project.title}
                                                </h3>

                                                {project.location && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                        <MapPinIcon className="w-4 h-4" />
                                                        {project.location}
                                                    </div>
                                                )}

                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                    {project.description}
                                                </p>

                                                {project.impact?.beneficiaries > 0 && (
                                                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                                        <UserGroupIcon className="w-4 h-4" />
                                                        <span>{project.impact.beneficiaries.toLocaleString()} beneficiaries</span>
                                                    </div>
                                                )}

                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        {formatDate(project.createdAt)}
                                                    </span>
                                                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        Details
                                                        <ArrowRightIcon className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <GlobeAltIcon className="w-12 h-12 text-white/80 mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Want to Support Our Projects?
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            Join us in making a difference. Your support helps us expand our initiatives
                            and reach more communities across Africa.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/get-involved"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] "
                            >
                                <UserGroupIcon className="w-5 h-5" />
                                Get Involved
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all"
                            >
                                <BuildingOfficeIcon className="w-5 h-5" />
                                Partner With Us
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Project Detail Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6 text-white" />
                        </button>

                        {/* Hero Image */}
                        <div className="relative h-64 md:h-80">
                            <img
                                src={selectedProject.image || '/project1.jpg'}
                                alt={selectedProject.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-2 mb-3">
                                    {(() => {
                                        const config = getStatusConfig(selectedProject.status);
                                        return (
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${config.color}`}>
                                                <config.icon className="w-4 h-4" />
                                                {config.label}
                                            </span>
                                        );
                                    })()}
                                    {selectedProject.category && (
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                                            {selectedProject.category}
                                        </span>
                                    )}
                                    {selectedProject.featured && (
                                        <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm flex items-center gap-1">
                                            <SparklesIcon className="w-4 h-4" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Location & Date */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600 dark:text-gray-400">
                                {selectedProject.location && (
                                    <span className="flex items-center gap-2">
                                        <MapPinIcon className="w-5 h-5 text-emerald-500" />
                                        {selectedProject.location}
                                    </span>
                                )}
                                {selectedProject.createdAt && (
                                    <span className="flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-blue-500" />
                                        Started {formatDate(selectedProject.createdAt)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    About This Project
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {selectedProject.description}
                                </p>
                            </div>

                            {/* Impact Stats */}
                            {selectedProject.impact && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Project Impact
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {selectedProject.impact.beneficiaries > 0 && (
                                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 text-center">
                                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
                                                    <UserGroupIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {selectedProject.impact.beneficiaries.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiaries</p>
                                            </div>
                                        )}
                                        {selectedProject.impact.duration && (
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 text-center">
                                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                                                    <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {selectedProject.impact.duration}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                                            </div>
                                        )}
                                        {selectedProject.impact.budget && (
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5 text-center">
                                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center">
                                                    <CurrencyDollarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {selectedProject.impact.budget}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/get-involved"
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <UserGroupIcon className="w-5 h-5" />
                                    Support This Project
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <BuildingOfficeIcon className="w-5 h-5" />
                                    Contact About Project
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
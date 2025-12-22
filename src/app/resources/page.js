"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import {
  ClockIcon,
  CalendarIcon,
  TagIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

export default function ResourcePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [readingProgress, setReadingProgress] = useState(0);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const categories = ['all', 'Environment', 'Community', 'Education', 'Events', 'News'];

  useEffect(() => {
    fetchPosts();
    // Load liked/saved from localStorage
    const saved = localStorage.getItem('savedPosts');
    const liked = localStorage.getItem('likedPosts');
    if (saved) setSavedPosts(JSON.parse(saved));
    if (liked) setLikedPosts(JSON.parse(liked));
  }, []);

  useEffect(() => {
    if (selectedPost) {
      const updateReadingProgress = () => {
        const scrolled = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        setReadingProgress((scrolled / height) * 100);
      };

      window.addEventListener('scroll', updateReadingProgress);
      return () => window.removeEventListener('scroll', updateReadingProgress);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, 'blogPosts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(postsQuery);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      localStorage.setItem('likedPosts', JSON.stringify(newLiked));
      return newLiked;
    });
  };

  const toggleSave = (postId) => {
    setSavedPosts(prev => {
      const newSaved = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      localStorage.setItem('savedPosts', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return '3 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />

        {/* Reading Progress Bar */}
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 z-50 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />

        <main className="pt-20">
          <article className="max-w-4xl mx-auto px-4 py-12">
            {/* Back Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 mb-8 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              Back to Resources
            </button>

            {/* Category & Reading Time */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                {selectedPost.category || 'General'}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <ClockIcon className="w-4 h-4" />
                {calculateReadTime(selectedPost.content)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {selectedPost.title}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedPost.author?.[0] || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedPost.author || 'Planet Vanguard'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(selectedPost.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLike(selectedPost.id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {likedPosts.includes(selectedPost.id) ? (
                    <HeartSolidIcon className="w-6 h-6 text-rose-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => toggleSave(selectedPost.id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {savedPosts.includes(selectedPost.id) ? (
                    <BookmarkSolidIcon className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <BookmarkIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => navigator.share?.({ title: selectedPost.title, url: window.location.href })}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ShareIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Featured Image */}
            {selectedPost.image && (
              <div className="relative rounded-2xl overflow-hidden mb-10">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-[300px] md:h-[450px] object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-emerald-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* Tags */}
            {selectedPost.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
                <TagIcon className="w-5 h-5 text-gray-400" />
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedPost.author?.[0] || 'P'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {selectedPost.author || 'Planet Vanguard'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Contributing to sustainable development in Africa through education and community action.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

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
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                <BookOpenIcon className="w-5 h-5" />
                <span>Resources & Blog</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Learn & </span>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Get Inspired
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Explore our collection of articles, guides, and stories about environmental conservation,
                community initiatives, and sustainable development in Africa.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-8 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <FunnelIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                    }`}
                >
                  {category === 'all' ? 'All Posts' : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-48 mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-3" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <BookOpenIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Check back soon for new content!'}
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && (
                  <div className="mb-16">
                    <div
                      onClick={() => setSelectedPost(featuredPost)}
                      className="group cursor-pointer grid lg:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative h-64 lg:h-auto overflow-hidden">
                        <img
                          src={featuredPost.image || '/project1.jpg'}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
                            Featured
                          </span>
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                            {featuredPost.category || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="p-8 lg:py-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(featuredPost.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {calculateReadTime(featuredPost.content)}
                          </span>
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {featuredPost.title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                              {featuredPost.author?.[0] || 'P'}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {featuredPost.author || 'Planet Vanguard'}
                            </span>
                          </div>

                          <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium group-hover:gap-3 transition-all">
                            Read More
                            <ArrowRightIcon className="w-5 h-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image || '/project1.jpg'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                          {post.category || 'General'}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span>{formatDate(post.createdAt)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {calculateReadTime(post.content)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                              {post.author?.[0] || 'P'}
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {post.author || 'Planet Vanguard'}
                            </span>
                          </div>

                          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <SparklesIcon className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Subscribe to our newsletter to receive the latest articles and updates directly in your inbox.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Subscribe Now
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

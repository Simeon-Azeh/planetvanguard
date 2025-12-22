"use client";
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    XMarkIcon,
    PhotoIcon,
    TagIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    CloudArrowUpIcon,
    BookOpenIcon,
    CalendarIcon,
    UserCircleIcon,
    LinkIcon,
    ListBulletIcon,
    CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function BlogManager() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const contentRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'General',
        author: 'Planet Vanguard',
        tags: [],
        published: false
    });

    const [tagInput, setTagInput] = useState('');

    const categories = ['General', 'Environment', 'Community', 'Education', 'Events', 'News'];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const postsQuery = query(
                collection(db, 'blogPosts'),
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const postData = {
                ...formData,
                updatedAt: Timestamp.now()
            };

            if (editingPost) {
                await updateDoc(doc(db, 'blogPosts', editingPost.id), postData);
            } else {
                postData.createdAt = Timestamp.now();
                await addDoc(collection(db, 'blogPosts'), postData);
            }

            await fetchPosts();
            resetForm();
            setShowEditor(false);
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            image: post.image || '',
            category: post.category || 'General',
            author: post.author || 'Planet Vanguard',
            tags: post.tags || [],
            published: post.published || false
        });
        setShowEditor(true);
    };

    const handleDelete = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await deleteDoc(doc(db, 'blogPosts', postId));
            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const togglePublish = async (post) => {
        try {
            await updateDoc(doc(db, 'blogPosts', post.id), {
                published: !post.published,
                updatedAt: Timestamp.now()
            });
            await fetchPosts();
        } catch (error) {
            console.error('Error toggling publish:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            category: 'General',
            author: 'Planet Vanguard',
            tags: [],
            published: false
        });
        setEditingPost(null);
        setTagInput('');
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const insertFormatting = (format) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;
        const selectedText = text.substring(start, end);

        let newText = '';
        let cursorOffset = 0;

        switch (format) {
            case 'bold':
                newText = `${text.substring(0, start)}<strong>${selectedText}</strong>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 8;
                break;
            case 'italic':
                newText = `${text.substring(0, start)}<em>${selectedText}</em>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 4;
                break;
            case 'heading':
                newText = `${text.substring(0, start)}<h2>${selectedText}</h2>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 4;
                break;
            case 'subheading':
                newText = `${text.substring(0, start)}<h3>${selectedText}</h3>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 4;
                break;
            case 'paragraph':
                newText = `${text.substring(0, start)}<p>${selectedText}</p>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 3;
                break;
            case 'list':
                newText = `${text.substring(0, start)}<ul>\n  <li>${selectedText}</li>\n</ul>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 10;
                break;
            case 'link':
                newText = `${text.substring(0, start)}<a href="URL">${selectedText || 'Link text'}</a>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 10;
                break;
            case 'image':
                newText = `${text.substring(0, start)}<img src="IMAGE_URL" alt="${selectedText || 'description'}" class="rounded-xl my-4" />${text.substring(end)}`;
                cursorOffset = 10;
                break;
            case 'quote':
                newText = `${text.substring(0, start)}<blockquote class="border-l-4 border-emerald-500 pl-4 italic">${selectedText}</blockquote>${text.substring(end)}`;
                cursorOffset = selectedText ? 0 : 55;
                break;
            default:
                return;
        }

        setFormData(prev => ({ ...prev, content: newText }));

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = selectedText ? end + (newText.length - text.length) : start + cursorOffset;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.published).length,
        drafts: posts.filter(p => !p.published).length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Blog Manager
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Create and manage blog posts for your resources page
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchPosts}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowEditor(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Post
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.published}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.drafts}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {/* Posts List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchQuery ? 'No posts match your search' : 'No blog posts yet'}
                    </p>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowEditor(true);
                        }}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Create Your First Post
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Post
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category
                                    </th>
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
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                                    {post.image ? (
                                                        <img
                                                            src={post.image}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                                        {post.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                        {post.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                                {post.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => togglePublish(post)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${post.published
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}
                                            >
                                                {post.published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(post.createdAt)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
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

            {/* Editor Modal */}
            {showEditor && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-8">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl z-10">
                            <button
                                onClick={() => {
                                    setShowEditor(false);
                                    resetForm();
                                }}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-white" />
                            </button>
                            <h2 className="text-2xl font-bold text-white">
                                {editingPost ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            <p className="text-white/80 mt-1">
                                {editingPost ? 'Update your blog post' : 'Write and publish a new article'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter post title..."
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Excerpt *
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                    placeholder="Brief summary of the post..."
                                />
                            </div>

                            {/* Category & Author */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Author name..."
                                    />
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Featured Image URL
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {formData.image && (
                                        <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tags
                                </label>
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-red-500"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Add a tag..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Content * (HTML supported)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                                    </button>
                                </div>

                                {/* Formatting Toolbar */}
                                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('bold')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Bold"
                                    >
                                        <span className="font-bold text-sm">B</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('italic')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Italic"
                                    >
                                        <span className="italic text-sm">I</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('heading')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Heading"
                                    >
                                        <span className="font-bold text-sm">H2</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('subheading')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Subheading"
                                    >
                                        <span className="font-bold text-sm">H3</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('paragraph')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Paragraph"
                                    >
                                        <span className="text-sm">¶</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('list')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="List"
                                    >
                                        <ListBulletIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('link')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Link"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('image')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Image"
                                    >
                                        <PhotoIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('quote')}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Quote"
                                    >
                                        <span className="text-sm">"</span>
                                    </button>
                                </div>

                                <textarea
                                    ref={contentRef}
                                    required
                                    rows={12}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 rounded-b-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
                                    placeholder="<p>Write your content here...</p>"
                                />

                                {/* Preview */}
                                {showPreview && formData.content && (
                                    <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Preview:</p>
                                        <div
                                            className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: formData.content }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Published Toggle */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor="published" className="text-gray-700 dark:text-gray-300">
                                    Publish immediately (uncheck to save as draft)
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditor(false);
                                        resetForm();
                                    }}
                                    className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CloudArrowUpIcon className="w-5 h-5" />
                                            {editingPost ? 'Update Post' : 'Create Post'}
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

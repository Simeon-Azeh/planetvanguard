"use client"
import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  TagIcon, 
  ChevronLeftIcon,
  UserCircleIcon,
  ShareIcon 
} from '@heroicons/react/24/outline';

const blogPosts = [
  {
    id: 1,
    title: "The Impact of Climate Change on African Wildlife",
    excerpt: "Exploring how rising temperatures affect migration patterns...",
    content: [
      {
        type: 'paragraph',
        content: `Climate change continues to reshape our world in profound ways...`
      },
      {
        type: 'image',
        url: '/project1.jpg',
        caption: 'Migration patterns of wildebeest affected by climate change'
      },
      {
        type: 'paragraph',
        content: `Recent studies have shown alarming trends...`
      },
      {
        type: 'subheading',
        content: 'Impact on Local Ecosystems'
      },
      {
        type: 'paragraph',
        content: `Local ecosystems are experiencing unprecedented changes...`
      }
    ],
    image: "/project3.jpg",
    date: "2024-02-15",
    author: {
      name: "Jane Smith",
      role: "Wildlife Researcher",
      image: "/author1.jpg"
    },
    category: "Wildlife",
    readTime: "5 min",
    tags: ["Climate", "Wildlife", "Conservation"]
  },
  // ... other blog posts
];

const BlogCard = ({ post, onSelect }) => (
  <div 
    onClick={onSelect}
    className="bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden
       dark:border-gray-700 cursor-pointer
      transition-all duration-300  hover:scale-[1.02]"
  >
    <div className="h-48 relative overflow-hidden">
      <img 
        src={post.image} 
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500
          hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <span className="absolute bottom-4 left-4 text-white px-2 py-1 rounded-full 
        text-sm bg-emerald-600">{post.category}</span>
    </div>
    
    <div className="p-6">
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span>{post.date}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          {post.readTime}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
      
      <div className="flex flex-wrap gap-2">
        {post.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 rounded-full
            bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const FullBlogPost = ({ post, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    // Reading progress
    const updateReadingProgress = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress((scrolled / height) * 100);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8 pt-24 animate-pulse">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-emerald-500 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="max-w-3xl mx-auto px-4 py-24">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900
            dark:text-gray-400 dark:hover:text-white mb-8"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Blogs
        </button>

        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 
            dark:text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5" />
              <span>{post.author.name}</span>
            </div>
            <span>{post.date}</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          <img 
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-xl mb-8"
          />

          {post.content.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return <p key={index}>{block.content}</p>;
              case 'image':
                return (
                  <figure key={index} className="my-8">
                    <img 
                      src={block.url} 
                      alt={block.caption}
                      className="w-full rounded-xl"
                    />
                    <figcaption className="text-center mt-2 text-sm text-gray-600">
                      {block.caption}
                    </figcaption>
                  </figure>
                );
              case 'subheading':
                return <h2 key={index}>{block.content}</h2>;
              default:
                return null;
            }
          })}
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={post.author.image}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{post.author.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {post.author.role}
                </p>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  if (selectedPost) {
    return <FullBlogPost post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white dark:from-gray-900 dark:to-gray-800 
      relative py-24 md:px-16 px-8 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-700/25 bg-[length:40px_40px]
        [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      <div className="relative max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r 
        from-emerald-600 to-green-500 bg-clip-text text-transparent">
        Our Blog
      </h1>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors
              ${activeCategory === category
                ? 'bg-emerald-600 text-white'
                : 'bg-white/70 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <BlogCard
            key={post.id}
            post={post}
            onSelect={() => setSelectedPost(post)}
          />
        ))}
      </div>
    </div>
    </div>
  );
}
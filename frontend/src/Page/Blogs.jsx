import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { format } from 'date-fns';
import { Search, Hash, Calendar, User, ArrowRight, X, Sparkles, Loader2 } from 'lucide-react';

// --- 3D TILT CONFIG ---
const defaultTiltOptions = {
    reverse: false, max: 12, perspective: 1000, scale: 1.02, speed: 1000, 
    transition: true, axis: null, reset: true, easing: "cubic-bezier(.03,.98,.52,.99)",
};

// --- SKELETON LOADER COMPONENT ---
const BlogSkeleton = () => (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden h-full flex flex-col">
        <div className="h-52 bg-zinc-900/50 animate-pulse relative">
            <div className="absolute top-4 left-4 w-24 h-6 bg-zinc-800 rounded-full" />
        </div>
        <div className="p-6 flex-1 space-y-4">
            <div className="flex gap-2">
                <div className="w-16 h-5 bg-zinc-900 rounded animate-pulse" />
                <div className="w-16 h-5 bg-zinc-900 rounded animate-pulse" />
            </div>
            <div className="w-3/4 h-8 bg-zinc-900 rounded animate-pulse" />
            <div className="space-y-2">
                <div className="w-full h-3 bg-zinc-900 rounded animate-pulse" />
                <div className="w-full h-3 bg-zinc-900 rounded animate-pulse" />
                <div className="w-2/3 h-3 bg-zinc-900 rounded animate-pulse" />
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between">
                <div className="w-24 h-4 bg-zinc-900 rounded animate-pulse" />
                <div className="w-20 h-4 bg-zinc-900 rounded animate-pulse" />
            </div>
        </div>
    </div>
);

const Blogs = () => {
    const navigate = useNavigate();
    
    // --- STATE ---
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    // --- FETCH DATA ---
    const fetchBlogs = useCallback(async (pageNum, searchQuery, isNewSearch = false) => {
        if (isNewSearch) {
            setLoading(true);
            setBlogs([]); // Clear current list on new search
        }

        try {
            const limit = 9; // Grid of 3x3 looks best
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/blog/blogs?page=${pageNum}&limit=${limit}&search=${searchQuery}`
            );
            
            if (response.data.success) {
                const newBlogs = response.data.data.blogs;
                const totalPages = response.data.data.totalPages;

                setBlogs(prev => isNewSearch ? newBlogs : [...prev, ...newBlogs]);
                setHasMore(pageNum < totalPages);
            }
        } catch (error) {
            console.error("Error fetching blogs", error);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, []);

    // --- INITIAL LOAD & SEARCH HANDLER ---
    useEffect(() => {
        // Debounce search to avoid spamming API
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            fetchBlogs(1, search, true);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, fetchBlogs]);

    // --- LOAD MORE HANDLER ---
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBlogs(nextPage, search, false);
    };

    // --- TAG CLICK HANDLER ---
    const handleTagClick = (tag, e) => {
        e.stopPropagation(); // Prevent card click
        setSearch(tag); // Set search bar to tag
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up
    };

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 40, damping: 15 } }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 pt-32 pb-20 relative overflow-hidden font-sans">
            
            {/* --- AMBIENT BACKGROUND GLOW --- */}
            <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[800px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col items-center text-center mb-20 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-4 drop-shadow-2xl">
                            The Archives
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            A curated collection of thoughts, code, and digital craftsmanship.
                        </p>
                    </motion.div>

                    {/* --- SEARCH BAR --- */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative w-full max-w-xl group"
                    >
                        {/* Glow Effect on Focus */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full blur opacity-20 group-focus-within:opacity-50 transition-opacity duration-500 animate-gradient-xy" />
                        
                        <div className="relative bg-[#050505]/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center shadow-2xl transition-all duration-300 group-focus-within:border-white/20 group-focus-within:bg-black">
                            <div className="pl-6 pr-3 text-zinc-500">
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5" />}
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search by title, topic, or tag..." 
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setIsSearching(true); }}
                                className="bg-transparent border-none outline-none text-white w-full py-4 text-sm placeholder:text-zinc-600 font-medium"
                            />
                            {search && (
                                <button 
                                    onClick={() => setSearch("")}
                                    className="mr-2 p-2 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* --- BLOG GRID --- */}
                {loading && page === 1 ? (
                    // Skeleton Loading State (Initial Load)
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <BlogSkeleton key={i} />)}
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {blogs.map((blog) => (
                                <motion.div key={blog._id} variants={itemVariants} layout>
                                    <Tilt options={defaultTiltOptions} className="h-full">
                                        <div 
                                            onClick={() => navigate(`/blog/${blog.slug}`)}
                                            className="group h-full bg-[#0A0A0A] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer relative flex flex-col transition-all duration-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)]"
                                        >
                                            {/* Image Wrapper */}
                                            <div className="relative h-60 overflow-hidden bg-zinc-900">
                                                {blog.coverImage ? (
                                                    <img 
                                                        src={blog.coverImage} 
                                                        alt={blog.title} 
                                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 space-y-2">
                                                        <Hash className="w-8 h-8 opacity-20" />
                                                        <span className="font-mono text-[10px] tracking-widest opacity-50">NO SIGNAL</span>
                                                    </div>
                                                )}
                                                
                                                {/* Date Badge (Glass) */}
                                                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white flex items-center gap-2 shadow-lg">
                                                    <Calendar className="w-3 h-3 text-indigo-400" />
                                                    {blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-7 flex-1 flex flex-col relative z-10">
                                                
                                                {/* Tags (Clickable) */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {blog.tags.slice(0, 3).map((tag, i) => (
                                                        <button 
                                                            key={i} 
                                                            onClick={(e) => handleTagClick(tag, e)}
                                                            className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/20 px-2 py-1 rounded-md border border-indigo-500/20 transition-colors cursor-none group-hover:cursor-pointer"
                                                        >
                                                            #{tag.trim()}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                    {blog.title}
                                                </h3>

                                                {/* Excerpt */}
                                                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                                    {blog.content.replace(/<[^>]+>/g, '').substring(0, 140)}...
                                                </p>

                                                {/* Footer */}
                                                <div className="flex justify-between items-end pt-6 border-t border-white/5 mt-auto">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-black p-[1px] shadow-inner">
                                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-zinc-300">
                                                                {blog.author?.username?.[0]?.toUpperCase() || <User className="w-3 h-3"/>}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Author</span>
                                                            <span className="text-xs text-zinc-300 font-medium">{blog.author?.name || "Ghost"}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300 transform group-hover:rotate-[-45deg]">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tilt>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* --- LOAD MORE / EMPTY STATE --- */}
                <div className="mt-16 text-center">
                    {!loading && blogs.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20">
                            <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 animate-pulse">
                                <Sparkles className="w-8 h-8 text-zinc-700" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Void Detected</h3>
                            <p className="text-zinc-500">No signals found matching your query.</p>
                        </motion.div>
                    ) : (
                        hasMore && (
                            <button 
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="group relative px-8 py-4 bg-white text-black text-sm font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Load More Archives"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-white to-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default Blogs;
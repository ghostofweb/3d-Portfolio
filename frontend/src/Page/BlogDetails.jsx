import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, User, Share2, Loader2, Tag, ChevronUp, Terminal } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// PrismJS
import Prism from 'prismjs';
// We use the "Tomorrow Night" theme for that dark mode look
import 'prismjs/themes/prism-tomorrow.css'; 
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';

const BlogDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [slides, setSlides] = useState([]);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/blog/${slug}`);
                if (response.data.success) {
                    setBlog(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching blog", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    // --- DOM MANIPULATION ---
    useEffect(() => {
        if (!blog) return;

        setTimeout(() => {
            // 1. FIX QUILL SYNTAX BLOCKS
            const quillBlocks = document.querySelectorAll('.ql-syntax');
            quillBlocks.forEach((block) => {
                // If it's a <pre class="ql-syntax">, Prism needs a <code> tag inside
                if (block.tagName === 'PRE') {
                    block.classList.add('language-javascript'); // Default to JS for colors
                    if (!block.querySelector('code')) {
                        block.innerHTML = `<code>${block.innerHTML}</code>`;
                    }
                }
            });

            // 2. RUN PRISM HIGHLIGHT
            Prism.highlightAll();
            
            // 3. APPLY MAC TERMINAL STYLE
            const preBlocks = document.querySelectorAll('pre');
            preBlocks.forEach((pre) => {
                if (pre.parentNode.classList.contains('code-wrapper')) return;

                // Create Container
                const wrapper = document.createElement('div');
                wrapper.className = 'code-wrapper relative my-8 rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] group border border-white/10';
                
                // Header Bar
                const header = document.createElement('div');
                header.className = 'flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5 select-none';
                
                // Mac Dots
                header.innerHTML = `
                    <div class="flex gap-1.5">
                        <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div class="text-[10px] font-mono text-zinc-500 font-bold tracking-widest uppercase">CODE</div>
                `;

                // Copy Button
                const copyBtn = document.createElement('button');
                copyBtn.className = 'group flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-all';
                copyBtn.innerHTML = `
                    <span class="text-[10px] text-zinc-400 group-hover:text-white font-medium transition-colors">Copy</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 group-hover:text-white"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                `;
                
                copyBtn.addEventListener('click', () => {
                    const code = pre.innerText;
                    navigator.clipboard.writeText(code);
                    copyBtn.innerHTML = `
                        <span class="text-[10px] text-emerald-400 font-bold">Copied!</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    `;
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <span class="text-[10px] text-zinc-400 group-hover:text-white font-medium transition-colors">Copy</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 group-hover:text-white"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        `;
                    }, 2000);
                });

                header.appendChild(copyBtn);

                // Wrap it up
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(header);
                wrapper.appendChild(pre);
            });

            // 4. Image Lightbox
            const contentImages = Array.from(document.querySelectorAll('.prose-content img'));
            const newSlides = [];
            if (blog.coverImage) newSlides.push({ src: blog.coverImage });
            contentImages.forEach(img => newSlides.push({ src: img.src }));
            setSlides(newSlides);

            contentImages.forEach((img, index) => {
                img.classList.add('cursor-zoom-in', 'hover:opacity-90', 'transition-opacity');
                img.onclick = (e) => {
                    e.preventDefault();
                    setLightboxIndex(blog.coverImage ? index + 1 : index);
                    setLightboxOpen(true);
                };
            });

        }, 100);
    }, [blog]);

    // ... (Keep handleShare, scrollToTop, calculateReadTime, scrollListener, loading checks)
    const handleShare = async () => {
        if (navigator.share) {
            try { await navigator.share({ title: blog.title, url: window.location.href }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
        }
    };
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const calculateReadTime = (content) => Math.ceil(content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200);
    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) return <div className="min-h-screen bg-[#050505] flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
    if (!blog) return <div className="min-h-screen bg-[#050505] flex justify-center items-center text-white">Blog not found.</div>;

    const metaDescription = blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + "...";
    const metaImage = blog.coverImage || "https://yourwebsite.com/default-share-image.jpg";

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30 pb-20 relative">
            <Helmet>
                <title>{blog.title} | GhostOfWeb</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:image" content={metaImage} />
            </Helmet>

            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 origin-left z-50" style={{ scaleX }} />

            <div className="fixed top-0 left-0 w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/blogs')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
                    </button>
                    <span className="text-sm font-bold text-white truncate max-w-[200px]">{blog.title}</span>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 md:px-6 pt-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <header className="mb-10 border-b border-white/5 pb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">{blog.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                                {blog.author?.username?.[0]?.toUpperCase()}
                            </div>
                            <span>{blog.author?.name}</span>
                        </div>
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(new Date(blog.createdAt), 'MMM dd, yyyy')}</div>
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {calculateReadTime(blog.content)} min read</div>
                        <button onClick={handleShare} className="ml-auto p-2 hover:bg-white/10 rounded-full text-white"><Share2 className="w-5 h-5"/></button>
                    </div>
                </header>

                {blog.coverImage && (
                    <div className="mb-12 rounded-xl overflow-hidden border border-white/10 cursor-zoom-in" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
                        <img src={blog.coverImage} alt={blog.title} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                )}

                {/* Content */}
                <div className="prose-content max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />

                {/* Footer */}
                <div className="mt-20 pt-10 border-t border-white/10 text-center">
                    <p className="text-zinc-500 text-sm flex items-center justify-center gap-2"><Terminal className="w-4 h-4"/> End of transmission.</p>
                </div>
            </article>

            <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} index={lightboxIndex} slides={slides} plugins={[Zoom]} />

            {showScrollTop && (
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 p-3 bg-indigo-600 rounded-full text-white shadow-lg z-50 hover:bg-indigo-500 transition-colors">
                    <ChevronUp className="w-5 h-5" />
                </button>
            )}

            {/* --- FORCED COLORS & RESPONSIVE FIXES --- */}
            <style>{`
                /* 1. FORCE COLORS (Dracula Theme Manual Injection) */
                /* If Prism CSS fails, this guarantees color */
                .prose-content pre code span.token.comment, .prose-content pre code span.token.prolog { color: #6272a4 !important; font-style: italic; }
                .prose-content pre code span.token.function { color: #50fa7b !important; }
                .prose-content pre code span.token.keyword { color: #ff79c6 !important; }
                .prose-content pre code span.token.string { color: #f1fa8c !important; }
                .prose-content pre code span.token.number { color: #bd93f9 !important; }
                .prose-content pre code span.token.operator { color: #ff79c6 !important; }
                .prose-content pre code span.token.class-name { color: #8be9fd !important; }
                .prose-content pre code span.token.punctuation { color: #f8f8f2 !important; }

                /* 2. BASE TYPOGRAPHY */
                .prose-content { font-size: 1.125rem; line-height: 1.8; color: #d4d4d8; }
                .prose-content h1, .prose-content h2, .prose-content h3 { color: #fff; font-weight: 700; margin-top: 2em; margin-bottom: 0.8em; }
                .prose-content h2 { font-size: 1.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.3em; }
                .prose-content a { color: #818cf8; text-decoration: underline; text-underline-offset: 4px; }
                .prose-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
                .prose-content li { margin-bottom: 0.5em; }
                .prose-content blockquote { 
                    border-left: 4px solid #6366f1; padding: 1rem 1.5rem; margin: 2em 0; 
                    background: rgba(99,102,241,0.05); border-radius: 0 8px 8px 0;
                    color: #a5b4fc; font-style: italic;
                }
                .prose-content img { 
                    border-radius: 0.75rem; margin: 2.5em auto; border: 1px solid rgba(255,255,255,0.1); max-width: 100%; height: auto;
                }

                /* 3. CODE BLOCK CONTAINER (Mobile Scroll Fix) */
                .prose-content pre { 
                    margin: 0 !important; 
                    background: #1e1e1e !important; 
                    padding: 1.5rem !important; 
                    overflow-x: auto !important; /* Critical for mobile */
                    white-space: pre !important; /* Keep formatting */
                    font-size: 0.9em !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    line-height: 1.6 !important;
                    border: none !important;
                    color: #f8f8f2 !important; /* Default Text Color */
                }

                .code-wrapper {
                    margin: 2.5em 0;
                    width: 100%;
                    max-width: 100%; /* Prevent overflow */
                }

                /* Mobile Tweaks */
                @media (max-width: 640px) {
                    .code-wrapper { margin: 1.5em 0; border-radius: 8px; }
                    .prose-content { font-size: 1rem; }
                    .prose-content pre { padding: 1rem !important; font-size: 0.8em !important; }
                }
            `}</style>
        </div>
    );
};

export default BlogDetails;
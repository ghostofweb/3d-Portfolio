import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, User, Share2, Loader2, Tag, ChevronUp, Terminal, Check, Copy } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

// --- LIGHTBOX & SYNTAX HIGHLIGHTING ---
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions"; // Optional: Shows alt text
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark Theme
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-python';
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
    const [slides, setSlides] = useState([]); // Unified slides array

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

    // --- DOM HANDLING: Images & Code Blocks ---
    useEffect(() => {
        if (!blog) return;

        // Give React a moment to render the HTML string
        setTimeout(() => {
            // 1. SYNTAX HIGHLIGHTING & COPY BUTTONS
            Prism.highlightAll();
            
            const preBlocks = document.querySelectorAll('pre');
            preBlocks.forEach((pre) => {
                // Prevent duplicate buttons if re-render happens
                if (pre.parentNode.classList.contains('code-wrapper')) return;

                // Create Wrapper
                const wrapper = document.createElement('div');
                wrapper.className = 'code-wrapper relative my-8 rounded-xl overflow-hidden shadow-2xl bg-[#0f0f11] group';
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(pre);

                // Create Copy Button
                const btn = document.createElement('button');
                btn.className = 'absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100';
                btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
                
                btn.onclick = () => {
                    const code = pre.querySelector('code')?.innerText || pre.innerText;
                    navigator.clipboard.writeText(code);
                    
                    // Show "Check" Icon
                    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                    
                    // Revert after 2s
                    setTimeout(() => {
                        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
                    }, 2000);
                };

                wrapper.appendChild(btn);
            });

            // 2. IMAGE LIGHTBOX SETUP
            const contentImages = Array.from(document.querySelectorAll('.prose-content img'));
            
            // Build the slides array (Cover Image + Content Images)
            const newSlides = [];
            if (blog.coverImage) {
                newSlides.push({ src: blog.coverImage, alt: blog.title });
            }
            contentImages.forEach(img => {
                newSlides.push({ src: img.src, alt: img.alt || "Blog image" });
            });
            setSlides(newSlides);

            // Attach Click Listeners to DOM Images
            contentImages.forEach((img, index) => {
                img.style.cursor = 'zoom-in';
                img.classList.add('hover:opacity-90', 'transition-opacity');
                
                img.onclick = (e) => {
                    e.preventDefault();
                    // Calculate correct index: If cover exists, content images start at index 1
                    const targetIndex = blog.coverImage ? index + 1 : index;
                    setLightboxIndex(targetIndex);
                    setLightboxOpen(true);
                };
            });

        }, 150); // Slight delay to ensure DOM is ready
    }, [blog]);

    // --- UTILS ---
    const handleShare = async () => {
        const shareData = {
            title: blog?.title,
            text: `Read this article: ${blog?.title}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try { await navigator.share(shareData); } catch (err) { /* User cancelled */ }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!", { theme: "dark", position: "bottom-center" });
        }
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const calculateReadTime = (content) => {
        const text = content.replace(/<[^>]*>/g, '');
        return Math.ceil(text.split(/\s+/).length / 200);
    };

    // --- SCROLL LISTENER ---
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
                <meta property="og:title" content={blog.title} />
                <meta property="og:image" content={metaImage} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 origin-left z-50" style={{ scaleX }} />

            <div className="fixed top-0 left-0 w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/blogs')} className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="hidden sm:inline">Back to Archives</span>
                    </button>
                    <span className="text-sm font-bold text-white truncate max-w-[200px] opacity-0 sm:opacity-100 transition-opacity">{blog.title}</span>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-6 pt-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <header className="mb-12 border-b border-white/5 pb-10">
                    <div className="flex flex-wrap gap-3 mb-6">
                        {blog.tags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-default">
                                <Tag className="w-3 h-3" /> {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8 tracking-tight drop-shadow-lg">{blog.title}</h1>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white font-bold shadow-inner">
                                {blog.author?.username?.[0]?.toUpperCase() || <User className="w-5 h-5"/>}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Author</span>
                                <span className="text-zinc-200 text-sm font-medium">{blog.author?.name || "Ghost"}</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1"><Calendar className="w-3 h-3"/> Published</span>
                            <span className="text-zinc-200 text-sm font-medium">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Read Time</span>
                            <span className="text-zinc-200 text-sm font-medium">{calculateReadTime(blog.content)} min read</span>
                        </div>
                        <div className="flex items-center justify-end">
                             <button onClick={handleShare} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-300 hover:text-white transition-all shadow-lg active:scale-95" title="Share Article">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* COVER IMAGE - Click to open Lightbox at Index 0 */}
                {blog.coverImage && (
                    <div 
                        className="mb-16 relative group rounded-2xl overflow-hidden shadow-2xl shadow-black/50 cursor-zoom-in"
                        onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative bg-zinc-900 border border-white/10 aspect-video md:aspect-[21/9]">
                            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"/>
                        </div>
                    </div>
                )}

                <div className="prose-content max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />

                <div className="mt-24 pt-10 border-t border-white/10">
                    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-b from-zinc-900/50 to-transparent border border-white/5 rounded-2xl text-center">
                        <Terminal className="w-8 h-8 text-indigo-500 mb-2" />
                        <div>
                            <h3 className="text-white font-bold text-lg">End of transmission.</h3>
                            <p className="text-zinc-500 text-sm mt-1">Thank you for exploring the archives.</p>
                        </div>
                    </div>
                </div>
            </article>

            {/* LIGHTBOX VIEWER */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
                plugins={[Zoom, Captions]}
                animation={{ fade: 250 }}
                zoom={{ maxZoomPixelRatio: 3 }} // Enables deep zoom
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.95)" } }}
                render={{
                    buttonPrev: slides.length <= 1 ? () => null : undefined,
                    buttonNext: slides.length <= 1 ? () => null : undefined,
                }}
            />

            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-900/50 z-50 transition-colors"
                    >
                        <ChevronUp className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            <style>{`
                /* --- TYPOGRAPHY FIXES --- */
                .prose-content { font-size: 1.125rem; line-height: 1.8; color: #d4d4d8; }
                .prose-content h1, .prose-content h2, .prose-content h3 { color: #fff; font-weight: 700; margin-top: 2.5em; margin-bottom: 0.8em; }
                .prose-content h2 { font-size: 1.875rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.3em; margin-top: 3em; }
                .prose-content a { color: #818cf8; text-decoration: none; border-bottom: 1px solid rgba(129, 140, 248, 0.4); transition: all 0.2s; }
                .prose-content a:hover { color: #a5b4fc; border-bottom-color: #a5b4fc; }

                /* --- CODE BLOCKS (MAC STYLE) --- */
                .code-wrapper pre { 
                    margin: 0 !important; 
                    background: #09090b !important; 
                    padding: 3.5rem 1.5rem 1.5rem 1.5rem !important; 
                    border: none !important;
                }
                .code-wrapper::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 2.5rem;
                    background: #18181b; 
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    z-index: 10;
                }
                .code-wrapper::after {
                    content: "• • •";
                    position: absolute;
                    top: 0.6rem; left: 1rem;
                    font-size: 1.5rem; line-height: 1; letter-spacing: 4px;
                    background: linear-gradient(to right, #ef4444 33%, #eab308 33%, #eab308 66%, #22c55e 66%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    z-index: 11;
                }

                /* --- IMAGES --- */
                .prose-content img { 
                    border-radius: 0.75rem; 
                    margin: 3em auto; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
                }
                
                /* Prism Token Overrides for Consistency */
                code[class*="language-"], pre[class*="language-"] { 
                    text-shadow: none !important; 
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 0.9em !important;
                }
            `}</style>
        </div>
    );
};

export default BlogDetails;
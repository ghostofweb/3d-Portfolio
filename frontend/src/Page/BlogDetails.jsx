import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, User, Share2, Loader2, Tag, ChevronUp, Terminal } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

// --- LIGHTBOX & SYNTAX HIGHLIGHTING ---
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import 'prismjs/plugins/autoloader/prism-autoloader';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark Theme
// Import languages you usually write in
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
    const [blogImages, setBlogImages] = useState([]);

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

    // --- DOM MANIPULATION: Syntax Highlighting, Copy Buttons, Image Click ---
useEffect(() => {
    if (!blog) return;

    setTimeout(() => {
        // 1. Prepare blocks for Prism
        const preBlocks = document.querySelectorAll('pre');
        preBlocks.forEach((pre) => {
            // If Quill used 'ql-syntax', Prism might need a hint
            if (pre.classList.contains('ql-syntax') && !pre.classList.contains('language-javascript')) {
                pre.classList.add('language-javascript'); // Default fallback
            }
            
            // Ensure there is a <code> tag inside (Prism best practice)
            if (!pre.querySelector('code')) {
                const codeContent = pre.innerHTML;
                pre.innerHTML = `<code>${codeContent}</code>`;
            }
        });

        // 2. Highlight
        Prism.highlightAll();

        // 3. Add Copy Button (Your existing logic...)
        // ... rest of your code
    }, 100);
}, [blog]);

    // --- SHARE HANDLER (Mobile Native + Desktop Clipboard) ---
    const handleShare = async () => {
        const shareData = {
            title: blog.title,
            text: blog.title,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Share skipped");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!", { 
                position: "bottom-center", 
                autoClose: 2000, 
                theme: "dark" 
            });
        }
    };

    // --- SCROLL TO TOP ---
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) setShowScrollTop(true);
            else setShowScrollTop(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const calculateReadTime = (content) => {
        const text = content.replace(/<[^>]*>/g, '');
        return Math.ceil(text.split(/\s+/).length / 200);
    };

    if (loading) return <div className="min-h-screen bg-[#050505] flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
    if (!blog) return <div className="min-h-screen bg-[#050505] flex justify-center items-center text-white">Blog not found.</div>;

    const pageUrl = window.location.href;
    const metaDescription = blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + "...";
    const metaImage = blog.coverImage || "https://yourwebsite.com/default-share-image.jpg";
    const publishDate = new Date(blog.createdAt).toISOString();

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30 pb-20 relative">
            <Helmet>
                <title>{blog.title} | GhostOfWeb</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={blog.title} />
                <meta property="og:image" content={metaImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": blog.title,
                        "image": [metaImage],
                        "datePublished": publishDate,
                        "author": { "@type": "Person", "name": blog.author?.name || "GhostOfWeb" }
                    })}
                </script>
            </Helmet>

            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 origin-left z-50 shadow-[0_0_15px_rgba(99,102,241,0.6)]" style={{ scaleX }} />

            <div className="fixed top-0 left-0 w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/blogs')} className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                        <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /></div>
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

                {blog.coverImage && (
                    <div className="mb-16 relative group rounded-2xl overflow-hidden shadow-2xl shadow-black/50 cursor-zoom-in" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
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

            {/* Lightbox Component */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={blog.coverImage ? [{ src: blog.coverImage }, ...blogImages] : blogImages}
                plugins={[Zoom]}
                animation={{ fade: 250 }}
                zoom={{ maxZoomPixelRatio: 3 }}
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.95)" } }}
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
                .prose-content pre code {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
    text-shadow: none !important;
}

/* Prism Token Colors (Tomorrow Night Theme) */
.token.comment, .token.prolog, .token.doctype, .token.cdata { color: #999; }
.token.punctuation { color: #ccc; }
.token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #f08d49; }
.token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #7ec699; }
.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #a67f59; }
.token.atrule, .token.attr-value, .token.keyword { color: #cc99cd; }
.token.function, .token.class-name { color: #f08d49; }
.token.regex, .token.important, .token.variable { color: #e90; }

                /* --- GENERAL TYPOGRAPHY --- */
                .prose-content { font-size: 1.125rem; line-height: 1.8; color: #d4d4d8; /* zinc-300 */ }
                .prose-content h1, .prose-content h2, .prose-content h3 { color: #fff; font-weight: 700; margin-top: 2.5em; margin-bottom: 0.8em; letter-spacing: -0.02em; }
                .prose-content h2 { font-size: 1.875rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.3em; margin-top: 3em; }
                .prose-content h3 { font-size: 1.5rem; color: #e0e7ff; margin-top: 2em; }
                .prose-content a { color: #818cf8; text-decoration: none; border-bottom: 1px solid rgba(129, 140, 248, 0.4); transition: border 0.2s, color 0.2s; }
                .prose-content a:hover { color: #a5b4fc; border-bottom-color: #a5b4fc; }
                
                /* --- CODE BLOCK STYLING (Mac Terminal Look) --- */
                .prose-content pre { 
                    background: #09090b !important; /* Extremely Dark */
                    padding: 3.5rem 1.5rem 1.5rem 1.5rem !important; 
                    border-radius: 0.75rem; 
                    overflow-x: auto; 
                    border: 1px solid rgba(255,255,255,0.1);
                    position: relative;
                }
                
                /* Mac Window Header */
                .prose-content pre::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2.5rem;
                    background: #18181b; 
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    border-radius: 0.75rem 0.75rem 0 0;
                    z-index: 10;
                }

                /* Mac Window Dots */
                .prose-content pre::after {
                    content: "• • •";
                    position: absolute;
                    top: 0.3rem;
                    left: 1rem;
                    font-size: 2rem;
                    line-height: 1;
                    letter-spacing: 2px;
                    background: linear-gradient(to right, #ef4444 33%, #eab308 33%, #eab308 66%, #22c55e 66%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    z-index: 11;
                }

                /* Code Font Adjustment */
                .prose-content code { 
                    font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                    font-size: 0.9em; 
                    text-shadow: none !important; /* Remove Prism shadow for cleaner look */
                }

                /* Inline Code (e.g. \`const x\`) */
                .prose-content p code, .prose-content li code { 
                    background: rgba(255,255,255,0.1); 
                    color: #a5b4fc; 
                    padding: 0.2em 0.4em; 
                    border-radius: 0.3em; 
                    font-size: 0.85em; 
                    border: 1px solid rgba(255,255,255,0.1);
                }

                /* --- LISTS & QUOTES --- */
                .prose-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
                .prose-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.5em; }
                .prose-content li { margin-bottom: 0.5em; color: #d4d4d8; padding-left: 0.5em; }
                .prose-content blockquote { 
                    border-left: 4px solid #6366f1; 
                    padding: 1rem 1.5rem; 
                    margin: 2.5em 0; 
                    font-style: italic; 
                    color: #a1a1aa; 
                    background: rgba(99,102,241,0.05); 
                    border-radius: 0 0.5rem 0.5rem 0; 
                }

                /* --- IMAGES --- */
                .prose-content img { 
                    border-radius: 0.75rem; 
                    margin: 3em auto; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); 
                }
            `}</style>
        </div>
    );
};

export default BlogDetails;
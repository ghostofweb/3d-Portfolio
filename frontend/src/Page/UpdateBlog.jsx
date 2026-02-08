import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Syntax Highlighting
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import {
  ArrowLeft, UploadCloud, X, Loader2, Save, Hash,
  LayoutTemplate, Settings, Globe, Eye, Edit2,
  Image as ImageIcon, Calendar, Clock, Code
} from 'lucide-react';
import { toast } from 'react-toastify';

// Configure Highlight.js
window.hljs = hljs;

// --- UTILS ---
const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
};

const CustomToolbar = () => (
  <div id="toolbar" className="flex flex-wrap gap-2 items-center">
    <span className="ql-formats">
      <select className="ql-header" defaultValue="" onChange={e => e.persist()}>
        <option value="1" />
        <option value="2" />
        <option value="" />
      </select>
    </span>
    <span className="ql-formats flex">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-code-block" title="Code Block" />
    </span>
    <span className="ql-formats hidden sm:flex">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-blockquote" />
    </span>
    <span className="ql-formats flex">
      <button className="ql-link" />
      <button className="ql-image" />
    </span>
    <span className="ql-formats hidden sm:flex">
      <button className="ql-clean" />
    </span>
  </div>
);

const UpdateBlog = () => {
  const navigate = useNavigate();
  const { slug: routeSlug } = useParams();
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);
  const titleRef = useRef(null);

  // --- STATE ---
  const [blogId, setBlogId] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Settings & UI
  const [isPublished, setIsPublished] = useState(false);
  const [viewMode, setViewMode] = useState('edit');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchBlogData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/blog/edit-blog/${routeSlug}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                const data = response.data.data;
                setBlogId(data._id);
                setTitle(data.title);
                setSlug(data.slug);
                setContent(data.content);
                setTags(data.tags || []);
                setIsPublished(data.isPublished);
                if (data.coverImage) setPreviewUrl(data.coverImage);
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/admin/login');
            } else {
                toast.error("Could not load blog details.");
                navigate('/admin/dashboard');
            }
        } finally {
            setFetching(false);
        }
    };

    if (routeSlug) fetchBlogData();
  }, [routeSlug, navigate]);

  // 2. Auto-resize Title
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  // --- 2. IMAGE PROCESSING ---
  const processContentImages = async (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    const token = localStorage.getItem('accessToken');

    let updatedContent = htmlContent;
    let imageCount = 0;
    const base64Images = Array.from(images).filter(img => img.src.startsWith('data:'));

    if (base64Images.length > 0) {
        setProcessingStatus(`Processing ${base64Images.length} new images...`);
        for (const img of base64Images) {
            imageCount++;
            setProcessingStatus(`Uploading image ${imageCount} of ${base64Images.length}...`);
            const file = dataURLtoFile(img.src, `update-img-${Date.now()}.png`);
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/blog/upload-image`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    img.src = res.data.url;
                }
            } catch (err) {
                toast.error(`Failed to upload image ${imageCount}`);
            }
        }
        updatedContent = doc.body.innerHTML;
    }
    return updatedContent;
  };

  // --- 3. UPDATE HANDLER ---
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required.");
      return;
    }
    setLoading(true);
    try {
      const finalContent = await processContentImages(content);
      setProcessingStatus('Updating post...');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', finalContent);
      formData.append('tags', tags.join(','));
      formData.append('isPublished', isPublished);
      if (coverImage) formData.append('coverImage', coverImage);

      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/edit-blog/${blogId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("✨ Blog Updated Successfully!");
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
      setProcessingStatus('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const modules = useMemo(() => ({
    toolbar: { container: "#toolbar" },
    syntax: { highlight: (text) => hljs.highlightAuto(text).value },
    clipboard: { matchVisual: false }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image', 'code-block'
  ];

  const readingTime = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [content]);

  if (fetching) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 relative overflow-x-hidden">

      {/* 🛑 CSS FIXES FOR DARK MODE & RESPONSIVENESS */}
      <style>{`
        /* Quill Container */
        .ql-container { font-family: inherit; border: none !important; }
        .ql-editor { padding: 0 !important; min-height: 60vh; color: #E4E4E7; line-height: 1.8; font-size: 1.125rem; }
        .ql-editor.ql-blank::before { color: #52525B; font-style: normal; font-size: 1.125rem; }

        /* Dark Mode Toolbar Icons */
        #toolbar .ql-stroke { stroke: #A1A1AA; }
        #toolbar .ql-fill { fill: #A1A1AA; }
        #toolbar button:hover .ql-stroke { stroke: #FFFFFF; }
        #toolbar button:hover .ql-fill { fill: #FFFFFF; }
        #toolbar .ql-active .ql-stroke { stroke: #818cf8 !important; }
        #toolbar .ql-active .ql-fill { fill: #818cf8 !important; }

        /* Dark Mode Picker */
        #toolbar .ql-picker { color: #A1A1AA; }
        #toolbar .ql-picker-label:hover { color: white; }
        #toolbar .ql-picker-options { background-color: #18181B; border: 1px solid #27272A; }
        #toolbar .ql-picker-item { color: #A1A1AA; }
        #toolbar .ql-picker-item:hover { color: white; }

        /* Code Blocks */
        .ql-snow .ql-editor pre.ql-syntax {
            background-color: #0d1117; color: #c9d1d9; border-radius: 8px; padding: 1rem;
            border: 1px solid #30363d; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem;
            margin: 1.5rem 0; overflow-x: auto;
        }

        .ql-editor img { border-radius: 8px; max-width: 100%; margin: 1.5rem 0; display: block; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }

        /* Mobile Toolbar Adjustments */
        @media (max-width: 768px) {
            #toolbar {
                overflow-x: auto;
                white-space: nowrap;
                padding: 8px 16px;
                -webkit-overflow-scrolling: touch;
                background: rgba(5,5,5,0.95);
                backdrop-filter: blur(4px);
            }
            .ql-editor { font-size: 1rem; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06] h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight hidden sm:block">Edit Post</span>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                <span className="hidden xs:inline">{isPublished ? 'Public' : 'Draft'}</span>
                <span className="hidden xs:inline">•</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {readingTime} min</span>
            </div>
          </div>
        </div>

        {/* TOOLBAR CONTAINER - MOBILE STICKY */}
        <div className={`
            ${viewMode === 'edit' ? 'block' : 'hidden'}
            fixed top-[64px] left-0 right-0 z-30 border-b border-white/10 w-full
            md:static md:top-auto md:left-auto md:right-auto md:z-auto md:border-none md:w-auto md:bg-transparent
        `}>
             <CustomToolbar />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-[#111] p-1 rounded-lg border border-white/10 flex">
             <button onClick={() => setViewMode('edit')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'edit' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Edit2 className="w-4 h-4" /></button>
             <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Eye className="w-4 h-4" /></button>
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>

          <button onClick={() => setShowSettings(true)} className={`p-2 rounded-lg transition-colors text-zinc-400 hover:text-white ${showSettings ? 'bg-white/10 text-white' : ''}`}><Settings className="w-5 h-5" /></button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-3 md:px-5 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPublished ? <Globe className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
            <span className="hidden sm:inline">{loading ? (processingStatus ? 'Processing...' : 'Updating...') : 'Update'}</span>
          </button>
        </div>
      </nav>

      {/* PROCESSING OVERLAY */}
      {loading && processingStatus && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">{processingStatus}</h3>
              <p className="text-zinc-500 text-sm">Please do not close this tab.</p>
          </div>
      )}

      {/* SETTINGS DRAWER */}
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />

            <aside className="absolute bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:left-auto md:w-96 bg-[#090909] border-t md:border-t-0 md:border-l border-white/[0.08] p-6 shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-right duration-300 rounded-t-2xl md:rounded-none h-[80vh] md:h-auto overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> Configuration</h3>
                    <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-zinc-300">Visibility</label>
                        <div className="bg-[#111] p-1 rounded-xl flex border border-white/5">
                            <button onClick={() => setIsPublished(true)} className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${isPublished ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}><Globe className="w-3 h-3" /> Public</button>
                            <button onClick={() => setIsPublished(false)} className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${!isPublished ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}><Save className="w-3 h-3" /> Private</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-300">URL Slug</label>
                        <div className="flex items-center bg-[#111] border border-white/10 rounded-xl px-3 py-3">
                            <span className="text-zinc-600 text-xs mr-1">/blog/</span>
                            <input type="text" value={slug} disabled className="bg-transparent border-none outline-none text-xs text-zinc-500 w-full font-mono cursor-not-allowed" />
                        </div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-white/5">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500 flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Cover Image</span>
                            <span className={previewUrl ? "text-emerald-500" : "text-zinc-600"}>{previewUrl ? "Present" : "Empty"}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {/* pt-40: Large padding on mobile to clear fixed Navbar + Sticky Toolbar 
          md:pt-28: Normal padding on desktop 
      */}
      <main className="pt-40 md:pt-28 pb-32 max-w-4xl mx-auto px-4 md:px-6">
        <div className={viewMode === 'edit' ? 'block' : 'hidden'}>

            {/* Cover Image */}
            {/* Added mt-6 to push it away from the toolbar on mobile */}
            <div className="group relative mb-12 mt-6 md:mt-0">
                {!previewUrl ? (
                    <div onClick={() => fileInputRef.current.click()} className="w-full h-32 md:h-48 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-500 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
                        <div className="p-3 bg-zinc-900 rounded-full shadow-xl"><UploadCloud className="w-5 h-5 text-zinc-400" /></div>
                        <p className="text-xs text-zinc-500 font-medium">Change Cover Image</p>
                    </div>
                ) : (
                    <div className="relative w-full h-[200px] md:h-[350px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                        <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
                        <button onClick={() => { setCoverImage(null); setPreviewUrl(null); }} className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white p-1.5 rounded-lg hover:bg-red-600 border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>

            {/* Title Input */}
            <textarea
                ref={titleRef}
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={1}
                className="w-full bg-transparent text-3xl md:text-5xl font-extrabold text-white placeholder:text-zinc-700 border-none outline-none focus:ring-0 p-0 leading-tight mb-10 resize-none overflow-hidden"
            />

            {/* Tags Input */}
            <div className="flex flex-wrap items-center gap-2 mb-12">
                <Hash className="w-4 h-4 text-zinc-600" />
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">{tag} <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-zinc-500 hover:text-red-400"><X className="w-3 h-3" /></button></span>
                ))}
                <input type="text" placeholder="Add tags..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="bg-transparent border-none outline-none focus:ring-0 text-sm w-32 text-zinc-400 placeholder:text-zinc-600" />
            </div>

            {/* Editor */}
            <div className="prose prose-invert max-w-none pb-20">
                <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} placeholder="Start writing..." />
            </div>
        </div>

        {/* PREVIEW MODE */}
        <div className={`prose prose-invert max-w-none ${viewMode === 'preview' ? 'block' : 'hidden'}`}>
             <div className="border-b border-white/10 pb-8 mb-8">
                {previewUrl && <img src={previewUrl} alt="Cover" className="w-full h-[200px] md:h-[400px] object-cover rounded-xl mb-8 shadow-2xl" />}
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{title || "Untitled Post"}</h1>
                <div className="flex flex-wrap gap-2">{tags.map(t => <span key={t} className="text-xs text-indigo-400 font-mono">#{t}</span>)}</div>
             </div>
             <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </main>
    </div>
  );
};

export default UpdateBlog;
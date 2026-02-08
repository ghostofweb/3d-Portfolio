import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Syntax Highlighting (IDE Feel)
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; 

import { 
  ArrowLeft, UploadCloud, X, Loader2, Save, Hash, 
  LayoutTemplate, Settings, Globe, Eye, Edit2, 
  Image as ImageIcon, Calendar, Clock, Code, Menu
} from 'lucide-react';
import { toast } from 'react-toastify';

// Configure Highlight.js
window.hljs = hljs; 

// --- UTILS: Base64 Converter ---
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
  <div id="toolbar" className="flex flex-wrap gap-1 md:gap-2 items-center border-b border-white/5 p-2 sticky top-[64px] z-30 bg-[#050505]/95 backdrop-blur-sm">
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

const CreateBlog = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

  // --- STATE ---
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
  const [showSettings, setShowSettings] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Auto-slug
  useEffect(() => {
    const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  }, [title]);

  // --- 1. IMAGE PROCESSING LOGIC ---
  const processContentImages = async (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    const token = localStorage.getItem('accessToken');

    let updatedContent = htmlContent;
    let imageCount = 0;
    const base64Images = Array.from(images).filter(img => img.src.startsWith('data:'));

    if (base64Images.length > 0) {
        setProcessingStatus(`Processing ${base64Images.length} images...`);
        
        for (const img of base64Images) {
            imageCount++;
            setProcessingStatus(`Uploading image ${imageCount} of ${base64Images.length}...`);

            const file = dataURLtoFile(img.src, `blog-image-${Date.now()}.png`);
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
                console.error("Image upload failed", err);
                toast.error(`Failed to upload image ${imageCount}`);
                throw new Error("Image upload failed");
            }
        }
        updatedContent = doc.body.innerHTML;
    }
    return updatedContent;
  };

  // --- 2. PUBLISH HANDLER ---
  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required.");
      return;
    }

    setLoading(true);

    try {
      const finalContent = await processContentImages(content);
      setProcessingStatus('Saving post...');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('content', finalContent);
      formData.append('tags', tags.join(',')); 
      formData.append('isPublished', isPublished);
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/create-blog`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(isPublished ? "🚀 Blog Published!" : "💾 Draft Saved");
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save blog");
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

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 relative overflow-x-hidden">
      
      <style>{`
        .ql-container { font-family: inherit; border: none !important; }
        .ql-editor { padding: 0 !important; min-height: 60vh; color: #E4E4E7; line-height: 1.8; font-size: 1.125rem; }
        .ql-editor.ql-blank::before { color: #52525B; font-style: normal; font-size: 1.125rem; }
        
        .ql-snow .ql-editor pre.ql-syntax {
            background-color: #0d1117;
            color: #c9d1d9;
            border-radius: 8px;
            padding: 1rem;
            border: 1px solid #30363d;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 1.5rem 0;
            overflow-x: auto;
            position: relative;
        }
        
        .ql-editor img {
            border-radius: 8px;
            max-width: 100%;
            margin: 1.5rem 0;
            display: block;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }

        #toolbar button { color: #71717A; transition: 0.2s; }
        #toolbar button:hover { color: white; }
        #toolbar .ql-active { color: #818cf8 !important; }
        
        /* Mobile Toolbar Fixes */
        @media (max-width: 640px) {
            #toolbar { overflow-x: auto; white-space: nowrap; padding-bottom: 8px; }
            .ql-editor { font-size: 1rem; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06] h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight hidden sm:block">Create Post</span>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                <span className="hidden xs:inline">{isPublished ? 'Public' : 'Draft'}</span>
                <span className="hidden xs:inline">•</span> 
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {readingTime} min</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-[#111] p-1 rounded-lg border border-white/10 flex">
             <button onClick={() => setViewMode('edit')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'edit' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Edit2 className="w-4 h-4" /></button>
             <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Eye className="w-4 h-4" /></button>
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>
          
          <button onClick={() => setShowSettings(true)} className={`p-2 rounded-lg transition-colors text-zinc-400 hover:text-white ${showSettings ? 'bg-white/10 text-white' : ''}`}><Settings className="w-5 h-5" /></button>
          
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-3 md:px-5 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPublished ? <Globe className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
            <span className="hidden sm:inline">{loading ? (processingStatus ? 'Processing...' : 'Saving...') : isPublished ? 'Publish' : 'Save'}</span>
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

      {/* SETTINGS DRAWER (Responsive: Bottom Sheet on Mobile, Right Sidebar on Desktop) */}
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
                            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-transparent border-none outline-none text-xs text-zinc-200 w-full font-mono" />
                        </div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-white/5">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500 flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Cover Image</span>
                            <span className={coverImage ? "text-emerald-500" : "text-zinc-600"}>{coverImage ? "Uploaded" : "Empty"}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      )}

      {/* EDITOR CANVAS */}
      <main className="pt-20 md:pt-28 pb-32 max-w-4xl mx-auto px-4 md:px-6">
        <div className={viewMode === 'edit' ? 'block' : 'hidden'}>
            
            {/* Custom Toolbar rendered here on Mobile/Desktop */}
            <div className="md:hidden sticky top-[64px] z-30 -mx-4 px-4 bg-[#050505] border-b border-white/5 mb-6">
                 <CustomToolbar />
            </div>
            
            <div className="hidden md:block mb-8">
                 <CustomToolbar />
            </div>

            {/* Cover Image Upload */}
            <div className="group relative mb-8">
                {!previewUrl ? (
                    <div onClick={() => fileInputRef.current.click()} className="w-full h-32 md:h-48 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-500 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
                        <div className="p-3 bg-zinc-900 rounded-full shadow-xl"><UploadCloud className="w-5 h-5 text-zinc-400" /></div>
                        <p className="text-xs text-zinc-500 font-medium">Add Cover Image</p>
                    </div>
                ) : (
                    <div className="relative w-full h-[200px] md:h-[350px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                        <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
                        <button onClick={() => { setCoverImage(null); setPreviewUrl(null); }} className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white p-1.5 rounded-lg hover:bg-red-600 border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>

            <textarea 
                placeholder="Post Title" 
                value={title} 
                onChange={(e) => { setTitle(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} 
                rows={1} 
                className="w-full bg-transparent text-3xl md:text-5xl font-extrabold text-white placeholder:text-zinc-700 border-none outline-none focus:ring-0 p-0 leading-tight mb-6 resize-none overflow-hidden" 
            />

            <div className="flex flex-wrap items-center gap-2 mb-8">
                <Hash className="w-4 h-4 text-zinc-600" />
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">{tag} <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-zinc-500 hover:text-red-400"><X className="w-3 h-3" /></button></span>
                ))}
                <input type="text" placeholder="Add tags..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="bg-transparent border-none outline-none focus:ring-0 text-sm w-32 text-zinc-400 placeholder:text-zinc-600" />
            </div>

            <div className="prose prose-invert max-w-none pb-20">
                <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} placeholder="Tell your story..." />
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

export default CreateBlog;
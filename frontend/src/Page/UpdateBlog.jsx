import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  ArrowLeft, UploadCloud, X, Loader2, Save, Hash, 
  LayoutTemplate, Settings, Globe, Image as ImageIcon, Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';

// --- QUILL MODULES ---
const modules = {
  toolbar: { container: "#toolbar" },
};

const formats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 
  'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'code-block'
];

const UpdateBlog = () => {
  const navigate = useNavigate();
  const { slug: routeSlug } = useParams(); // Get slug from URL
  const fileInputRef = useRef(null);

  // --- STATE ---
  const [blogId, setBlogId] = useState(null); // Store the actual ID for the PUT request
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(null); // New file to upload
  const [previewUrl, setPreviewUrl] = useState(null); // URL to show (existing or new)
  
  // Meta Settings
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false); 
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Loading state for initial fetch
  const [showSettings, setShowSettings] = useState(false);


  useEffect(() => {
    const fetchBlogData = async () => {
        try {
            // 1. Get the token from storage
            const token = localStorage.getItem('accessToken');

            // 2. Attach it to the headers
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/blog/edit-blog/${routeSlug}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }
            );

            if (response.data.success) {
                const data = response.data.data;
                
                // Populate State
                setBlogId(data._id);
                setTitle(data.title);
                setSlug(data.slug);
                setContent(data.content);
                setTags(data.tags || []);
                setIsPublished(data.isPublished);
                
                if (data.coverImage) {
                    setPreviewUrl(data.coverImage);
                }
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
            // If unauthorized (401) or forbidden (403), redirect to login
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error("Session expired. Please login again.");
                navigate('/this-or-that/admin/me/admin/login');
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

  // --- HANDLERS ---

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
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  // --- 2. UPDATE FUNCTION ---
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    // formData.append('slug', slug); // Usually we don't change slug on edit to preserve SEO, but you can if needed
    formData.append('content', content);
    formData.append('tags', tags.join(',')); 
    formData.append('isPublished', isPublished);
    
    // Only append image if user selected a NEW one
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      // NOTE: Using PUT and the blogId
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/edit-blog/${blogId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("✨ Blog Updated Successfully!");
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
      return (
          <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 relative overflow-x-hidden">
      
      {/* ... (Styles kept same as CreateBlog) ... */}
      <style>{`
        .ql-container { font-size: 1.125rem; font-family: inherit; border: none !important; }
        .ql-editor { padding: 0 !important; min-height: 50vh; color: #E4E4E7; line-height: 1.8; }
        .ql-editor.ql-blank::before { color: #52525B; font-style: normal; font-size: 1.125rem; }
        #toolbar { border: none; display: flex; gap: 8px; padding: 8px 0; }
        #toolbar button { color: #71717A; transition: color 0.2s; }
        #toolbar button:hover { color: #FFFFFF; }
        #toolbar .ql-active { color: #FFFFFF !important; }
        #toolbar .ql-formats { margin-right: 12px; border-right: 1px solid #27272A; padding-right: 12px; }
        #toolbar .ql-formats:last-child { border-right: none; }
      `}</style>

      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06] h-16 px-6 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight">Edit Post</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{isPublished ? 'Public' : 'Draft'} Mode</span>
          </div>
        </div>

        {/* Toolbar */}
        <div id="toolbar" className="hidden md:flex">
          <span className="ql-formats">
            <button className="ql-header" value="1"></button>
            <button className="ql-header" value="2"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
          </span>
          <span className="ql-formats">
             <button className="ql-list" value="ordered"></button>
             <button className="ql-list" value="bullet"></button>
             <button className="ql-blockquote"></button>
             <button className="ql-code-block"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-link"></button>
            <button className="ql-clean"></button>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-white/10 ${showSettings ? 'bg-white/10 text-white' : ''}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
          <button 
            onClick={handleUpdate} // <--- Call Update Handler
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </nav>

      {/* --- SETTINGS DRAWER --- */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowSettings(false)} />
      )}
      
      <aside className={`fixed top-0 right-0 bottom-0 w-96 bg-[#090909] border-l border-white/[0.08] z-50 p-6 transform transition-transform duration-300 ease-out shadow-2xl ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" /> Post Configuration
          </h3>
          <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-8">
          {/* Visibility */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-zinc-300">Visibility Status</label>
            <div className="bg-[#111] p-1 rounded-xl flex border border-white/5">
                <button onClick={() => setIsPublished(true)} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${isPublished ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <Globe className="w-3 h-3" /> Public
                </button>
                <button onClick={() => setIsPublished(false)} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${!isPublished ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <Save className="w-3 h-3" /> Private
                </button>
            </div>
          </div>

          {/* Slug (Read Only or Editable) */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">URL Slug</label>
            <div className="flex items-center bg-[#111] border border-white/10 rounded-xl px-3 py-2.5">
              <span className="text-zinc-600 text-xs mr-1">/blog/</span>
              <input type="text" value={slug} disabled className="bg-transparent border-none outline-none text-xs text-zinc-500 w-full font-mono cursor-not-allowed" />
            </div>
            <p className="text-[10px] text-zinc-600">Slugs cannot be changed after creation.</p>
          </div>
          
           {/* Metadata Info */}
           <div className="space-y-3 pt-6 border-t border-white/5">
             <div className="flex justify-between text-xs">
                <span className="text-zinc-500 flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Cover Image</span>
                <span className={previewUrl ? "text-emerald-500" : "text-zinc-600"}>{previewUrl ? "Present" : "Empty"}</span>
             </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN EDITOR --- */}
      <main className="pt-28 pb-32 max-w-3xl mx-auto px-6">
        
        {/* Cover Image */}
        <div className="group relative mb-12">
          {!previewUrl ? (
            <div onClick={() => fileInputRef.current.click()} className="w-full h-48 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-500 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-zinc-900 rounded-full shadow-xl"><UploadCloud className="w-5 h-5 text-zinc-400" /></div>
              <p className="text-xs text-zinc-500 font-medium">Add Cover Image</p>
            </div>
          ) : (
            <div className="relative w-full h-[350px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
              <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => fileInputRef.current.click()} className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-black/80 border border-white/10">Change</button>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>

        {/* Title */}
        <textarea 
          placeholder="Post Title" 
          value={title}
          onChange={(e) => { setTitle(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
          rows={1}
          className="w-full bg-transparent text-5xl font-extrabold text-white placeholder:text-zinc-700 border-none outline-none focus:ring-0 p-0 leading-tight mb-6 resize-none overflow-hidden"
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Hash className="w-4 h-4 text-zinc-600" />
          {tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">
              {tag} <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-zinc-500 hover:text-red-400"><X className="w-3 h-3" /></button>
            </span>
          ))}
          <input type="text" placeholder={tags.length === 0 ? "Add tags..." : ""} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="bg-transparent border-none outline-none focus:ring-0 text-sm w-32 text-zinc-400 placeholder:text-zinc-600" />
        </div>

        {/* Editor */}
        <div className="prose prose-invert max-w-none">
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} placeholder="Start writing..." />
        </div>

      </main>
    </div>
  );
};

export default UpdateBlog;
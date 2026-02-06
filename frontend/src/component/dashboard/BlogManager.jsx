import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Edit3, Trash2, AlertTriangle, X, Loader2, Calendar, User, 
  MoreVertical, Filter, Check, ChevronDown, 
  Search, ChevronLeft, ChevronRight, Lock // ✅ Added Lock Icon
} from 'lucide-react';
import { toast } from 'react-toastify';

const BlogManager = ({ blogs, refreshBlogs, currentUser, page, totalPages, onPageChange, search, setSearch }) => {
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState('all'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayedBlogs = blogs.filter(blog => {
      if (filter === 'mine') {
          return blog.author?._id === currentUser?._id;
      }
      return true;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ CHECK OWNERSHIP BEFORE DELETING
  const openDeleteModal = (blog) => { 
      const isAuthor = blog.author?._id === currentUser?._id;
      
      if (!isAuthor) {
          return toast.error("Access Denied: You can only delete your own posts.");
      }

      setBlogToDelete(blog); 
      setIsDeleteModalOpen(true); 
  };

  const closeDeleteModal = () => { setIsDeleteModalOpen(false); setBlogToDelete(null); };

  // ✅ CHECK OWNERSHIP BEFORE EDITING
  const handleEdit = (blog) => { 
      const isAuthor = blog.author?._id === currentUser?._id;

      if (!isAuthor) {
          return toast.error(`Access Denied: This post belongs to ${blog.author?.username}.`);
      }

      navigate(`/admin/edit-blog/${blog.slug}`); 
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/blog/delete-blog/${blogToDelete._id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (response.data.success) {
            toast.success("Post deleted successfully");
            if (refreshBlogs) await refreshBlogs();
            closeDeleteModal();
        }
    } catch (error) {
        // If the backend still throws a 403, we handle it gracefully here too
        toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

        {/* --- HEADER: Search & Filters --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search titles..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#0A0A0A] border border-white/10 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all placeholder:text-zinc-600 shadow-sm"
                />
            </div>

            <div className="relative" ref={filterRef}>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-3 py-2.5 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-all min-w-[140px] justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>{filter === 'all' ? 'All Posts' : 'My Posts'}</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95">
                        <div className="p-1">
                            <button onClick={() => { setFilter('all'); setIsFilterOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${filter === 'all' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}><span>All Posts</span>{filter === 'all' && <Check className="w-3 h-3" />}</button>
                            <button onClick={() => { setFilter('mine'); setIsFilterOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${filter === 'mine' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}><span>My Posts</span>{filter === 'mine' && <Check className="w-3 h-3" />}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0A0A0A] shadow-xl flex flex-col justify-between min-h-[500px]">
            <div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#111] text-zinc-500 font-medium border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-medium w-[40%]">Content</th>
                            <th className="px-6 py-4 font-medium">Author</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {displayedBlogs.length > 0 ? displayedBlogs.map((blog) => {
                            const isAuthor = blog.author?._id === currentUser?._id;
                            return (
                                <tr key={blog._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 relative">
                                                {blog.coverImage ? <img src={blog.coverImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><div className="w-2 h-2 rounded-full bg-zinc-800" /></div>}
                                            </div>
                                            <div className="flex flex-col max-w-[200px] md:max-w-xs">
                                                <span className="font-semibold text-zinc-200 group-hover:text-white truncate transition-colors text-[15px]">{blog.title}</span>
                                                <span className="text-xs text-zinc-500 truncate">/{blog.slug}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isAuthor ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20'}`}>{blog.author?.username?.[0]?.toUpperCase() || <User className="w-3 h-3"/>}</div>
                                            <span className={`${isAuthor ? 'text-white font-medium' : 'text-zinc-400'} text-xs`}>{isAuthor ? 'You' : (blog.author?.username || 'Unknown')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${blog.isPublished ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20'}`}>{blog.isPublished ? 'Published' : 'Draft'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-zinc-500"><Calendar className="w-3 h-3" /><span className="text-xs">{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Actions: Visually disabled if not author, but functional to show Toast error */}
                                        <div className={`flex justify-end gap-1 transition-opacity ${isAuthor ? 'opacity-60 group-hover:opacity-100' : 'opacity-30 group-hover:opacity-50'}`}>
                                            
                                            <button 
                                                onClick={() => handleEdit(blog)} 
                                                className={`p-2 rounded-lg transition-colors ${isAuthor ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'cursor-not-allowed text-zinc-600 hover:text-zinc-500'}`} 
                                                title="Edit"
                                            >
                                                {isAuthor ? <Edit3 className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                                            </button>

                                            <button 
                                                onClick={() => openDeleteModal(blog)} 
                                                className={`p-2 rounded-lg transition-colors ${isAuthor ? 'hover:bg-red-500/10 text-zinc-400 hover:text-red-500' : 'cursor-not-allowed text-zinc-600 hover:text-zinc-500'}`} 
                                                title="Delete"
                                            >
                                                {isAuthor ? <Trash2 className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="5" className="text-center py-20 text-zinc-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3"><Filter className="w-5 h-5 text-zinc-700" /></div>
                                        <p>No posts found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
                <div className="border-t border-white/5 bg-[#050505] p-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span></span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                <button key={pageNum} onClick={() => onPageChange(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === pageNum ? 'bg-white text-black font-bold' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>{pageNum}</button>
                            ))}
                        </div>
                        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
        </div>

        {/* ... Delete Modal (No Changes) ... */}
        {isDeleteModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDeleteModal}></div>
                <div className="relative w-full max-w-sm bg-[#090909] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Delete Post?</h3>
                        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                            Are you sure you want to remove <span className="text-white font-medium">"{blogToDelete?.title}"</span>?<br/>
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 w-full">
                            <button onClick={closeDeleteModal} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors border border-white/5">Cancel</button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2">
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default BlogManager;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  X, 
  Loader2,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-toastify';

const BlogManager = ({ blogs, refreshBlogs }) => {
  const navigate = useNavigate();
  
  // --- DELETE MODAL STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- HANDLERS ---

  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const handleEdit = (slug) => {
    navigate(`/admin/edit-blog/${slug}`);
  };

  // DELETE ACTION
  const confirmDelete = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/blog/delete-blog/${blogToDelete._id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.success) {
            toast.success("Post deleted successfully");
            
            // ✅ REFETCH DATA
            if (refreshBlogs) {
                await refreshBlogs();
            }
            
            closeDeleteModal();
        }
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

        {/* --- TABLE HEADER --- */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">All Posts ({blogs.length})</h2>
            {/* Optional: Add search or simple sort here later */}
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0A0A0A] shadow-xl">
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
                    {blogs.map((blog) => (
                        <tr key={blog._id} className="group hover:bg-white/[0.02] transition-colors">
                            
                            {/* 1. Content (Image + Title) */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 relative">
                                        {blog.coverImage ? (
                                            <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col max-w-[200px] md:max-w-xs">
                                        <span className="font-semibold text-zinc-200 group-hover:text-white truncate transition-colors text-[15px]">
                                            {blog.title}
                                        </span>
                                        <span className="text-xs text-zinc-500 truncate">
                                            /{blog.slug}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            {/* 2. Author */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">
                                        {blog.author?.username?.[0]?.toUpperCase() || <User className="w-3 h-3"/>}
                                    </div>
                                    <span className="text-zinc-400 text-xs font-medium">
                                        {blog.author?.username || 'Unknown'}
                                    </span>
                                </div>
                            </td>

                            {/* 3. Status */}
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                                    blog.isPublished 
                                    ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' 
                                    : 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20'
                                }`}>
                                    {blog.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </td>

                            {/* 4. Date */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-xs">
                                        {new Date(blog.createdAt).toLocaleDateString(undefined, { 
                                            month: 'short', day: 'numeric', year: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            </td>

                            {/* 5. Actions */}
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(blog.slug)}
                                        className="p-2 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => openDeleteModal(blog)}
                                        className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {blogs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                        <Edit3 className="w-6 h-6 text-zinc-700" />
                    </div>
                    <p>No posts found. Start writing your first blog!</p>
                </div>
            )}
        </div>

        {/* --- DELETE CONFIRMATION MODAL --- */}
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
                            <button 
                                onClick={closeDeleteModal}
                                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors border border-white/5"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                            >
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users } from 'lucide-react';
import { toast } from 'react-toastify'; // Import Toast

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
        <Icon className="w-16 h-16" />
    </div>
    <div className="relative z-10">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorClass} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-1">{title}</p>
    </div>
  </div>
);

// ✅ Accept currentUser prop here
const Overview = ({ blogs, users, currentUser }) => {
  const navigate = useNavigate();

  // ✅ New Helper Function to handle clicks safely
  const handleBlogClick = (blog) => {
    // 1. Check if the blog has an author and if IDs match
    // Note: ensure your backend populates author with _id
    const isAuthor = blog.author?._id === currentUser?._id;

    if (isAuthor) {
        // If owner, go to edit page
        navigate(`/admin/edit-blog/${blog.slug}`);
    } else {
        // If not owner, stay here and show error
        toast.error(`Access Denied. This post belongs to ${blog.author?.username || "another user"}.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- STATS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
                title="Total Published Posts" 
                value={blogs.length} 
                icon={FileText} 
                colorClass="text-emerald-500 bg-emerald-500" 
            />
            <StatCard 
                title="Active Team Members" 
                value={users.length} 
                icon={Users} 
                colorClass="text-blue-500 bg-blue-500" 
            />
        </div>

        {/* --- RECENT PUBLICATIONS LIST --- */}
        <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Latest Publications</h2>
            
            <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0A0A0A]">
                {blogs.slice(0, 5).map((blog, i) => {
                    // Check ownership for styling (optional)
                    const isAuthor = blog.author?._id === currentUser?._id;

                    return (
                        <div 
                            key={blog._id || i} 
                            // ✅ Use the new handler instead of direct navigate
                            onClick={() => handleBlogClick(blog)} 
                            className={`flex items-center justify-between p-4 border-b border-white/5 last:border-0 transition-all group cursor-pointer
                                ${isAuthor ? 'hover:bg-white/[0.04]' : 'hover:bg-red-500/[0.05] opacity-80 hover:opacity-100'}
                            `}
                        >
                            {/* Left Side: Image + Title */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0">
                                    {blog.coverImage ? (
                                        <img src={blog.coverImage} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600 text-[10px]">IMG</div>
                                    )}
                                </div>
                                
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[200px] md:max-w-md">
                                        {blog.title}
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        by <span className={isAuthor ? "text-emerald-500" : "text-zinc-400"}>
                                            {isAuthor ? "You" : `@${blog.author?.username}`}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Status + Lock/Arrow Icon */}
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                    blog.isPublished 
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                    {blog.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                </span>
                                
                                {/* Visual Cue: Show Padlock if not author, Arrow if author */}
                                {isAuthor ? (
                                    <svg className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors transform group-hover:translate-x-1 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-zinc-800 group-hover:text-red-500/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    );
                })}
                
                {blogs.length === 0 && (
                    <div className="p-8 text-center text-zinc-600 text-sm">No blogs published yet.</div>
                )}
            </div>
        </div>
        
    </div>
  );
};

export default Overview;
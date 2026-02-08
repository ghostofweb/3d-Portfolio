import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

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

const Overview = ({ blogs, users, currentUser, isDemo }) => {
  const navigate = useNavigate();

  const handleBlogClick = (blog) => {
    if (isDemo) return toast.info("Editing is disabled in Demo Mode.");
    const isAuthor = blog.author?._id === currentUser?._id;

    if (isAuthor) {
        navigate(`/admin/edit-blog/${blog.slug}`);
    } else {
        toast.error(`Access Denied. This post belongs to ${blog.author?.username || "another user"}.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
        
        {/* --- STATS SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <StatCard 
                title="Total Posts" 
                value={blogs.length} 
                icon={FileText} 
                colorClass="text-emerald-500 bg-emerald-500" 
            />
            <StatCard 
                title="Team Members" 
                value={users.length} 
                icon={Users} 
                colorClass="text-blue-500 bg-blue-500" 
            />
        </div>

        {/* --- RECENT PUBLICATIONS LIST --- */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Latest Publications</h2>
                <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-1 rounded-md hidden sm:inline-block">
                    Displaying last 5
                </span>
            </div>
            
            <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0A0A0A]">
                {blogs.length > 0 ? (
                    blogs.slice(0, 5).map((blog, i) => {
                        const isAuthor = blog.author?._id === currentUser?._id;

                        return (
                            <div 
                                key={blog._id || i} 
                                onClick={() => handleBlogClick(blog)} 
                                className={`
                                    flex items-center justify-between p-4 border-b border-white/5 last:border-0 transition-all cursor-pointer relative
                                    ${isAuthor 
                                        ? 'hover:bg-white/[0.04] group' 
                                        : 'hover:bg-red-500/[0.05] opacity-70 hover:opacity-100'
                                    }
                                `}
                            >
                                {/* Left Side: Image + Info */}
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                    {/* Thumbnail */}
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0 relative">
                                        {blog.coverImage ? (
                                            <img src={blog.coverImage} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                        )}
                                        {/* Mobile Lock Overlay for non-authors */}
                                        {!isAuthor && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center md:hidden">
                                                <Lock className="w-3 h-3 text-white/70" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex flex-col min-w-0 pr-2">
                                        <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                                            {blog.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-xs ${isAuthor ? "text-emerald-500" : "text-zinc-500"}`}>
                                                {isAuthor ? "You" : `@${blog.author?.username}`}
                                            </span>
                                            <span className="text-[10px] text-zinc-600">•</span>
                                            <span className="text-[10px] text-zinc-500 truncate">
                                                {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Status + Action Icon */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Status Badge - Hidden on very small screens */}
                                    <span className={`
                                        hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                                        ${blog.isPublished 
                                            ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' 
                                            : 'bg-yellow-500/5 text-yellow-500 border-yellow-500/10'
                                        }
                                    `}>
                                        {blog.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    
                                    {/* Icon Indicator */}
                                    {isAuthor ? (
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                                        </div>
                                    ) : (
                                        <div className="hidden md:flex w-8 h-8 rounded-full bg-red-500/5 items-center justify-center">
                                            <Lock className="w-3 h-3 text-red-500/50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No blogs published yet.</p>
                    </div>
                )}
            </div>
        </div>
        
    </div>
  );
};

export default Overview;
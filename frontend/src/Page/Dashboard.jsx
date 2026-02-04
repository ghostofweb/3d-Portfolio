import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, PenTool, Users, LogOut, Plus, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Import our new sub-components
import Overview from '../component/dashboard/Overview.jsx';
import UserManager from '../component/dashboard/UserManager.jsx';
import BlogManager from '../component/dashboard/BlogManager.jsx';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden
      ${active 
        ? 'text-white bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
      }`}
  >
    <Icon className={`w-4 h-4 transition-colors ${active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
    {label}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />}
  </button>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Auth & Data Fetch
  useEffect(() => {
    const initDashboard = async () => {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            toast.error("Unauthorized access.");
            navigate('/this-or-that/admin/me/admin/login');
            return;
        }

        setUser(JSON.parse(userData));

        try {
            // Fetch Blogs
            const blogRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/allblogs`);
            if (blogRes.data.success) {
                setBlogs(blogRes.data.data);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    initDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex font-sans selection:bg-white/20">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 border-r border-white/[0.08] flex flex-col justify-between fixed h-full bg-[#000000] z-50">
        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-lg tracking-tight">GhostOfWeb</span>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarItem icon={PenTool} label="Blog Posts" active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} />
            <SidebarItem icon={Users} label="Team Members" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          </nav>
        </div>

        <div className="p-4 border-t border-white/[0.08] bg-[#050505]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-zinc-300 group-hover:text-white transition-colors">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate uppercase tracking-wider">Master Admin</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors text-zinc-500">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-10 border-b border-white/[0.06] pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'blogs' && 'Content Management'}
                {activeTab === 'users' && 'Team & Roles'}
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
                {activeTab === 'overview' && 'Welcome back, Master. Here is what’s happening.'}
                {activeTab === 'blogs' && 'Manage, edit, and publish your latest stories.'}
                {activeTab === 'users' && 'Manage access levels and team composition.'}
            </p>
          </div>
          
          <div className="flex gap-3">
             {activeTab === 'blogs' && (
                 <button onClick={() => navigate('/admin/create-blog')} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                    <Plus className="w-4 h-4" />
                    Create Post
                 </button>
             )}
          </div>
        </header>

        {loading ? (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
            </div>
        ) : (
            <>
                {activeTab === 'overview' && <Overview blogs={blogs} users={users} />}
                {activeTab === 'blogs' && <BlogManager blogs={blogs} />}
                {activeTab === 'users' && <UserManager users={users} />}
            </>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
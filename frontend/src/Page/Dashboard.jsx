import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, PenTool, Users, LogOut, Plus, 
    Loader2, Settings, UserCog, Save, X 
} from 'lucide-react';
import { toast } from 'react-toastify';

import Overview from '../component/dashboard/Overview.jsx';
import UserManager from '../component/dashboard/UserManager.jsx';
import BlogManager from '../component/dashboard/BlogManager.jsx';

// ... SidebarItem Component (No Change) ...
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
  
  // Data State
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // --- FETCH DATA (Memoized) ---
  const fetchAllData = useCallback(async (pageNum = 1, searchQuery = "") => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
          setLoading(true);

          // 1. Fetch Blogs (with Query Params)
          const blogRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/blog/all-blogs?page=${pageNum}&limit=9&search=${searchQuery}`, 
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          
          if (blogRes.data.success) {
              // The backend now returns { blogs, totalPages, currentPage }
              setBlogs(blogRes.data.data.blogs);
              setTotalPages(blogRes.data.data.totalPages);
              setPage(blogRes.data.data.currentPage);
          }

          // 2. Fetch Users (Only need to do this once or on tab switch, but keeping simple here)
          if (activeTab === 'overview' || activeTab === 'users') {
             const userRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/all-users`,
                { headers: { 'Authorization': `Bearer ${token}` } }
             );
             if (userRes.data.success) setUsers(userRes.data.data);
          }

      } catch (error) {
          console.error("Dashboard Sync Error:", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
              localStorage.clear();
              navigate('/this-or-that/admin/me/admin/login');
          }
      } finally {
          setLoading(false);
      }
  }, [activeTab, navigate]);

  // Initial Load
  useEffect(() => {
    const initDashboard = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/this-or-that/admin/me/admin/login');
            return;
        }
        setUser(JSON.parse(userData));
        await fetchAllData(1, ""); // Load page 1, no search
    };
    initDashboard();
  }, [navigate, fetchAllData]);

  // --- DEBOUNCED SEARCH ---
  // When 'search' state changes, wait 500ms before calling API
  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
          if (activeTab === 'blogs') {
             fetchAllData(1, search); // Reset to page 1 when searching
          }
      }, 500); 

      return () => clearTimeout(delayDebounceFn);
  }, [search, activeTab, fetchAllData]);

  // --- HANDLERS ---
  const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchAllData(newPage, search);
      }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate('/');
  };

  // ... (handleProfileUpdateSuccess and EditProfileModal stay the same) ...
  const handleProfileUpdateSuccess = (updatedUser, newToken) => {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('accessToken', newToken);
      setIsProfileModalOpen(false);
      toast.success("Identity reconfigured successfully.");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex font-sans selection:bg-white/20">
      
      {/* 1. SIDEBAR (No changes) */}
      <aside className="w-64 border-r border-white/[0.08] flex flex-col justify-between fixed h-full bg-[#000000] z-50">
         {/* ... (Same sidebar content) ... */}
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
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-zinc-300 group-hover:text-white transition-colors">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate uppercase tracking-wider">{user?.position || 'Admin'}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-[#050505] shadow-[-10px_0_10px_#050505]">
                <button onClick={() => setIsProfileModalOpen(true)} className="p-1.5 hover:bg-white/10 hover:text-white rounded-md transition-colors text-zinc-500"><Settings className="w-4 h-4" /></button>
                <button onClick={handleLogout} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors text-zinc-500"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto w-full">
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
                    <Plus className="w-4 h-4" /> Create Post
                 </button>
             )}
          </div>
        </header>

        {loading && blogs.length === 0 ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
        ) : (
            <>
                {activeTab === 'overview' && <Overview blogs={blogs} users={users} />}
                
                {/* Pass Pagination & Search Props */}
                {activeTab === 'blogs' && (
                    <BlogManager 
                        blogs={blogs} 
                        refreshBlogs={() => fetchAllData(page, search)} 
                        currentUser={user}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        search={search}
                        setSearch={setSearch} // Pass setter to allow input logic in sub-component if needed
                    />
                )}
                
                {activeTab === 'users' && <UserManager currentUser={user} />}
            </>
        )}
      </main>

      {/* 3. PROFILE EDIT MODAL */}
      {isProfileModalOpen && (
          <EditProfileModal user={user} onClose={() => setIsProfileModalOpen(false)} onSuccess={handleProfileUpdateSuccess} />
      )}
    </div>
  );
};

// ... EditProfileModal (No Changes) ...
const EditProfileModal = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        position: user?.position || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                onSuccess(response.data.data.user, response.data.data.token);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5 animate-in fade-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                <div className="p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                            <UserCog className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Identity Metamorphosis</h3>
                            <p className="text-zinc-500 text-xs mt-0.5 uppercase tracking-widest">Update Your Credentials</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-400 font-medium ml-1">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500/50 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400 font-medium ml-1">Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">@</span>
                                    <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500/50 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400 font-medium ml-1">Role / Title</label>
                                <input name="position" value={formData.position} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500/50 outline-none" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 text-zinc-600 group-hover:text-black transition-colors" />}
                                {loading ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
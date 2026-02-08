import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, PenTool, Users, LogOut, Plus, 
    Loader2, Settings, UserCog, Save, X, KeyRound, 
    ShieldCheck, Fingerprint, Sparkles, CheckCircle2, Eye, Menu 
} from 'lucide-react'; // Added Menu icon
import { toast } from 'react-toastify';

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
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]); 

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 🛑 1. DETECT DEMO USER
  const isDemo = user?.email === 'exploreAdmin@gmail.com';

  // --- DATA FETCHING ---
  const fetchAllData = useCallback(async (pageNum = 1, searchQuery = "") => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
          setLoading(true);
          
          const blogRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/blog/all-blogs?page=${pageNum}&limit=9&search=${searchQuery}`, 
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          
          if (blogRes.data.success) {
              setBlogs(blogRes.data.data.blogs);
              setTotalPages(blogRes.data.data.totalPages);
              setPage(blogRes.data.data.currentPage);
          }

          if (activeTab === 'overview' || activeTab === 'users') {
             const userRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/all-users`,
                { headers: { 'Authorization': `Bearer ${token}` } }
             );
             if (userRes.data.success) setUsers(userRes.data.data);
          }
      } catch (error) {
          if (error.response?.status === 401) {
              localStorage.clear();
              navigate('/admin/login');
          } else {
              toast.error(error.response?.data?.message || "Access Denied");
          }
      } finally {
          setLoading(false);
      }
  }, [activeTab, navigate]);

  useEffect(() => {
    const init = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) return navigate('/admin/login');
        setUser(JSON.parse(userData));
        await fetchAllData(1, "");
    };
    init();
  }, [navigate, fetchAllData]);

  // Debounced Search
  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
          if (activeTab === 'blogs') fetchAllData(1, search);
      }, 500); 
      return () => clearTimeout(delayDebounceFn);
  }, [search, activeTab, fetchAllData]);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate('/admin/login');
  };

  const handleProfileUpdateSuccess = (updatedUser, newToken) => {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('accessToken', newToken);
      setIsProfileModalOpen(false);
      toast.success("Identity reconfigured successfully.");
  };

  // 🛑 2. INTERCEPT CREATE ACTION
  const handleCreateClick = () => {
      if (isDemo) {
          return toast.info("Create actions are disabled in Demo Mode.");
      }
      navigate('/admin/create-blog');
  };

  // Helper to close menu on mobile selection
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col md:flex-row font-sans selection:bg-white/20 relative">
      
      {/* 🛑 3. DEMO BANNER */}
      {isDemo && (
          <div className="fixed top-0 left-0 right-0 md:left-64 z-[60] bg-indigo-600/95 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold text-center py-1.5 border-b border-white/10 shadow-xl flex items-center justify-center gap-2">
              <Eye className="w-3 h-3" />
              <span className="truncate px-2">DEMO MODE ACTIVE: Read-only access enabled.</span>
          </div>
      )}

      {/* MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#000000] sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-lg tracking-tight">GhostOfWeb</span>
        </div>
        <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white"
        >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#000000] border-r border-white/[0.08] flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen md:flex
      `}>
        <div className="p-4">
          {/* Logo - Hidden on mobile inside sidebar as it's in the top bar */}
          <div className="hidden md:flex items-center gap-3 px-2 py-4 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-lg tracking-tight">GhostOfWeb</span>
          </div>

          <nav className="space-y-1 mt-4 md:mt-0">
            <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} />
            <SidebarItem icon={PenTool} label="Blog Posts" active={activeTab === 'blogs'} onClick={() => handleTabChange('blogs')} />
            <SidebarItem icon={Users} label="Team Members" active={activeTab === 'users'} onClick={() => handleTabChange('users')} />
          </nav>
        </div>

        <div className="p-4 border-t border-white/[0.08] bg-[#050505]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/20 uppercase">
              {user?.username?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-zinc-300 group-hover:text-white transition-colors">
                  {isDemo ? "Demo User" : user?.name}
              </p>
              <p className="text-[10px] text-zinc-500 truncate uppercase tracking-wider">{user?.position || 'Admin'}</p>
            </div>
            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute right-2 bg-[#050505] shadow-[-10px_0_10px_#050505]">
                <button onClick={() => { setIsProfileModalOpen(true); setIsMobileMenuOpen(false); }} className="p-1.5 hover:bg-white/10 hover:text-white rounded-md transition-colors text-zinc-500"><Settings className="w-4 h-4" /></button>
                <button onClick={handleLogout} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors text-zinc-500"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* 🛑 Adjusted margins: ml-0 for mobile, md:ml-0 (since sidebar is now flex item on desktop, we don't need margin if using flex layout, OR maintain fixed sidebar logic) */}
      {/* If keeping sidebar fixed on desktop as per original design, use md:ml-64. But since I switched sidebar to md:static in flex container, we remove margin */}
      {/* Let's stick to the Fixed Sidebar Logic for Desktop to ensure content scrolling doesn't scroll sidebar */}
      
      <main className={`flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto h-screen ${isDemo ? 'pt-14' : ''}`}>
        <header className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-10 border-b border-white/[0.06] pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white capitalize">{activeTab.replace('blogs', 'Content')}</h1>
            <p className="text-xs md:text-sm text-zinc-500 mt-2">
                {activeTab === 'overview' && 'Welcome back, Master. Here is the current state of play.'}
                {activeTab === 'blogs' && 'Forge, edit, and publish your latest stories.'}
                {activeTab === 'users' && 'Manage access levels and team composition.'}
            </p>
          </div>
          {activeTab === 'blogs' && (
             <button 
                onClick={handleCreateClick} 
                className={`w-full md:w-auto bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] ${isDemo ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                <Plus className="w-4 h-4" /> Create Post
             </button>
          )}
        </header>

        {loading && blogs.length === 0 ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
        ) : (
            <>
                {/* 🛑 4. PASS isDemo PROP TO CHILDREN */}
                {activeTab === 'overview' && <Overview blogs={blogs} users={users} currentUser={user} isDemo={isDemo} />}
                {activeTab === 'blogs' && (
                    <BlogManager 
                        blogs={blogs} refreshBlogs={() => fetchAllData(page, search)} 
                        currentUser={user} page={page} totalPages={totalPages}
                        onPageChange={(p) => fetchAllData(p, search)}
                        search={search} setSearch={setSearch}
                        isDemo={isDemo}
                    />
                )}
                {activeTab === 'users' && <UserManager currentUser={user} isDemo={isDemo} />}
            </>
        )}
      </main>

      {isProfileModalOpen && (
          <SecureEditModal 
            user={user} 
            onClose={() => setIsProfileModalOpen(false)} 
            onSuccess={handleProfileUpdateSuccess} 
            isDemo={isDemo} // 🛑 Pass isDemo here
          />
      )}
    </div>
  );
};

// ==========================================
// SECURE PROFILE UPDATE MODAL
// ==========================================
const SecureEditModal = ({ user, onClose, onSuccess, isDemo }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        position: user?.position || '',
        newPassword: '', 
        otp: ''
    });
    
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 1. Request OTP
    const handleRequestOtp = async () => {
        // 🛑 DEMO BLOCKER
        if (isDemo) {
            toast.info("Simulating OTP for Demo Mode: 123456");
            setOtpSent(true);
            return;
        }

        setIsSendingOtp(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/send-current-user-otp`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setOtpSent(true);
                toast.success("Verification code sent to your registered Gmail.");
            }
        } catch (error) {
            toast.error("Code transmission failed.");
        } finally { setIsSendingOtp(false); }
    };

    // 2. Submit Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🛑 DEMO BLOCKER
        if (isDemo) {
            toast.warning("Profile updates are disabled in Demo Mode.");
            return;
        }

        if (!otpSent) return toast.warning("Identity verification required.");
        
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) onSuccess(res.data.data.user, res.data.data.token);
        } catch (error) {
            toast.error(error.response?.data?.message || "Metamorphosis failed.");
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#090909] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 ring-1 ring-white/5 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                
                <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                        <UserCog className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Identity Metamorphosis</h3>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">
                            {isDemo ? "DEMO MODE (READ ONLY)" : "Update Secure Credentials"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* --- Basic Info --- */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-400 font-medium ml-1">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400 font-medium ml-1">Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400 font-medium ml-1">Role / Title</label>
                                <input name="position" value={formData.position} onChange={handleChange} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* --- CHANGE PASSWORD SECTION (Visible) --- */}
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <KeyRound className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Change Password</span>
                        </div>
                        <div className="space-y-1">
                            <input 
                                name="newPassword" 
                                type="password" 
                                placeholder="Enter new password" 
                                onChange={handleChange} 
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-zinc-600 transition-colors focus:border-indigo-500/50" 
                            />
                        </div>
                    </div>

                    {/* --- OTP VERIFICATION --- */}
                    <div className="pt-2 border-t border-white/5 space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Target: {user?.email || "Linked Account"}</label>
                            {otpSent && <span className="text-[10px] text-emerald-500 flex items-center gap-1 animate-in fade-in"><CheckCircle2 className="w-3 h-3"/> Code Sent</span>}
                        </div>
                        
                        <div className="flex gap-2">
                            <input 
                                name="otp" 
                                placeholder="Enter 6-digit Code" 
                                maxLength={6} 
                                disabled={!otpSent} 
                                onChange={handleChange} 
                                className="flex-1 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none disabled:opacity-50 font-mono tracking-widest text-center" 
                            />
                            
                            {!otpSent ? (
                                <button 
                                    type="button" 
                                    onClick={handleRequestOtp} 
                                    disabled={isSendingOtp} 
                                    className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                                >
                                    {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Code"}
                                </button>
                            ) : (
                                <div className="flex items-center justify-center px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-in zoom-in">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !otpSent || !formData.otp} 
                        className={`w-full mt-2 bg-white text-black font-bold py-3.5 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] ${isDemo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />}
                        {loading ? "Verifying & Updating..." : "Confirm Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
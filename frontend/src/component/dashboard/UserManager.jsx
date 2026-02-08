import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Plus, Shield, Briefcase, X, 
    Loader2, CheckCircle2, Sparkles, 
    Trash2, Crown, AlertTriangle, Fingerprint,
    Mail, KeyRound, Lock // Added Lock icon for visual feedback
} from 'lucide-react';
import { toast } from 'react-toastify';

// ✅ Accept currentUser prop
const UserManager = ({ currentUser, isDemo }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals State
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null); 

    // ✅ CHECK: Is the current logged-in user the Master Admin?
    const isMasterAdmin = currentUser?.username === 'ghostofweb';

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/all-users`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to sync team data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const finalizeRemoval = async () => {
        if (!userToRemove) return;
            if (isDemo) { 
             setUserToRemove(null);
             return toast.info("Exiling members is disabled in Demo Mode.");
        }
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/remove-member/${userToRemove._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                toast.success("Member exiled from the circle.");
                fetchUsers();
                setUserToRemove(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Exile failed.");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[50vh]">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        The Inner Circle
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage the architects of this digital realm.</p>
                </div>

                {/* ✅ CONDITION: Only 'ghostofweb' can see the Add Button */}
                {isMasterAdmin && (
                    <button 
                        onClick={() => setIsEnrollModalOpen(true)}
                        className="group relative px-5 py-2.5 bg-white text-black text-sm font-bold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Initiate New Member</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-white to-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                )}
            </div>

            {/* --- USERS GRID --- */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {users.map((u) => {
                        const isTargetMaster = u.username === 'ghostofweb';
                        
                        return (
                            <div key={u._id} className={`group relative border p-6 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${isTargetMaster ? 'bg-gradient-to-b from-[#1a1a00] to-[#0A0A0A] border-yellow-500/30' : 'bg-[#0A0A0A] border-white/5 hover:border-white/20'}`}>
                                {isTargetMaster && <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />}

                                <div className="relative z-10 flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${isTargetMaster ? 'bg-yellow-500 text-black shadow-yellow-500/20' : 'bg-zinc-900 border border-white/10 text-white'}`}>
                                        {isTargetMaster ? <Crown className="w-6 h-6 fill-black" /> : u.username[0].toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`font-bold text-lg truncate ${isTargetMaster ? 'text-yellow-500' : 'text-white'}`}>{u.name}</h4>
                                                <p className="text-xs text-zinc-500 font-mono mb-3">@{u.username}</p>
                                            </div>
                                            
                                            {/* ✅ CONDITION: Only show Trash icon if:
                                                1. Current user IS Master Admin
                                                2. Target user IS NOT Master Admin (Master cannot delete themselves)
                                            */}
                                            {isMasterAdmin && !isTargetMaster ? (
                                                <button 
                                                    onClick={() => setUserToRemove(u)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Exile Member"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                /* Optional: Show Lock icon for others */
                                                <div className="opacity-0 group-hover:opacity-100 p-2 text-zinc-700">
                                                    <Lock className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${isTargetMaster ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-white/5 text-zinc-300 border-white/5'}`}>
                                                {isTargetMaster ? <Crown className="w-3 h-3" /> : <Briefcase className="w-3 h-3 text-zinc-500" />}
                                                {isTargetMaster ? "MASTER ADMIN" : u.position}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- MODALS --- */}
            {isEnrollModalOpen && (
                <EnrollmentRitual 
                    onClose={() => setIsEnrollModalOpen(false)} 
                    onSuccess={() => { fetchUsers(); setIsEnrollModalOpen(false); }} 
                />
            )}

            {userToRemove && (
                <RemoveMemberModal 
                    user={userToRemove}
                    onClose={() => setUserToRemove(null)}
                    onConfirm={finalizeRemoval}
                />
            )}
        </div>
    );
};

// ... (EnrollmentRitual and RemoveMemberModal remain exactly the same as your previous code)
// Keep the EnrollmentRitual and RemoveMemberModal code here...

const EnrollmentRitual = ({ onClose, onSuccess }) => {
    // ... (Your existing code)
    const [step, setStep] = useState('form'); 
    const [formData, setFormData] = useState({ name: '', username: '', position: '', password: '', email: '', otp: '' });
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Step 1: Send OTP to Gmail
    const handleSendOTP = async () => {
        if (!formData.email) return toast.error("Communication link (Email) required.");
        setSendingOtp(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/send-otp`, { email: formData.email });
            if (response.data.success) {
                toast.success("Verification code transmitted to Gmail.");
                setOtpSent(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Transmission failed.");
        } finally { setSendingOtp(false); }
    };

    // Step 2: Register with OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.otp) return toast.error("Identity verification code missing.");
        setStep('forging'); 
        try {
            await new Promise(r => setTimeout(r, 2000));
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, formData);
            if (response.data.success) {
                setStep('success');
                setTimeout(() => { onSuccess(); }, 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed.");
            setStep('form');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                {step === 'form' && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                )}
                <div className="p-8">
                    {step === 'form' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6">
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-3 border border-white/10">
                                    <Fingerprint className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Initiation Protocol</h3>
                                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">Assigning Digital Signature</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-400 font-medium ml-1">Identity Name</label>
                                    <input name="name" required placeholder="John Doe" className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none transition-all placeholder:text-zinc-700" onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-400 font-medium ml-1">Username</label>
                                        <input name="username" required placeholder="johnd" className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none placeholder:text-zinc-700" onChange={handleChange} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-400 font-medium ml-1">Designation</label>
                                        <input name="position" required placeholder="Editor" className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none placeholder:text-zinc-700" onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-400 font-medium ml-1 flex items-center gap-2"><Mail className="w-3 h-3"/> Communication Link</label>
                                    <div className="flex gap-2">
                                        <input name="email" type="email" required placeholder="agent@ghostofweb.com" disabled={otpSent} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none placeholder:text-zinc-700 disabled:opacity-50" onChange={handleChange} />
                                        {!otpSent && (
                                            <button type="button" onClick={handleSendOTP} disabled={sendingOtp || !formData.email} className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border border-white/5 disabled:opacity-50">
                                                {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin"/> : "Get Code"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {otpSent && (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-xs text-emerald-400 font-medium ml-1 flex items-center gap-1"><KeyRound className="w-3 h-3"/> Verification Code</label>
                                        <input name="otp" required placeholder="123456" maxLength={6} className="w-full bg-zinc-900/50 border border-emerald-500/30 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none placeholder:text-zinc-700 tracking-[0.2em] font-mono" onChange={handleChange} />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-400 font-medium ml-1">Secure Key</label>
                                    <input name="password" type="password" required placeholder="••••••••" className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none placeholder:text-zinc-700" onChange={handleChange} />
                                </div>

                                <button type="submit" disabled={!otpSent} className="w-full mt-6 bg-white text-black font-bold py-3.5 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50">
                                    <Sparkles className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                                    {otpSent ? "Grant Access" : "Verify Email First"}
                                </button>
                            </form>
                        </div>
                    )}
                    {step === 'forging' && (
                        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
                            <h3 className="text-lg font-bold text-white">Forging Credentials...</h3>
                        </div>
                    )}
                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                            <h3 className="text-2xl font-bold text-white">Access Granted</h3>
                            <p className="text-zinc-400 text-sm mt-2">Member inducted into the Inner Circle.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RemoveMemberModal = ({ user, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const handleConfirm = async () => { setIsDeleting(true); await onConfirm(); setIsDeleting(false); };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-[#090909] border border-red-900/30 rounded-2xl p-6 shadow-2xl ring-1 ring-red-500/10">
                <div className="flex flex-col items-center text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-5" />
                    <h3 className="text-xl font-bold text-white mb-2">Confirm Exile?</h3>
                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Revoking access for <span className="text-white font-bold">{user.name}</span>. This is permanent.</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={onClose} className="flex-1 bg-zinc-900 text-zinc-300 py-3 rounded-xl text-sm border border-white/5">Cancel</button>
                        <button onClick={handleConfirm} disabled={isDeleting} className="flex-1 bg-red-600 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />} Exile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManager;
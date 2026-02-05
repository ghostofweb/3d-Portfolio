import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Plus, Shield, Briefcase, X, 
    Loader2, CheckCircle2, Sparkles, 
    Trash2, Crown, AlertTriangle, Fingerprint,
    Mail, KeyRound // ✅ Added Icons
} from 'lucide-react';
import { toast } from 'react-toastify';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals State
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null); 

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
            console.error("Failed to fetch team:", error);
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
                <button 
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="group relative px-5 py-2.5 bg-white text-black text-sm font-bold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                >
                    <span className="relative z-10 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Initiate New Member</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-white to-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
            </div>

            {/* --- USERS GRID --- */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {users.map((u) => {
                        const isMaster = u.username === 'ghostofweb';
                        return (
                            <div key={u._id} className={`group relative border p-6 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${isMaster ? 'bg-gradient-to-b from-[#1a1a00] to-[#0A0A0A] border-yellow-500/30' : 'bg-[#0A0A0A] border-white/5 hover:border-white/20'}`}>
                                {isMaster && <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />}

                                <div className="relative z-10 flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${isMaster ? 'bg-yellow-500 text-black shadow-yellow-500/20' : 'bg-zinc-900 border border-white/10 text-white'}`}>
                                        {isMaster ? <Crown className="w-6 h-6 fill-black" /> : u.username[0].toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`font-bold text-lg truncate ${isMaster ? 'text-yellow-500' : 'text-white'}`}>{u.name}</h4>
                                                <p className="text-xs text-zinc-500 font-mono mb-3">@{u.username}</p>
                                            </div>
                                            {!isMaster && (
                                                <button 
                                                    onClick={() => setUserToRemove(u)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Exile Member"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${isMaster ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-white/5 text-zinc-300 border-white/5'}`}>
                                                {isMaster ? <Crown className="w-3 h-3" /> : <Briefcase className="w-3 h-3 text-zinc-500" />}
                                                {isMaster ? "MASTER ADMIN" : u.position}
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

// ==========================================
// 1. THE ENROLLMENT RITUAL (ADD USER - 2 STEPS)
// ==========================================
const EnrollmentRitual = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState('form'); // form | forging | success
    const [formData, setFormData] = useState({ name: '', username: '', position: '', password: '', email: '', otp: '' });
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- STEP 1: SEND OTP ---
    const handleSendOTP = async () => {
        if (!formData.email) return toast.error("Email required for verification.");
        
        setSendingOtp(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/send-otp`, {
                email: formData.email
            });
            
            if (response.data.success) {
                toast.success("Verification code sent to email!");
                setOtpSent(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setSendingOtp(false);
        }
    };

    // --- STEP 2: FINALIZE REGISTRATION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStep('forging'); 

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2s Drama Delay

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/register`, 
                formData
            );

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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                {/* Close Button */}
                {step === 'form' && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                )}

                <div className="p-8">
                    {/* STEP 1: FORM */}
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
                                
                                {/* Full Name */}
                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-400 font-medium ml-1">Identity Name</label>
                                    <input name="name" required placeholder="John Doe" className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none transition-all placeholder:text-zinc-700" onChange={handleChange} />
                                </div>

                                {/* Username & Position */}
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

                                {/* Email & OTP Section */}
                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-400 font-medium ml-1 flex items-center gap-2">
                                        <Mail className="w-3 h-3"/> Communication Link
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            name="email" type="email" required placeholder="agent@ghostofweb.com" 
                                            disabled={otpSent}
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none placeholder:text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                                            onChange={handleChange} 
                                        />
                                        {!otpSent && (
                                            <button 
                                                type="button" 
                                                onClick={handleSendOTP} 
                                                disabled={sendingOtp || !formData.email}
                                                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin"/> : "Get Code"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* OTP Input (Revealed after code sent) */}
                                {otpSent && (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-xs text-emerald-400 font-medium ml-1 flex items-center gap-1">
                                            <KeyRound className="w-3 h-3"/> Verification Code
                                        </label>
                                        <input 
                                            name="otp" required placeholder="123456" maxLength={6}
                                            className="w-full bg-zinc-900/50 border border-emerald-500/30 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none placeholder:text-zinc-700 tracking-[0.2em] font-mono" 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                )}

                                {/* Password */}
                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-400 font-medium ml-1">Secure Key</label>
                                    <input name="password" type="password" required placeholder="••••••••" className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none placeholder:text-zinc-700" onChange={handleChange} />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={!otpSent}
                                    className="w-full mt-6 bg-white text-black font-bold py-3.5 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Sparkles className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                                    {otpSent ? "Grant Access" : "Verify Email First"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 2: FORGING */}
                    {step === 'forging' && (
                        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                <div className="w-20 h-20 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin relative z-10" />
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <Fingerprint className="w-8 h-8 text-white animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Forging Credentials...</h3>
                            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                Writing to Blockchain
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Access Granted</h3>
                            <p className="text-zinc-400 text-sm mt-2 max-w-[200px]">
                                <span className="text-white font-medium">{formData.name}</span> has been inducted into the Inner Circle.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. THE EXILE RITUAL (REMOVE USER)
// ==========================================
const RemoveMemberModal = ({ user, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        await onConfirm();
        setIsDeleting(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative w-full max-w-sm bg-[#090909] border border-red-900/30 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ring-1 ring-red-500/10">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">Confirm Exile?</h3>
                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                        You are about to revoke all access permissions for <span className="text-white font-bold">{user.name}</span>. 
                        Their digital signature will be permanently erased.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={onClose}
                            className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-3 rounded-xl text-sm font-medium transition-colors border border-white/5"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                            {isDeleting ? "Exiling..." : "Exile Member"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManager;
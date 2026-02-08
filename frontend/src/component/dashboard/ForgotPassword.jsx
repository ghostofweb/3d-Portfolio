import { useState } from 'react';
import axios from 'axios';
import { Fingerprint, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Username | 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ username: '', email: '', otp: '', newPassword: '' });

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        
        // 🛑 DEMO CHECK (Client Side)
        if (data.username === 'explorer' || data.username === 'exploreAdmin@gmail.com') {
            toast.info("Demo Admin is immutable. You cannot reset this password.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/forgot-password-otp`, { 
                username: data.username 
            });
            if (res.data.success) {
                toast.success("Verification code sent to registered Gmail.");
                setData({ ...data, email: res.data.data.email });
                setStep(2);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "User not found.");
        } finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password-otp`, {
                email: data.email,
                otp: data.otp,
                newPassword: data.newPassword
            });
            if (res.data.success) {
                toast.success("Security key updated. You may now enter.");
                navigate('/admin/login'); 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed.");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
            
            {/* Background Flair (Subtle) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl ring-1 ring-white/5 relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Card Internal Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <button onClick={() => navigate('/admin/login')} className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-6 md:mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                </button>

                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                        <ShieldCheck className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Security Recovery</h2>
                    <p className="text-zinc-500 text-sm mt-2">Restore access to your digital signature.</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-400 font-medium ml-1">Identity Username</label>
                            <div className="relative group">
                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    required 
                                    placeholder="Enter username" 
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
                                    onChange={(e) => setData({...data, username: e.target.value})}
                                />
                            </div>
                        </div>
                        <button 
                            disabled={loading} 
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Request Verification"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg mb-4">
                            <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest text-center">Target Verified</p>
                            <p className="text-xs text-zinc-300 text-center mt-1 break-all">{data.email}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-zinc-400 font-medium ml-1">OTP Code</label>
                            <input 
                                required 
                                maxLength={6} 
                                placeholder="123456" 
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none font-mono tracking-[0.3em] text-center placeholder:tracking-normal placeholder:font-sans transition-all"
                                onChange={(e) => setData({...data, otp: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-zinc-400 font-medium ml-1">New Security Key</label>
                            <input 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
                                onChange={(e) => setData({...data, newPassword: e.target.value})}
                            />
                        </div>

                        <button 
                            disabled={loading} 
                            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Update Credentials"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
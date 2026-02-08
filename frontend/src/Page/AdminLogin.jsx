import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, Loader2, AlertTriangle, XCircle, Terminal, PartyPopper, Power } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLogin = () => {
    // Hooks
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({ username: 'exploreAdmin@gmail.com', password: 'helloworld123' });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Easter Egg States
    const [activeMode, setActiveMode] = useState('normal'); // normal, matrix, party, retro, barrel, hacked
    const [hackStage, setHackStage] = useState(0); 
    const [virusPopups, setVirusPopups] = useState([]);

    // 🎹 GLOBAL KEY LISTENER
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeMode === 'hacked' && e.key !== 'Escape') return;

            // Universal Reset Key
            if (e.key === 'Escape') {
                resetSystem();
                return;
            }

            // Detect Sequences (Keep last 15 chars)
            // We use a functional update on a "buffer" if we were tracking strict sequence, 
            // but for simplicity in this React model, we rely on the user typing fast enough 
            // or just checking the string. 
            // *Note: Without a ref for the string, key loggers in React useEffects can be tricky.*
            // *Below is a simplified reliable version.*
        };

        // We attach a raw listener to the window to capture the full sequence reliably
        let buffer = "";
        const keyLogger = (e) => {
            if (e.key === 'Escape') {
                resetSystem();
                buffer = "";
                return;
            }
            
            buffer = (buffer + e.key).toLowerCase().slice(-15);

            // 1. CHAOS MODE
            if (buffer.includes('easteregg') && activeMode !== 'hacked') {
                triggerChaos();
                buffer = "";
            }
            // 2. MATRIX MODE
            if (buffer.includes('matrix')) {
                setActiveMode(prev => prev === 'matrix' ? 'normal' : 'matrix');
                toast.info("💊 The Matrix has you...", { theme: 'dark' });
                buffer = "";
            }
            // 3. PARTY MODE
            if (buffer.includes('party')) {
                setActiveMode('party');
                toast.success("🎉 PARTY MODE ACTIVATED", { theme: 'colored' });
                setTimeout(() => setActiveMode('normal'), 8000);
                buffer = "";
            }
            // 4. RETRO MODE
            if (buffer.includes('retro')) {
                setActiveMode(prev => prev === 'retro' ? 'normal' : 'retro');
                buffer = "";
            }
            // 5. BARREL ROLL
            if (buffer.includes('barrel')) {
                setActiveMode('barrel');
                setTimeout(() => setActiveMode('normal'), 1000);
                buffer = "";
            }
        };

        window.addEventListener('keydown', keyLogger);
        return () => window.removeEventListener('keydown', keyLogger);
    }, [activeMode]); // Re-bind if mode changes

    // 🟢 MATRIX RAIN EFFECT
    useEffect(() => {
        if (activeMode !== 'matrix') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        const draw = () => {
            // Semi-transparent black to create fade trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 33);
        return () => clearInterval(interval);
    }, [activeMode]);

    // 💀 CHAOS LOGIC
    const triggerChaos = () => {
        setActiveMode('hacked');
        toast.dismiss();
        
        // Stage 1: Alert (Shake starts)
        setHackStage(1);
        toast.error("⚠️ SYSTEM BREACH DETECTED", { autoClose: false, hideProgressBar: true, theme: "colored" });

        // Stage 2: Virus Popups (1.5s)
        setTimeout(() => {
            setHackStage(2);
            const interval = setInterval(() => {
                setVirusPopups(prev => [...prev, { 
                    id: Date.now(), 
                    top: Math.random() * 80 + 10, 
                    left: Math.random() * 80 + 10,
                    msg: ["CRITICAL ERROR", "TROJAN.WIN32", "DELETING SYSTEM32", "IP LEAKED"][Math.floor(Math.random() * 4)]
                }]);
            }, 300);
            // Stop generating popups after a bit
            setTimeout(() => clearInterval(interval), 3000);
        }, 1500);

        // Stage 3: Terminal (4s)
        setTimeout(() => setHackStage(3), 4000);

        // Stage 4: Rick Roll (6s) - STOP SHAKE HERE
        setTimeout(() => {
            setHackStage(4);
        }, 6000);
    };

    const resetSystem = () => {
        setActiveMode('normal');
        setHackStage(0);
        setVirusPopups([]);
        toast.dismiss();
        toast.info("System Restored");
    };

    // 🚀 FORM LOGIC
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleLogin = async (e) => {
        e.preventDefault();
        if (activeMode === 'hacked') return;

        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, formData);
            if (data.success) {
                localStorage.setItem("accessToken", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));
                toast.success("Welcome back, Master.");
                navigate('/admin/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    // DYNAMIC STYLES
    const getContainerClass = () => {
        // Stop shaking if we are in Stage 4 (Video)
        if (activeMode === 'hacked') {
            return hackStage === 4 ? 'bg-black' : 'bg-red-950/20 shake-screen';
        }
        // Retro needs a light background to show contrast
        if (activeMode === 'retro') return 'grayscale contrast-[1.5] bg-[#e0e0e0] text-black font-mono';
        
        return 'bg-[#050505] text-white';
    };

    return (
        <div className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${getContainerClass()}`}>
            
            {/* --- CUSTOM CSS ANIMATIONS --- */}
            <style>{`
                @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
                .shake-screen { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite; }
                .barrel-roll { animation: roll 1s ease-in-out; }
                @keyframes roll { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .crt-flicker { animation: flicker 0.15s infinite; pointer-events: none; background: rgba(18, 16, 16, 0.1); }
                @keyframes flicker { 0% { opacity: 0.27861; } 5% { opacity: 0.34769; } 10% { opacity: 0.23604; } 15% { opacity: 0.90626; } 20% { opacity: 0.18128; } 25% { opacity: 0.83891; } 30% { opacity: 0.65583; } 35% { opacity: 0.67807; } 40% { opacity: 0.26559; } 45% { opacity: 0.84693; } 50% { opacity: 0.96019; } 55% { opacity: 0.08594; } 60% { opacity: 0.20313; } 65% { opacity: 0.71988; } 70% { opacity: 0.53455; } 75% { opacity: 0.37288; } 80% { opacity: 0.71428; } 85% { opacity: 0.70419; } 90% { opacity: 0.7003; } 95% { opacity: 0.36108; } 100% { opacity: 0.24387; } }
            `}</style>

            {/* --- LAYERS --- */}
            
            {/* 0. Background Layer (Only visible in normal mode) */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${activeMode === 'hacked' || activeMode === 'retro' ? 'opacity-0' : 'opacity-100'}`}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* 1. Matrix Rain Layer (Z-Index 10 to sit ABOVE background) */}
            {activeMode === 'matrix' && <canvas ref={canvasRef} className="absolute inset-0 z-10" />}

            {/* 2. Confetti Layer */}
            {activeMode === 'party' && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                     {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 rounded-full animate-bounce" 
                             style={{
                                 left: `${Math.random() * 100}%`,
                                 top: `${Math.random() * 100}%`,
                                 backgroundColor: ['#ff0', '#f0f', '#0ff', '#0f0'][Math.floor(Math.random() * 4)],
                                 animationDuration: `${Math.random() * 2 + 1}s`
                             }} 
                        />
                     ))}
                </div>
            )}

            {/* 3. Retro CRT Layer */}
            {activeMode === 'retro' && <div className="absolute inset-0 z-50 crt-flicker mix-blend-overlay" />}

            {/* 4. Chaos/Hacked Overlay Layer */}
            {activeMode === 'hacked' && (
                <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
                    {hackStage >= 2 && virusPopups.map((p) => (
                        <div key={p.id} className="absolute bg-[#c0c0c0] border-2 border-white shadow-[8px_8px_0px_rgba(0,0,0,0.5)] w-64 p-1 font-mono text-xs text-black" style={{ top: `${p.top}%`, left: `${p.left}%` }}>
                            <div className="bg-blue-800 text-white px-2 py-1 flex justify-between font-bold"><span>ERROR</span><XCircle className="w-3 h-3"/></div>
                            <div className="p-4 flex flex-col items-center gap-2 bg-[#ececec]">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                                <span className="text-center font-bold">{p.msg}</span>
                            </div>
                        </div>
                    ))}
                    {hackStage >= 3 && (
                        <div className="absolute inset-0 bg-black/95 text-green-500 font-mono p-10 text-sm flex flex-col justify-end z-[60]">
                            <div className="text-red-500 font-bold mt-4 text-xl">{`> DECRYPTING MASTER KEY...`}</div>
                        </div>
                    )}
                </div>
            )}

            {/* 5. Rick Roll Layer */}
            <div className={`absolute inset-0 z-[100] bg-black transition-opacity duration-1000 ${hackStage === 4 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {hackStage === 4 && (
                    <>
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0`} title="Rick Roll" allow="autoplay" />
                        {/* EMERGENCY KILL SWITCH */}
                        <button 
                            onClick={resetSystem}
                            className="absolute top-10 right-10 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 z-[110] animate-bounce"
                        >
                            <Power className="w-6 h-6" />
                            EMERGENCY RESET
                        </button>
                    </>
                )}
            </div>

            {/* 6. MAIN LOGIN CARD */}
            <div className={`relative w-full max-w-[400px] z-20 px-6 transition-all duration-700 ${activeMode === 'barrel' ? 'barrel-roll' : ''} ${activeMode === 'hacked' ? 'blur-[1px]' : ''}`}>
                
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        {/* Glow effect - Hidden in retro mode */}
                        {activeMode !== 'retro' && (
                            <div className={`absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-25 transition duration-1000 ${activeMode === 'matrix' ? 'from-green-500 to-green-900' : 'from-indigo-500 to-blue-600'}`} />
                        )}
                        <div className={`relative w-14 h-14 border rounded-2xl flex items-center justify-center shadow-2xl ${activeMode === 'retro' ? 'bg-white border-black' : 'bg-black border-white/10'}`}>
                            {activeMode === 'party' ? <PartyPopper className="w-6 h-6 text-yellow-400" /> :
                             activeMode === 'matrix' ? <Terminal className="w-6 h-6 text-green-500" /> :
                             <ShieldCheck className={`w-6 h-6 ${activeMode === 'hacked' ? 'text-red-500' : activeMode === 'retro' ? 'text-black' : 'text-white'}`} />}
                        </div>
                    </div>
                    <h1 className={`mt-6 text-2xl font-bold tracking-tight ${activeMode === 'retro' ? 'font-mono text-black' : 'text-white'}`}>
                        {activeMode === 'hacked' ? "SYSTEM FAILURE" : activeMode === 'matrix' ? "THE MATRIX" : "Access Control"}
                    </h1>
                </div>

                {/* Glass Card */}
                <div className={`relative rounded-3xl p-8 shadow-2xl transition-all duration-500 
                    ${activeMode === 'retro' ? 'bg-white border-4 border-black shadow-[8px_8px_0px_black]' : 
                      'bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/5'}`}>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${activeMode === 'retro' ? 'text-black' : 'text-zinc-500'}`}>Admin ID</label>
                            <div className={`relative flex items-center rounded-xl overflow-hidden border transition-all duration-300 
                                ${focusedField === 'username' ? 'scale-[1.02] border-white/30' : 'border-white/10'}
                                ${activeMode === 'retro' ? 'bg-gray-100 border-black' : 'bg-[#111]'}`}>
                                <User className={`w-4 h-4 ml-4 ${activeMode === 'retro' ? 'text-black' : 'text-zinc-500'}`} />
                                <input 
                                    name="username" type="text" required autoComplete="off"
                                    onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField(null)} onChange={handleChange}
                                    className={`w-full bg-transparent border-none py-3.5 pl-3 pr-4 text-sm focus:ring-0 ${activeMode === 'retro' ? 'text-black placeholder:text-gray-500' : 'text-white placeholder:text-zinc-700'}`}
                                    placeholder="Username"
                                    value={formData.username}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${activeMode === 'retro' ? 'text-black' : 'text-zinc-500'}`}>Passcode</label>
                            <div className={`relative flex items-center rounded-xl overflow-hidden border transition-all duration-300 
                                ${focusedField === 'password' ? 'scale-[1.02] border-white/30' : 'border-white/10'}
                                ${activeMode === 'retro' ? 'bg-gray-100 border-black' : 'bg-[#111]'}`}>
                                <Lock className={`w-4 h-4 ml-4 ${activeMode === 'retro' ? 'text-black' : 'text-zinc-500'}`} />
                                <input 
                                    name="password" type="password" required
                                    onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} onChange={handleChange}
                                    value={formData.password}
                                    className={`w-full bg-transparent border-none py-3.5 pl-3 pr-4 text-sm focus:ring-0 ${activeMode === 'retro' ? 'text-black placeholder:text-gray-500' : 'text-white placeholder:text-zinc-700'}`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button 
                            disabled={loading || activeMode === 'hacked'}
                            type="submit"
                            className={`w-full font-bold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] mt-2 flex items-center justify-center gap-2
                                ${activeMode === 'retro' ? 'bg-black text-white hover:bg-gray-800' : 
                                  activeMode === 'hacked' ? 'bg-red-600 text-white cursor-not-allowed' : 
                                  'bg-white text-black hover:bg-zinc-200'}`}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                             activeMode === 'hacked' ? <AlertTriangle className="w-4 h-4 animate-bounce" /> : 
                             <><span>Enter System</span><ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeMode === 'hacked' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <p className={`text-[10px] font-mono uppercase tracking-widest ${activeMode === 'retro' ? 'text-black' : 'text-zinc-500'}`}>
                        {activeMode === 'hacked' ? "CONNECTION LOST" : "SECURE CONNECTION"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
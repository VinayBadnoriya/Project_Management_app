import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LogIn, 
    Mail, 
    Lock, 
    ArrowRight, 
    ShieldCheck, 
    Zap 
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden p-20">
                {/* Clean background - No messy overlaps */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#312e81_0%,_transparent_60%)] opacity-40"></div>
                
                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-indigo-300 text-sm font-bold mb-8 animate-bounce">
                        <Zap size={16} /> Fast, Secure & Reliable
                    </div>
                    <h1 className="text-6xl font-black text-white leading-tight mb-6">
                        Manage Projects <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                            with Confidence.
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed mb-10">
                        The all-in-one professional ERP solution designed for high-performing teams and individuals.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <ShieldCheck className="text-indigo-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">Secure Auth</h3>
                            <p className="text-slate-500 text-sm">Enterprise-grade security for your data.</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <Zap className="text-blue-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">Real-time</h3>
                            <p className="text-slate-500 text-sm">Instant updates across all devices.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                                <LogIn className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-black text-slate-900">Antigravity.</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
                        <p className="text-slate-500 mt-3 text-lg">Enter your details to access your workspace.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-8 animate-in slide-in-from-top duration-300">
                            <p className="text-red-700 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-16 pl-12 pr-6 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
                                    placeholder="name@company.com"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-16 pl-12 pr-6 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full h-16 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-2xl shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                        >
                            Sign In to Dashboard <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="text-center text-slate-500 mt-10 font-medium">
                        New to the platform? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    UserPlus, 
    Mail, 
    Lock, 
    User,
    ArrowRight, 
    ShieldCheck, 
    Rocket,
    Key
} from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        inviteCode: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData.name, formData.email, formData.password, formData.role, formData.inviteCode);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please check your details.');
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden p-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#312e81_0%,_transparent_60%)] opacity-40"></div>
                
                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-indigo-300 text-sm font-bold mb-8 animate-pulse">
                        <Rocket size={16} /> Start Your Journey Today
                    </div>
                    <h1 className="text-6xl font-black text-white leading-tight mb-6">
                        Build Smarter, <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                            Together.
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed mb-10">
                        Join thousands of teams using our platform to streamline their project management workflow.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <ShieldCheck className="text-indigo-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">Global Reach</h3>
                            <p className="text-slate-500 text-sm">Collaborate from anywhere in the world.</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <UserPlus className="text-blue-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">Easy Setup</h3>
                            <p className="text-slate-500 text-sm">Get started in less than 2 minutes.</p>
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
                                <UserPlus className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-black text-slate-900">Project Management</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                        <p className="text-slate-500 mt-3 text-lg">Join our community and start managing projects.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-8">
                            <p className="text-red-700 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full h-14 pl-12 pr-6 bg-white border border-slate-100 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="Your Name"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full h-14 pl-12 pr-6 bg-white border border-slate-100 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="name@company.com"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full h-14 pl-12 pr-6 bg-white border border-slate-100 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="••••••••"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                                <select 
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full h-14 px-4 bg-white border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition-all cursor-pointer shadow-sm text-sm"
                                >
                                    <option value="MEMBER">Member</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invite Code (Optional)</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                    <input 
                                        type="text" 
                                        value={formData.inviteCode} 
                                        onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
                                        className="w-full h-14 pl-10 pr-4 bg-white border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-200 shadow-sm text-sm"
                                        placeholder="EXMPL-123"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-base mt-4"
                        >
                            Create Account <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="text-center text-slate-400 mt-8 text-sm font-medium">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

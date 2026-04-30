import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, Calendar, Edit2, MapPin, Briefcase, Save, X, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        about: user?.about || ''
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile(formData);
            setSaveSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page-transition max-w-4xl mx-auto pb-20">
            <div className="relative mb-8">
                {/* Banner */}
                <div className="h-48 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[2.5rem] shadow-xl shadow-indigo-100"></div>
                
                {/* Avatar Overlay */}
                <div className="absolute -bottom-16 left-10 flex items-end gap-6">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                        <div className="w-full h-full rounded-[2rem] bg-indigo-50 flex items-center justify-center text-4xl font-bold text-indigo-600 border-2 border-indigo-100">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{user?.name}</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            {user?.email} • <span className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest">{user?.role}</span>
                        </p>
                    </div>
                </div>

                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-4 right-8 h-10 px-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                ) : (
                    <div className="absolute bottom-4 right-8 flex gap-2">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-10 px-6 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                        <button 
                            onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email, about: user.about }); }}
                            className="h-10 px-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                        >
                            <X size={16} /> Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="md:col-span-1 space-y-6">
                    <div className="saas-card p-6 rounded-2xl">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identity</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full h-10 px-3 bg-slate-50 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                                {isEditing ? (
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full h-10 px-3 bg-slate-50 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Role</label>
                                <p className="text-sm font-black text-indigo-600 flex items-center gap-2">
                                    <Shield size={14} /> {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="saas-card p-6 rounded-2xl">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Metadata</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Calendar size={16} />
                                <span className="text-xs font-bold">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Briefcase size={16} />
                                <span className="text-xs font-bold">Active Workspace Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: About / Bio */}
                <div className="md:col-span-2 space-y-6">
                    <div className="saas-card p-8 rounded-[2rem] relative overflow-hidden">
                        <AnimatePresence>
                            {saveSuccess && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute top-4 right-8 flex items-center gap-2 text-emerald-600 font-bold text-xs"
                                >
                                    <CheckCircle2 size={14} /> Profile Synchronized
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                            About Me
                            {isEditing && <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest ml-2 px-2 py-0.5 bg-indigo-50 rounded-full">Editing Mode</span>}
                        </h3>
                        
                        {isEditing ? (
                            <textarea 
                                value={formData.about}
                                onChange={(e) => setFormData({...formData, about: e.target.value})}
                                rows={6}
                                placeholder="Tell us about your professional background and interests..."
                                className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all border-none resize-none leading-relaxed"
                            ></textarea>
                        ) : (
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                {user?.about || "This user hasn't added a professional summary yet. Edit your profile to share your background, skills, and current focus areas."}
                            </p>
                        )}
                    </div>

                    <div className="saas-card p-8 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">System Activity</h3>
                        <div className="space-y-6">
                            {[
                                { action: 'Updated profile details', time: 'Just now' },
                                { action: 'Joined "Antigravity ERP" workspace', time: 'Yesterday' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-700">{item.action}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

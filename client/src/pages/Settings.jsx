import React, { useState } from 'react';
import { User, Shield, Bell, Moon, Sun, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        notifications: true,
        darkMode: false
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
        { id: 'preferences', label: 'Preferences', icon: <Bell size={18} /> },
    ];

    return (
        <div className="page-transition max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Configure your workspace and account preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <div className="saas-card p-8 rounded-[2rem]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div 
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div 
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••"
                                                className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••"
                                                className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'preferences' && (
                                <motion.div 
                                    key="preferences"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                                <Bell size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                                                <p className="text-xs text-slate-500">Receive weekly activity summaries</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setFormData({...formData, notifications: !formData.notifications})}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.notifications ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notifications ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-50 cursor-not-allowed">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                                                <Moon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Dark Mode (Coming Soon)</p>
                                                <p className="text-xs text-slate-500">Enable dark theme for the interface</p>
                                            </div>
                                        </div>
                                        <button className="w-12 h-6 rounded-full bg-slate-200 relative">
                                            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="h-12 px-8 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? 'Saving Changes...' : 'Save Settings'}
                            </button>

                            {saveSuccess && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
                                >
                                    <CheckCircle2 size={18} />
                                    Successfully saved!
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Loader2 = ({ size, className }) => <Shield size={size} className={className} />;

export default Settings;

import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search tasks, projects..." 
                        onFocus={() => navigate('/search')}
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => navigate('/notifications')}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <button 
                    onClick={() => navigate('/settings')}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                    <Settings size={20} />
                </button>

                <div className="w-px h-6 bg-slate-100 mx-2"></div>

                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200">
                            {user?.name?.charAt(0)}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-slate-50">
                                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                                <button 
                                    onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <User size={16} /> My Profile
                                </button>
                                <button 
                                    onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <Settings size={16} /> Account Settings
                                </button>
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, MessageSquare, UserPlus, AlertTriangle, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastMsg.trim()) return;
        setSending(true);
        try {
            await api.post('/notifications/broadcast', { 
                message: broadcastMsg,
                type: 'BROADCAST'
            });
            setBroadcastMsg('');
            fetchNotifications();
        } catch (err) {
            console.error('Failed to broadcast:', err);
        } finally {
            setSending(false);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark read:', err);
        }
    };

    const markAllRead = async () => {
        // Assuming backend has a bulk mark-read or we do it sequentially
        try {
            const unread = notifications.filter(n => !n.isRead);
            await Promise.all(unread.map(n => api.patch(`/notifications/${n._id}/read`)));
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all read:', err);
        }
    };

    const getIcon = (type) => {
        switch(type?.toUpperCase()) {
            case 'TASK': return <Bell size={18} className="text-indigo-600" />;
            case 'COMMENT': return <MessageSquare size={18} className="text-blue-600" />;
            case 'ALERT': return <AlertTriangle size={18} className="text-amber-600" />;
            case 'INVITE': return <UserPlus size={18} className="text-emerald-600" />;
            case 'BROADCAST': return <Send size={18} className="text-indigo-600" />;
            default: return <Bell size={18} className="text-slate-400" />;
        }
    };

    return (
        <div className="page-transition max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Stay updated with your latest team activity.</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button 
                        onClick={markAllRead}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Check size={16} /> Mark all as read
                    </button>
                )}
            </header>

            {user?.role === 'ADMIN' && (
                <div className="saas-card p-6 rounded-3xl mb-8 bg-indigo-600 shadow-xl shadow-indigo-600/20 border-none">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Send size={18} /> Broadcast System Update
                    </h3>
                    <form onSubmit={handleBroadcast} className="flex gap-3">
                        <input 
                            type="text" 
                            value={broadcastMsg}
                            onChange={(e) => setBroadcastMsg(e.target.value)}
                            placeholder="Type a message for everyone..."
                            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white placeholder:text-indigo-200 focus:outline-none focus:bg-white/20 transition-all font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={sending || !broadcastMsg.trim()}
                            className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 active:scale-95"
                        >
                            {sending ? 'Sending...' : 'Broadcast'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <Loader2 size={32} className="animate-spin mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Fetching updates...</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <motion.div 
                                    key={notif._id || notif.id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`saas-card p-4 rounded-2xl flex items-center gap-4 group transition-all cursor-default ${!notif.isRead ? 'border-l-4 border-l-indigo-600' : 'border-slate-100 opacity-75'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!notif.isRead ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm tracking-tight ${!notif.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock size={12} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                            </span>
                                        </div>
                                    </div>
                                    {!notif.isRead && (
                                        <button 
                                            onClick={() => markAsRead(notif._id)}
                                            className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Mark as read"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                                <Bell size={48} className="mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-widest">No notifications yet</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Notifications;

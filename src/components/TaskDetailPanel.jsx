import React, { useState, useEffect } from 'react';
import { 
    X, 
    Calendar, 
    User, 
    MessageCircle, 
    History,
    Send,
    CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskDetailPanel = ({ task, onClose, onUpdate }) => {
    const [comments, setComments] = useState([]);
    const [activity, setActivity] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (task) {
            fetchData();
        }
    }, [task]);

    const fetchData = async () => {
        try {
            const [commentsRes, activityRes] = await Promise.all([
                api.get(`/tasks/${task._id}/comments`),
                api.get(`/tasks/${task._id}/activity`)
            ]);
            setComments(commentsRes.data);
            setActivity(activityRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data } = await api.post(`/tasks/${task._id}/comments`, { content: newComment });
            setComments([ { ...data, userId: user }, ...comments]);
            setNewComment('');
            fetchData(); // Refresh activity too
        } catch (err) {
            console.error(err);
        }
    };

    if (!task) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
                <h2 className="text-xl font-bold text-slate-900">Task Details</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Title & Description */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{task.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{task.description || 'No description provided.'}</p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={12} /> Assigned To
                        </label>
                        <p className="text-sm font-semibold text-slate-800">{task.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={12} /> Due Date
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={12} /> Status
                        </label>
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase">
                            {task.status}
                        </span>
                    </div>
                </div>

                {/* Tabs for Comments and Activity */}
                <div className="space-y-6">
                    <div className="flex border-b border-slate-100">
                        <button className="px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 text-sm font-bold flex items-center gap-2">
                            <MessageCircle size={16} /> Comments
                        </button>
                        <button className="px-4 py-2 text-slate-400 text-sm font-medium flex items-center gap-2">
                            <History size={16} /> Activity
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.map((c) => (
                            <div key={c._id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold shrink-0">
                                    {c.userId?.name?.charAt(0)}
                                </div>
                                <div className="flex-1 bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-slate-800">{c.userId?.name}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{c.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Comment Input */}
                        <form onSubmit={handleCommentSubmit} className="relative mt-6">
                            <input 
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type a comment..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPanel;

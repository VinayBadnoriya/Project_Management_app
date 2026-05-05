import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    Plus, 
    Trash2,
    Settings,
    Star,
    X,
    Copy,
    Check,
    AlertCircle,
    Loader2,
    Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const InviteModal = ({ isOpen, onClose, projects }) => {
    const [selectedProject, setSelectedProject] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // Initialize selected project if only one exists
    useEffect(() => {
        if (projects.length === 1) {
            setSelectedProject(projects[0]._id);
        }
    }, [projects]);

    const generateCode = async () => {
        if (!selectedProject) {
            setError('Please select a workspace first');
            return;
        }
        setIsGenerating(true);
        setError('');
        try {
            const res = await api.post(`/projects/${selectedProject}/invite-code`);
            const data = res.data.data || res.data;
            setInviteCode(data.code);
        } catch (err) {
            console.error('Failed to generate code:', err);
            setError(err.response?.data?.message || 'Server error. Failed to generate code.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] w-full max-w-md relative z-10 overflow-hidden shadow-2xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Invite to Project</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Workspace</label>
                        <select 
                            value={selectedProject}
                            onChange={(e) => { setSelectedProject(e.target.value); setError(''); }}
                            className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                        >
                            <option value="">Choose a project...</option>
                            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                        </select>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-red-100">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    {!inviteCode ? (
                        <button 
                            onClick={generateCode}
                            disabled={!selectedProject || isGenerating}
                            className="w-full h-12 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                            Generate Invite Code
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 flex flex-col items-center gap-4">
                                <span className="text-3xl font-black text-indigo-600 tracking-widest">{inviteCode}</span>
                                <button 
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied to Clipboard!' : 'Copy Invite Code'}
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Code expires in 7 days</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const RemoveModal = ({ isOpen, onClose, onConfirm, memberName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] w-full max-w-sm relative z-10 p-8 shadow-2xl text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Member?</h3>
                <p className="text-sm text-slate-500 mb-8 font-medium">Are you sure you want to remove <span className="font-bold text-slate-900">{memberName}</span> from this project? This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onConfirm} className="flex-1 h-12 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">Remove</button>
                    <button onClick={onClose} className="flex-1 h-12 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">Cancel</button>
                </div>
            </motion.div>
        </div>
    );
};

const Team = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [removeTarget, setRemoveTarget] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            const data = res.data.data || res.data;
            if (Array.isArray(data)) {
                setProjects(data);
                if (data.length > 0) {
                    setSelectedProject(data[0]);
                    fetchMembers(data[0]._id);
                }
            } else {
                setProjects([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (projectId) => {
        setLoading(true);
        try {
            const res = await api.get(`/projects/${projectId}/members`);
            const data = res.data.data || res.data;
            setMembers(data);
        } catch (err) {
            console.error('Failed to fetch members:', err);
            // Fallback for safety
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!removeTarget || !selectedProject) return;
        try {
            await api.delete(`/projects/${selectedProject._id}/members/${removeTarget._id}`);
            setMembers(members.filter(m => m._id !== removeTarget._id));
            setRemoveTarget(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove member');
            setRemoveTarget(null);
        }
    };

    return (
        <div className="page-transition max-w-7xl mx-auto pb-20">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Matrix</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Control access and personnel deployment.</p>
                </div>
                {user?.role === 'ADMIN' && (
                    <button 
                        onClick={() => setIsInviteOpen(true)}
                        className="h-12 px-6 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                    >
                        <Plus size={18} /> Invite Team Member
                    </button>
                )}
            </header>

            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Active Workspace:</span>
                <div className="flex gap-2">
                    {projects.map(p => (
                        <button 
                            key={p._id}
                            onClick={() => { setSelectedProject(p); fetchMembers(p._id); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                                selectedProject?._id === p._id 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                                : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                            }`}
                        >
                            {p.title}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 size={32} className="text-indigo-600 animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning Personnel records...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {members.length > 0 ? members.map((member) => (
                            <motion.div 
                                key={member._id || member.memberId} 
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="saas-card p-6 rounded-[2rem] flex flex-col relative group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700 shadow-sm overflow-hidden">
                                        {member.avatar ? <img src={member.avatar} alt="" className="w-full h-full object-cover" /> : member.name?.charAt(0)}
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                                        member.role === 'ADMIN' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}>
                                        <Shield size={12} />
                                        {member.role}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        {member.name}
                                        {member.role === 'ADMIN' && <Star size={16} className="text-amber-400 fill-amber-400" />}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">{member.email}</p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                                    <div className="flex gap-4">
                                        {user?.role === 'ADMIN' && member._id !== user._id && (
                                            <button 
                                                onClick={() => setRemoveTarget(member)}
                                                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} /> Remove Member
                                            </button>
                                        )}
                                        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
                                            <Settings size={16} /> Permissions
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                <Users size={40} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No members found in this workspace</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <InviteModal 
                isOpen={isInviteOpen} 
                onClose={() => setIsInviteOpen(false)} 
                projects={projects} 
            />

            <RemoveModal 
                isOpen={!!removeTarget} 
                onClose={() => setRemoveTarget(null)} 
                onConfirm={handleRemove}
                memberName={removeTarget?.name}
            />
        </div>
    );
};

export default Team;

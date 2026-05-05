import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    MoreHorizontal, 
    Loader2,
    Calendar,
    Filter,
    Circle,
    CheckCircle2,
    X,
    Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ isOpen, onClose, onSave, projects }) => {
    const [formData, setFormData] = useState({
        title: '',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl"
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Mission Task</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Task Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Refactor Auth Middleware"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                                <select 
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                                >
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project</label>
                                <select 
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                                    className="w-full h-12 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-100 focus:outline-none transition-all"
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-3">
                        <button 
                            onClick={() => onSave(formData)}
                            className="flex-1 h-12 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Create Task
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-6 h-12 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, [filterStatus, filterPriority]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterStatus !== 'ALL') params.status = filterStatus;
            if (filterPriority !== 'ALL') params.priority = filterPriority;
            
            const res = await api.get('/tasks', { params });
            setTasks(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
    };

    const handleCreateTask = async (data) => {
        try {
            await api.post('/tasks', data);
            setIsModalOpen(false);
            fetchTasks();
        } catch (err) {
            console.error('Failed to create task:', err);
            alert('Failed to create task. Check console.');
        }
    };

    const columns = [
        { id: 'TODO', label: 'Todo', icon: <Circle size={14} className="text-slate-400" /> },
        { id: 'IN_PROGRESS', label: 'In Progress', icon: <Loader2 size={14} className="text-amber-500 animate-spin" /> },
        { id: 'DONE', label: 'Completed', icon: <CheckCircle2 size={14} className="text-emerald-500" /> },
    ];

    const getPriorityStyles = (p) => {
        switch(p?.toUpperCase()) {
            case 'HIGH': return 'bg-red-50 text-red-600 border-red-100';
            case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="page-transition max-w-[1400px] mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage your work and team velocity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`h-10 px-4 border rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${
                                isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Filter size={14} /> Filter
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 p-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Priority</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                                                    <button 
                                                        key={p}
                                                        onClick={() => { setFilterPriority(p); setIsFilterOpen(false); }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                            filterPriority === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="h-10 px-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                    >
                        <Plus size={16} /> New Task
                    </button>
                </div>
            </header>

            {/* Kanban Matrix */}
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                {columns.map(col => (
                    <div key={col.id} className="flex-1 min-w-[320px] max-w-[400px]">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2.5">
                                {col.icon}
                                <span className="text-sm font-bold text-slate-900">{col.label}</span>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-h-[500px]">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                                    <Loader2 className="animate-spin mb-2" size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Syncing...</span>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {tasks.filter(t => t.status === col.id).map(task => (
                                        <motion.div 
                                            key={task._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="saas-card p-4 rounded-xl cursor-default group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getPriorityStyles(task.priority)}`}>
                                                    {task.priority || 'Low'}
                                                </div>
                                                <button className="p-1 text-slate-300 hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal size={14} />
                                                </button>
                                            </div>
                                            
                                            <h4 className="text-[13px] font-bold text-slate-900 mb-6 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                                                {task.title}
                                            </h4>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
                                                    </div>
                                                </div>
                                                <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black shadow-sm">
                                                    {task.assignedTo?.name?.charAt(0) || '?'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                            
                            {!loading && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-3 border border-dashed border-slate-200 rounded-xl text-slate-400 text-[11px] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <Plus size={14} /> Add Task
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                <TaskModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleCreateTask}
                    projects={projects}
                />
            </AnimatePresence>
        </div>
    );
};

export default Tasks;

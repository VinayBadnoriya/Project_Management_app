import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import TaskDetailPanel from '../components/TaskDetailPanel';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    Settings, 
    Filter, 
    Search,
    Plus,
    ChevronLeft,
    ArrowUpRight,
    Zap,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [projectMembers, setProjectMembers] = useState([
        { id: 1, name: 'John Doe', role: 'ADMIN', initial: 'J' },
        { id: 2, name: 'Alice Smith', role: 'MEMBER', initial: 'A' }
    ]);

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const [projRes, tasksRes] = await Promise.all([
                api.get('/projects'), 
                api.get(`/tasks?projectId=${id}`)
            ]);
            
            const projectsArray = projRes.data.data || projRes.data;
            const currentProj = projectsArray.find(p => p._id === id);
            setProject(currentProj);
            setTasks(tasksRes.data.data || tasksRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const assignMember = (name) => {
        const newMember = { id: Date.now(), name, role: 'MEMBER', initial: name.charAt(0) };
        setProjectMembers([...projectMembers, newMember]);
        setIsMemberModalOpen(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Workspace...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white relative">
            {/* Background Accent */}
            <div className="fixed top-0 right-0 w-[40%] h-screen bg-slate-50/50 -z-10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Header - Premium Fusion */}
            <div className="p-12 border-b border-slate-50 bg-white/50 backdrop-blur-2xl sticky top-0 z-30">
                <div className="max-w-7xl mx-auto">
                    <button 
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-6 transition-colors group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Workspaces
                    </button>

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{project?.title}</h1>
                                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20">
                                    {project?.status}
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium max-w-4xl text-base leading-relaxed">{project?.description}</p>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Project Assets</p>
                                    <div className="flex -space-x-2">
                                        {projectMembers.map(m => (
                                            <div key={m.id} title={m.name} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                                                {m.initial}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {user?.role === 'ADMIN' && (
                                    <button 
                                        onClick={() => setIsMemberModalOpen(true)}
                                        className="h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all active:scale-95 group"
                                    >
                                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                                        Assign Team
                                    </button>
                                )}

                                <button 
                                    onClick={() => navigate('/settings')}
                                    className="w-12 h-12 border-2 border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all text-slate-400"
                                >
                                    <Settings size={20} />
                                </button>
                            </div>
                            
                            {user?.role === 'ADMIN' && (
                                <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    <Zap size={14} className="text-indigo-600 fill-indigo-600" /> Administrative Access Active
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Filter objective matrix..." 
                                    className="pl-11 pr-6 h-12 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-600 transition-all w-full md:w-72"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-5 h-12 text-slate-500 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 border-transparent hover:border-slate-100">
                                <Filter size={16} /> Board View
                            </button>
                        </div>
                        <button 
                            onClick={() => setIsCreateTaskOpen(true)}
                            className="w-full md:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                        >
                            <Plus size={20} /> New Objective
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Task Modal */}
            {isCreateTaskOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsCreateTaskOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Objective</h2>
                            <button onClick={() => setIsCreateTaskOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                                <input type="text" className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all" placeholder="Enter objective title..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea className="w-full h-32 p-6 bg-slate-50 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all resize-none" placeholder="Details..."></textarea>
                            </div>
                            <button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Create Objective</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Member Modal */}
            {isMemberModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsMemberModalOpen(false)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-md relative z-10 p-12 shadow-2xl animate-in zoom-in duration-300 border border-slate-100">
                        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Deploy Team</h2>
                        <p className="text-slate-500 font-medium mb-10 text-lg">Select personnel to assign to this workspace.</p>
                        
                        <div className="space-y-4 mb-12">
                            {['Sarah Connor', 'Bob Wilson', 'Mark Ruffalo'].map(name => (
                                <button 
                                    key={name}
                                    onClick={() => assignMember(name)}
                                    className="w-full p-6 bg-slate-50 hover:bg-slate-950 group rounded-[2rem] flex items-center justify-between transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-indigo-600 shadow-sm group-hover:scale-90 transition-transform">{name.charAt(0)}</div>
                                        <span className="font-bold text-slate-900 group-hover:text-white transition-colors">{name}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all">
                                        <Plus size={18} />
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => setIsMemberModalOpen(false)}
                            className="w-full text-sm font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Board Section */}
            <div className="max-w-7xl mx-auto py-8 px-6">
                <KanbanBoard 
                    projectId={id} 
                    tasks={tasks} 
                    setTasks={setTasks}
                    onTaskClick={(task) => setSelectedTask(task)} 
                />
            </div>

            {selectedTask && (
                <TaskDetailPanel 
                    task={selectedTask} 
                    isOpen={!!selectedTask} 
                    onClose={() => setSelectedTask(null)} 
                />
            )}
        </div>
    );
};

export default ProjectDetail;

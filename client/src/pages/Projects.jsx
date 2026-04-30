import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
    Plus, 
    Layers,
    Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data.data || res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="page-transition max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Directory</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage and track all organizational workspaces.</p>
                </div>
                <div className="flex items-center gap-3">
                    {user?.role === 'ADMIN' && (
                        <button 
                            onClick={() => navigate('/projects/new')}
                            className="h-10 px-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                        >
                            <Plus size={16} /> New Project
                        </button>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4 text-slate-300">
                    <div className="w-8 h-8 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest">Loading Directory...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <motion.div 
                            key={project._id} 
                            whileHover={{ y: -4 }}
                            onClick={() => navigate(`/projects/${project._id}`)}
                            className="saas-card p-6 rounded-2xl cursor-pointer flex flex-col group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Layers size={20} />
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                    project.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    project.status === 'active' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                    'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {project.status}
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-8 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="mt-auto space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                    <span className="text-xs font-bold text-slate-900">{project.progress || 0}%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${
                                            project.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                                        }`}
                                        style={{ width: `${project.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                                <div className="flex items-center -space-x-1.5">
                                    {project.members?.slice(0, 3).map((member, i) => (
                                        <div key={i} className="w-7 h-7 rounded-lg border-2 border-white bg-indigo-50 text-indigo-600 flex items-center justify-center text-[9px] font-black shadow-sm">
                                            {member.name?.charAt(0)}
                                        </div>
                                    ))}
                                    {project.members?.length > 3 && (
                                        <div className="w-7 h-7 rounded-lg border-2 border-white bg-slate-100 text-slate-400 flex items-center justify-center text-[8px] font-bold">
                                            +{project.members.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                    <Calendar size={12} />
                                    <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;

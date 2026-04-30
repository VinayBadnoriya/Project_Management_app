import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Briefcase, 
    AlignLeft, 
    Calendar, 
    Save, 
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';

const CreateProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'planned'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/projects', formData);
            navigate('/projects');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-bold text-sm"
            >
                <ArrowLeft size={18} /> Back to Projects
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-10 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Briefcase size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Create New Project</h1>
                    </div>
                    <p className="text-slate-400 font-medium">Define a new workspace and start organizing your team's tasks.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Project Title */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Website Redesign 2024"
                                    className="w-full h-16 pl-12 pr-6 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <div className="relative group">
                                <AlignLeft className="absolute left-4 top-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <textarea 
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe the project goals and scope..."
                                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Status Selection */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="planned">Planned</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="space-y-2 col-span-2 md:col-span-1 flex items-end">
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 w-full">
                                <CheckCircle2 className="text-indigo-600" size={20} />
                                <span className="text-sm text-indigo-700 font-bold">Only Admins can create projects.</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? 'Creating...' : <><Save size={20} /> Deploy Project</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;

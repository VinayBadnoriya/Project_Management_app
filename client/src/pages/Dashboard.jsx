import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
    Activity,
    Layers,
    Target,
    Users,
    TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, statsRes, activityRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/dashboard/stats'),
                    api.get('/notifications')
                ]);
                setProjects(projRes.data.data || projRes.data);
                setDashboardData(statsRes.data.data || statsRes.data);
                setActivities((activityRes.data.data || activityRes.data).slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (!user) return null;

    const stats = [
        { label: 'Total Projects', value: dashboardData?.totalProjects || 0, icon: <Layers size={20} />, trend: '+2 this month' },
        { label: 'Active Tasks', value: dashboardData?.activeTasks || 0, icon: <Activity size={20} />, trend: `${dashboardData?.completedTasks || 0} completed` },
        { label: 'Team Velocity', value: dashboardData?.velocity || '0%', icon: <Target size={20} />, trend: 'Optimal' },
        { label: 'Active Users', value: dashboardData?.activeUsers || 1, icon: <Users size={20} />, trend: 'Live' }
    ];

    return (
        <div className="page-transition max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Welcome back, {user.name.split(' ')[0]}.</p>
                </div>
            </header>

            {/* Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="saas-card p-5 rounded-2xl group cursor-default">
                        <div className="flex justify-between items-start mb-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Progress Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="saas-card p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Projects</h2>
                            <button onClick={() => navigate('/projects')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
                        </div>
                        <div className="space-y-6">
                            {projects.slice(0, 3).map((project) => (
                                <div key={project._id} className="group cursor-pointer">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-slate-800">{project.title}</span>
                                        <span className="text-xs font-bold text-slate-400">{(project.progress || 0)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${project.progress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="saas-card p-6 rounded-2xl">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {activities.length > 0 ? activities.map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-3 group">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full ${
                                        activity.type === 'SUCCESS' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' :
                                        activity.type === 'ALERT' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">{activity.message}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-4">No recent activity detected</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="saas-card p-6 rounded-2xl bg-slate-900 text-white border-none shadow-xl h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp size={18} className="text-indigo-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Health</h3>
                        </div>
                        
                        <div className="space-y-8">
                            {[
                                { label: 'Uptime', val: 99.9, color: 'bg-indigo-500' },
                                { label: 'Cloud', val: 74, color: 'bg-emerald-500' },
                                { label: 'Sync', val: 88, color: 'bg-blue-500' }
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                        <span className="text-xs font-bold">{stat.val}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">
                                "System performance is currently trending 12% above average."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

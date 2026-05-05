import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Briefcase, 
    CheckSquare, 
    Users, 
    PlusCircle,
    Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const menuItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/' },
        { label: 'Projects', icon: <Briefcase size={22} />, path: '/projects' },
        { label: 'Tasks', icon: <CheckSquare size={22} />, path: '/tasks' },
        { label: 'Team', icon: <Users size={22} />, path: '/team' },
    ];

    return (
        <aside className="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-8 z-50">
            {/* Brand Icon */}
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-10 shadow-lg shadow-indigo-200">
                <CheckSquare size={20} strokeWidth={3} />
            </div>

            {/* Quick Action */}
            {user?.role === 'ADMIN' && (
                <NavLink 
                    to="/projects/new"
                    className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-10 hover:bg-black transition-all hover:scale-110"
                    title="New Project"
                >
                    <PlusCircle size={20} />
                </NavLink>
            )}

            {/* Navigation Icons */}
            <nav className="flex-1 flex flex-col gap-6">
                {menuItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        title={item.label}
                        className={({ isActive }) => `
                            w-12 h-12 flex items-center justify-center rounded-xl transition-all
                            ${isActive 
                                ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
                        `}
                    >
                        {item.icon}
                    </NavLink>
                ))}
            </nav>

            {/* Search Trigger (Mobile/Quick) */}
            <NavLink 
                to="/search"
                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="Global Search"
            >
                <Search size={22} />
            </NavLink>
        </aside>
    );
};

export default Sidebar;

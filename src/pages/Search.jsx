import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, ArrowRight, Loader2, FileText, Layout, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ projects: [], tasks: [], users: [] });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                performSearch();
            } else {
                setResults({ projects: [], tasks: [], users: [] });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/search?q=${query}`);
            setResults(res.data.data || res.data);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderResultSection = (title, items, icon, pathPrefix) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">{title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item) => (
                        <button
                            key={item._id}
                            onClick={() => navigate(`${pathPrefix}/${item._id}`)}
                            className="saas-card p-4 rounded-2xl flex items-center justify-between group text-left transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    {icon}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{item.title || item.name}</p>
                                    <p className="text-[10px] font-medium text-slate-400 truncate max-w-[200px]">
                                        {item.description || item.email || 'Quick access'}
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="page-transition max-w-5xl mx-auto">
            <div className="mb-12">
                <div className="relative group">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Search for anything..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full h-20 pl-16 pr-8 bg-white border-2 border-slate-100 rounded-[2rem] text-xl font-bold focus:border-indigo-600 focus:outline-none shadow-2xl shadow-slate-100 transition-all"
                    />
                    {loading && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin" size={20} />}
                </div>
            </div>

            <div className="space-y-10">
                {query.trim() === '' ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                        <SearchIcon size={48} className="mb-4 opacity-10" />
                        <p className="text-sm font-bold uppercase tracking-widest">Type to begin searching</p>
                    </div>
                ) : (
                    <>
                        {renderResultSection('Projects', results.projects, <Layout size={20} />, '/projects')}
                        {renderResultSection('Tasks', results.tasks, <FileText size={20} />, '/tasks')}
                        {renderResultSection('Team', results.users, <Users size={20} />, '/team')}

                        {!loading && results.projects?.length === 0 && results.tasks?.length === 0 && results.users?.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                                <p className="text-sm font-bold uppercase tracking-widest">No results found for "{query}"</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;

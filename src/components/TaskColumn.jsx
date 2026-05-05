import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
    SortableContext, 
    verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { MoreHorizontal, Plus } from 'lucide-react';

const TaskColumn = ({ id, title, tasks, onTaskClick }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col w-full min-w-[300px] h-full bg-slate-100/50 rounded-3xl p-4 border border-slate-200/50">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 transition-colors">
                        <Plus size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-1 min-h-[200px]">
                <SortableContext 
                    id={id}
                    items={tasks.map(t => t._id)} 
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <TaskCard key={task._id} task={task} onClick={onTaskClick} />
                    ))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-xs text-slate-400">No tasks here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskColumn;

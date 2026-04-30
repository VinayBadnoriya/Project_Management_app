import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    Clock, 
    MessageSquare, 
    MoreHorizontal, 
    User as UserIcon,
    AlertCircle
} from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600 bg-red-50';
            case 'MEDIUM': return 'text-amber-600 bg-amber-50';
            case 'LOW': return 'text-green-600 bg-green-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            onClick={() => onClick(task)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group mb-3"
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {task.title}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                {task.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                    {task.dueDate && (
                        <div className={`flex items-center gap-1.5 text-[10px] font-medium ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                            {isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />}
                            {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <MessageSquare size={12} />
                        3
                    </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
                    <UserIcon size={12} />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;

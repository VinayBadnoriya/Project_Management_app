import React, { useState } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const KanbanBoard = ({ tasks, setTasks, onTaskClick }) => {
    const [activeId, setActiveId] = useState(null);
    const { user } = useAuth();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = [
        { id: 'TODO', title: 'To Do' },
        { id: 'IN_PROGRESS', title: 'In Progress' },
        { id: 'DONE', title: 'Done' }
    ];

    const findContainer = (id) => {
        if (columns.find(c => c.id === id)) return id;
        const task = tasks.find(t => t._id === id);
        return task ? task.status : null;
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const task = tasks.find(t => t._id === active.id);
        
        // RBAC Check: Member can only drag assigned tasks
        if (user.role === 'MEMBER') {
            if (task.assignedTo?._id !== user._id && task.assignedTo !== user._id) {
                // We don't prevent start because dnd-kit is tricky, 
                // but we will prevent the move in handleDragEnd
            }
        }
        
        setActiveId(active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setTasks(prev => {
            return prev.map(t => {
                if (t._id === active.id) {
                    return { ...t, status: overContainer };
                }
                return t;
            });
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const task = tasks.find(t => t._id === active.id);
        const overContainer = findContainer(over.id);

        // RBAC Enforcement on Frontend
        if (user.role === 'MEMBER') {
            const isAssigned = task.assignedTo?._id === user._id || task.assignedTo === user._id;
            if (!isAssigned) {
                // Revert UI if not authorized
                alert('You can only move tasks assigned to you');
                window.location.reload(); // Simple revert for now
                return;
            }
        }

        try {
            await api.patch(`/tasks/${active.id}/status`, { status: overContainer });
        } catch (err) {
            console.error('Failed to update status', err);
            // Optional: Revert UI state
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 h-[calc(100vh-250px)] overflow-x-auto pb-4">
                {columns.map((col) => (
                    <TaskColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={tasks.filter(t => t.status === col.id)}
                        onTaskClick={onTaskClick}
                    />
                ))}
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.5',
                        },
                    },
                }),
            }}>
                {activeId ? (
                    <TaskCard 
                        task={tasks.find(t => t._id === activeId)} 
                        onClick={() => {}} 
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;

const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const AppError = require('../utils/AppError');

const logActivity = async (userId, action, targetId, targetType = 'Task') => {
    await ActivityLog.create({ userId, action, targetId, targetType });
};

exports.createTask = async (taskData, userId) => {
    const task = await Task.create({
        ...taskData,
        createdBy: userId
    });
    await logActivity(userId, 'CREATED_TASK', task._id);
    return task;
};

exports.getTasks = async (filters = {}, user) => {
    const ProjectMember = require('../models/ProjectMember');
    
    // If no specific projectId filter is provided, get all projects for the user
    if (!filters.projectId) {
        const memberships = await ProjectMember.find({ userId: user._id }).select('projectId');
        const projectIds = memberships.map(m => m.projectId);
        filters.projectId = { $in: projectIds };
    }

    return await Task.find(filters)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
};

exports.updateTask = async (taskId, updateData, user) => {
    const task = await Task.findById(taskId);
    if (!task) throw new AppError('Task not found', 404);

    // RBAC: Member can update only if assigned or creator
    if (user.role === 'MEMBER') {
        const isCreator = task.createdBy.toString() === user._id.toString();
        const isAssigned = task.assignedTo && task.assignedTo.toString() === user._id.toString();
        if (!isCreator && !isAssigned) {
            throw new AppError('Not authorized to update this task', 403);
        }
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    await logActivity(user._id, 'UPDATED_TASK', taskId);
    return updatedTask;
};

exports.updateTaskStatus = async (taskId, status, user) => {
    const task = await Task.findById(taskId);
    if (!task) throw new AppError('Task not found', 404);

    if (user.role === 'MEMBER') {
        const isAssigned = task.assignedTo && task.assignedTo.toString() === user._id.toString();
        if (!isAssigned) {
            throw new AppError('Only the assigned member or admin can update status', 403);
        }
    }

    task.status = status;
    await task.save();
    await logActivity(user._id, `MOVED_TO_${status}`, taskId);
    return task;
};

exports.getTaskActivity = async (taskId) => {
    return await ActivityLog.find({ 
        targetId: taskId,
        targetType: 'Task'
    }).populate('userId', 'name email').sort({ createdAt: -1 });
};

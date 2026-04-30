const taskService = require('../services/task.service');
const sendResponse = require('../utils/responseHandler');

exports.createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.body, req.user._id);
        sendResponse(res, 201, task, 'Task created successfully');
    } catch (err) {
        next(err);
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const { projectId } = req.query;
        const filters = projectId ? { projectId } : {};
        const tasks = await taskService.getTasks(filters, req.user);
        sendResponse(res, 200, tasks);
    } catch (err) {
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body, req.user);
        sendResponse(res, 200, task, 'Task updated successfully');
    } catch (err) {
        next(err);
    }
};

exports.assignTask = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const task = await taskService.updateTask(req.params.id, { assignedTo: userId }, req.user);
        sendResponse(res, 200, task, 'Task assigned successfully');
    } catch (err) {
        next(err);
    }
};

exports.takeTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.params.id, { assignedTo: req.user._id }, req.user);
        sendResponse(res, 200, task, 'Task taken successfully');
    } catch (err) {
        next(err);
    }
};

exports.updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const task = await taskService.updateTaskStatus(req.params.id, status, req.user);
        sendResponse(res, 200, task, `Task moved to ${status}`);
    } catch (err) {
        next(err);
    }
};

exports.getTaskActivity = async (req, res, next) => {
    try {
        const activity = await taskService.getTaskActivity(req.params.id);
        sendResponse(res, 200, activity);
    } catch (err) {
        next(err);
    }
};

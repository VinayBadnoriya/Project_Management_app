const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth.middleware');
const sendResponse = require('../utils/responseHandler');

router.get('/', protect, async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return sendResponse(res, 200, { projects: [], tasks: [] });

        const searchRegex = new RegExp(q, 'i');

        const projects = await Project.find({
            $or: [{ title: searchRegex }, { description: searchRegex }]
        }).limit(5);

        const tasks = await Task.find({
            $or: [{ title: searchRegex }, { description: searchRegex }]
        }).limit(10);

        sendResponse(res, 200, { projects, tasks });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

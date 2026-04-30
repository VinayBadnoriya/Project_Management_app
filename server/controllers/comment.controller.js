const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { taskId } = req.params;

        const comment = await Comment.create({
            taskId,
            userId: req.user._id,
            content
        });

        // Log Activity
        await ActivityLog.create({
            userId: req.user._id,
            action: 'COMMENTED_ON_TASK',
            targetId: taskId,
            targetType: 'Task'
        });

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

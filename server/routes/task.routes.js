const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const commentController = require('../controllers/comment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, taskController.getTasks);
router.post('/', protect, taskController.createTask);
router.put('/:id', protect, taskController.updateTask);
router.patch('/:id/status', protect, taskController.updateTaskStatus);
router.get('/:id/activity', protect, taskController.getTaskActivity);
router.put('/:id/assign', protect, authorize('ADMIN'), taskController.assignTask);
router.put('/:id/take', protect, taskController.takeTask);

// Comment routes
router.post('/:taskId/comments', protect, commentController.addComment);
router.get('/:taskId/comments', protect, commentController.getComments);

module.exports = router;



const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, projectController.getProjects);
router.post('/', protect, authorize('ADMIN'), projectController.createProject);
router.post('/add-member', protect, authorize('ADMIN'), projectController.addMember);

// Invite Codes
router.post('/:id/invite-code', protect, authorize('ADMIN'), projectController.generateInviteCode);

// Member Management
router.get('/:id/members', protect, projectController.getProjectMembers);
router.delete('/:id/members/:userId', protect, authorize('ADMIN'), projectController.removeMember);

module.exports = router;

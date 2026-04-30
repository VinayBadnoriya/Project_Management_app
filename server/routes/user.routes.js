const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.patch('/profile', protect, userController.updateProfile);

module.exports = router;

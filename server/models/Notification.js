const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'System Update' },
    message: { type: String, required: true },
    type: { type: String, enum: ['TASK_ASSIGNED', 'PROJECT_INVITE', 'STATUS_CHANGE', 'SYSTEM', 'BROADCAST'], default: 'SYSTEM' },
    isRead: { type: Boolean, default: false },
    link: { type: String } // Optional link to project/task
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

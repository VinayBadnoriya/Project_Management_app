const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    targetType: { type: String }, // e.g., 'Task', 'Project'
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);

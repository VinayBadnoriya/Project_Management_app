const mongoose = require('mongoose');

const inviteCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usesRemaining: {
        type: Number,
        default: 1 // Default to single use, but can be adjusted
    }
}, { timestamps: true });

module.exports = mongoose.model('InviteCode', inviteCodeSchema);

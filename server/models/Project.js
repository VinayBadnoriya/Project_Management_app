const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['planned', 'ongoing', 'completed', 'on-hold'], default: 'planned' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

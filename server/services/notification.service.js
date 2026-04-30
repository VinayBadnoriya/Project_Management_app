const Notification = require('../models/Notification');

exports.createNotification = async (data) => {
    return await Notification.create(data);
};

exports.getNotificationsByUser = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
};

exports.markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

exports.broadcastNotification = async (message, adminId, type = 'BROADCAST') => {
    const Project = require('../models/Project');
    const ProjectMember = require('../models/ProjectMember');

    // 1. Find all projects owned by this Admin
    const adminProjects = await Project.find({ owner: adminId }).select('_id');
    const projectIds = adminProjects.map(p => p._id);

    // 2. Find all unique members in those projects
    const teamMembers = await ProjectMember.distinct('userId', { 
        projectId: { $in: projectIds } 
    });

    // 3. Create notifications for those users
    const notifications = teamMembers.map(userId => ({
        userId,
        title: 'Admin Broadcast',
        message,
        type,
        isRead: false
    }));

    if (notifications.length === 0) return [];

    return await Notification.insertMany(notifications);
};

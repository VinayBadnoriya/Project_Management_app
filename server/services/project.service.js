const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const InviteCode = require('../models/InviteCode');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const crypto = require('crypto');

exports.createProject = async (projectData, ownerId) => {
    const project = await Project.create({
        ...projectData,
        owner: ownerId
    });

    // Add creator as Admin member automatically
    await ProjectMember.create({
        projectId: project._id,
        userId: ownerId,
        role: 'ADMIN'
    });

    return project;
};

exports.getAllProjects = async (userId) => {
    try {
        // Find all project IDs where this user is a member
        const userMemberships = await ProjectMember.find({ userId }).select('projectId');
        const projectIds = userMemberships.map(m => m.projectId);
        
        return await Project.find({ _id: { $in: projectIds } }).populate('owner', 'name email');
    } catch (err) {
        console.error('Error in getAllProjects:', err);
        throw err;
    }
};

exports.addMemberToProject = async (projectId, userId, role = 'MEMBER') => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new AppError('Project not found', 404);
    }

    // Check if already a member
    const existingMember = await ProjectMember.findOne({ projectId, userId });
    if (existingMember) {
        throw new AppError('User is already a member of this project', 400);
    }

    return await ProjectMember.create({
        projectId,
        userId,
        role
    });
};

exports.getProjectMembers = async (projectId) => {
    const members = await ProjectMember.find({ projectId }).populate('userId', 'name email avatar about');
    return members.map(m => ({
        ...m.userId._doc,
        memberId: m._id,
        role: m.role,
        joinedAt: m.createdAt
    }));
};

exports.generateInviteCode = async (projectId, adminId) => {
    // Verify if project exists
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    // Allow if user is global ADMIN or Project Admin
    const user = await User.findById(adminId);
    const adminMember = await ProjectMember.findOne({ projectId, userId: adminId, role: 'ADMIN' });
    
    if (user.role !== 'ADMIN' && !adminMember) {
        throw new AppError('Only project admins or global admins can generate invite codes', 403);
    }

    // Generate unique code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();

    const inviteCode = await InviteCode.create({
        code,
        projectId,
        createdBy: adminId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
        isActive: true
    });

    return inviteCode;
};

exports.validateInviteCode = async (code) => {
    const invite = await InviteCode.findOne({ code, isActive: true });
    
    if (!invite) throw new AppError('Invalid or inactive invite code', 404);
    
    if (invite.expiresAt && invite.expiresAt < new Date()) {
        invite.isActive = false;
        await invite.save();
        throw new AppError('Invite code has expired', 400);
    }

    return invite;
};

exports.removeMember = async (projectId, userId, requesterId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    // Check if requester is Admin
    const requester = await ProjectMember.findOne({ projectId, userId: requesterId, role: 'ADMIN' });
    if (!requester) throw new AppError('Only admins can remove members', 403);

    // Cannot remove project owner
    if (project.owner.toString() === userId) {
        throw new AppError('Cannot remove project owner', 400);
    }

    const member = await ProjectMember.findOneAndDelete({ projectId, userId });
    if (!member) throw new AppError('Member not found in project', 404);

    return member;
};

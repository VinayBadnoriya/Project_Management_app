const projectService = require('../services/project.service');
const sendResponse = require('../utils/responseHandler');

exports.createProject = async (req, res, next) => {
    try {
        const project = await projectService.createProject(req.body, req.user._id);
        sendResponse(res, 201, project, 'Project created successfully');
    } catch (err) {
        next(err);
    }
};

exports.getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getAllProjects(req.user._id);
        sendResponse(res, 200, projects);
    } catch (err) {
        next(err);
    }
};

exports.addMember = async (req, res, next) => {
    try {
        const { projectId, userId, role } = req.body;
        const member = await projectService.addMemberToProject(projectId, userId, role);
        sendResponse(res, 201, member, 'Member added to project');
    } catch (err) {
        next(err);
    }
};

exports.generateInviteCode = async (req, res, next) => {
    try {
        const inviteCode = await projectService.generateInviteCode(req.params.id, req.user._id);
        sendResponse(res, 201, inviteCode, 'Invite code generated successfully');
    } catch (err) {
        next(err);
    }
};

exports.getProjectMembers = async (req, res, next) => {
    try {
        const members = await projectService.getProjectMembers(req.params.id);
        sendResponse(res, 200, members);
    } catch (err) {
        next(err);
    }
};

exports.removeMember = async (req, res, next) => {
    try {
        const { id: projectId, userId } = req.params;
        await projectService.removeMember(projectId, userId, req.user._id);
        sendResponse(res, 200, null, 'Member removed from project');
    } catch (err) {
        next(err);
    }
};

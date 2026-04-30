const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const projectService = require('../services/project.service');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/responseHandler');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.signup = async (req, res, next) => {
    const { name, email, password, role, inviteCode } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new AppError('User already exists', 400);
        }

        // Validate invite code if provided
        let invite = null;
        if (inviteCode) {
            invite = await projectService.validateInviteCode(inviteCode);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: invite ? 'MEMBER' : (role || 'MEMBER')
        });

        // If invite code was valid, add user to project
        if (invite) {
            await projectService.addMemberToProject(invite.projectId, user._id, 'MEMBER');
            
            // Mark code as inactive (single use) or decrement uses
            invite.isActive = false;
            await invite.save();
        }

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        };

        sendResponse(res, 201, userData, 'Signup successful');
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            };
            sendResponse(res, 200, userData, 'Login successful');
        } else {
            throw new AppError('Invalid email or password', 401);
        }
    } catch (err) {
        next(err);
    }
};

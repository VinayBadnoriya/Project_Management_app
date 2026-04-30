const User = require('../models/User');
const sendResponse = require('../utils/responseHandler');
const AppError = require('../utils/AppError');

exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, about } = req.body;
        
        // Find user and update
        const user = await User.findById(req.user._id);
        if (!user) throw new AppError('User not found', 404);

        if (name) user.name = name;
        if (email) user.email = email;
        if (about !== undefined) user.about = about;

        await user.save();

        // Remove password from response
        const updatedUser = user.toObject();
        delete updatedUser.password;

        sendResponse(res, 200, updatedUser, 'Profile updated successfully');
    } catch (err) {
        next(err);
    }
};

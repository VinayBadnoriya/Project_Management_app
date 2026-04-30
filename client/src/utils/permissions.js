export const roles = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    DEVELOPER: 'developer',
};

export const hasPermission = (userRole, requiredRole) => {
    const roleLevels = { [roles.ADMIN]: 3, [roles.MANAGER]: 2, [roles.DEVELOPER]: 1 };
    return roleLevels[userRole] >= roleLevels[requiredRole];
};

"use strict";
/**
 * Role-based Permission Utilities
 * Defines permission rules for different user roles
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedRolesForCreation = exports.canDeleteUser = exports.canUpdateUser = exports.canCreateUserWithRole = exports.canManageUser = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Check if the current user can manage (create/update/delete) a target user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserRole - Role of the user being managed
 * @returns boolean - true if allowed, false otherwise
 */
const canManageUser = (currentUserRole, targetUserRole) => {
    // Super Admin can manage everyone except other Super Admins
    if (currentUserRole === UserRole.SUPER_ADMIN) {
        return targetUserRole !== UserRole.SUPER_ADMIN;
    }
    // Admin can only manage regular users
    if (currentUserRole === UserRole.ADMIN) {
        return targetUserRole === UserRole.USER;
    }
    // Regular users cannot manage anyone
    return false;
};
exports.canManageUser = canManageUser;
/**
 * Check if a user can create another user with a specific role
 * @param currentUserRole - Role of the user performing the action
 * @param targetRoleToCreate - Role to be assigned to the new user
 * @returns boolean - true if allowed, false otherwise
 */
const canCreateUserWithRole = (currentUserRole, targetRoleToCreate) => {
    // Super Admin can create Admin and User
    if (currentUserRole === UserRole.SUPER_ADMIN) {
        return (targetRoleToCreate === UserRole.ADMIN ||
            targetRoleToCreate === UserRole.USER);
    }
    // Admin can only create regular Users
    if (currentUserRole === UserRole.ADMIN) {
        return targetRoleToCreate === UserRole.USER;
    }
    // Regular users cannot create anyone
    return false;
};
exports.canCreateUserWithRole = canCreateUserWithRole;
/**
 * Check if a user can update another user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserId - ID of the user being updated
 * @param currentUserId - ID of the user performing the action
 * @param targetUserRole - Current role of the user being updated
 * @param newRole - New role to be assigned (optional)
 * @returns object - { allowed: boolean, message: string }
 */
const canUpdateUser = (currentUserRole, targetUserId, currentUserId, targetUserRole, newRole) => {
    // Cannot update Super Admin (except Super Admin themselves for email/password)
    if (targetUserRole === UserRole.SUPER_ADMIN) {
        // Super Admin can update their own email/password but not role
        if (currentUserRole === UserRole.SUPER_ADMIN &&
            targetUserId === currentUserId) {
            if (newRole && newRole !== UserRole.SUPER_ADMIN) {
                return {
                    allowed: false,
                    message: "Super Admin cannot change their own role",
                };
            }
            return { allowed: true, message: "" };
        }
        return {
            allowed: false,
            message: "Cannot update Super Admin account",
        };
    }
    // Super Admin can update Admin and User
    if (currentUserRole === UserRole.SUPER_ADMIN) {
        // Validate role change
        if (newRole && !(0, exports.canCreateUserWithRole)(currentUserRole, newRole)) {
            return {
                allowed: false,
                message: "Invalid role assignment for Super Admin",
            };
        }
        return { allowed: true, message: "" };
    }
    // Admin can only update regular Users
    if (currentUserRole === UserRole.ADMIN) {
        if (targetUserRole !== UserRole.USER) {
            return {
                allowed: false,
                message: "Admin can only update regular users",
            };
        }
        // Admin cannot assign admin or super_admin role
        if (newRole && newRole !== UserRole.USER) {
            return {
                allowed: false,
                message: "Admin can only assign 'user' role",
            };
        }
        return { allowed: true, message: "" };
    }
    return {
        allowed: false,
        message: "Insufficient permissions to update user",
    };
};
exports.canUpdateUser = canUpdateUser;
/**
 * Check if a user can delete another user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserId - ID of the user being deleted
 * @param currentUserId - ID of the user performing the action
 * @param targetUserRole - Role of the user being deleted
 * @returns object - { allowed: boolean, message: string }
 */
const canDeleteUser = (currentUserRole, targetUserId, currentUserId, targetUserRole) => {
    // Cannot delete Super Admin
    if (targetUserRole === UserRole.SUPER_ADMIN) {
        return {
            allowed: false,
            message: "Cannot delete Super Admin account",
        };
    }
    // Cannot delete yourself
    if (targetUserId === currentUserId) {
        return {
            allowed: false,
            message: "Cannot delete your own account",
        };
    }
    // Super Admin can delete Admin and User
    if (currentUserRole === UserRole.SUPER_ADMIN) {
        return { allowed: true, message: "" };
    }
    // Admin can only delete regular Users
    if (currentUserRole === UserRole.ADMIN) {
        if (targetUserRole !== UserRole.USER) {
            return {
                allowed: false,
                message: "Admin can only delete regular users",
            };
        }
        return { allowed: true, message: "" };
    }
    return {
        allowed: false,
        message: "Insufficient permissions to delete user",
    };
};
exports.canDeleteUser = canDeleteUser;
/**
 * Get allowed roles for creation based on current user role
 * @param currentUserRole - Role of the user performing the action
 * @returns string[] - Array of allowed roles
 */
const getAllowedRolesForCreation = (currentUserRole) => {
    if (currentUserRole === UserRole.SUPER_ADMIN) {
        return [UserRole.ADMIN, UserRole.USER];
    }
    if (currentUserRole === UserRole.ADMIN) {
        return [UserRole.USER];
    }
    return [];
};
exports.getAllowedRolesForCreation = getAllowedRolesForCreation;
//# sourceMappingURL=rolePermissions.js.map
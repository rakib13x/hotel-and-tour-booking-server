/**
 * Role-based Permission Utilities
 * Defines permission rules for different user roles
 */
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    USER = "user"
}
/**
 * Check if the current user can manage (create/update/delete) a target user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserRole - Role of the user being managed
 * @returns boolean - true if allowed, false otherwise
 */
export declare const canManageUser: (currentUserRole: string, targetUserRole: string) => boolean;
/**
 * Check if a user can create another user with a specific role
 * @param currentUserRole - Role of the user performing the action
 * @param targetRoleToCreate - Role to be assigned to the new user
 * @returns boolean - true if allowed, false otherwise
 */
export declare const canCreateUserWithRole: (currentUserRole: string, targetRoleToCreate: string) => boolean;
/**
 * Check if a user can update another user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserId - ID of the user being updated
 * @param currentUserId - ID of the user performing the action
 * @param targetUserRole - Current role of the user being updated
 * @param newRole - New role to be assigned (optional)
 * @returns object - { allowed: boolean, message: string }
 */
export declare const canUpdateUser: (currentUserRole: string, targetUserId: string, currentUserId: string, targetUserRole: string, newRole?: string) => {
    allowed: boolean;
    message: string;
};
/**
 * Check if a user can delete another user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserId - ID of the user being deleted
 * @param currentUserId - ID of the user performing the action
 * @param targetUserRole - Role of the user being deleted
 * @returns object - { allowed: boolean, message: string }
 */
export declare const canDeleteUser: (currentUserRole: string, targetUserId: string, currentUserId: string, targetUserRole: string) => {
    allowed: boolean;
    message: string;
};
/**
 * Get allowed roles for creation based on current user role
 * @param currentUserRole - Role of the user performing the action
 * @returns string[] - Array of allowed roles
 */
export declare const getAllowedRolesForCreation: (currentUserRole: string) => string[];
//# sourceMappingURL=rolePermissions.d.ts.map
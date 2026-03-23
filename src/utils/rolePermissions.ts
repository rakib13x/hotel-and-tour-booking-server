/**
 * Role-based Permission Utilities
 * Defines permission rules for different user roles
 */

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

/**
 * Check if the current user can manage (create/update/delete) a target user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserRole - Role of the user being managed
 * @returns boolean - true if allowed, false otherwise
 */
export const canManageUser = (
  currentUserRole: string,
  targetUserRole: string
): boolean => {
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

/**
 * Check if a user can create another user with a specific role
 * @param currentUserRole - Role of the user performing the action
 * @param targetRoleToCreate - Role to be assigned to the new user
 * @returns boolean - true if allowed, false otherwise
 */
export const canCreateUserWithRole = (
  currentUserRole: string,
  targetRoleToCreate: string
): boolean => {
  // Super Admin can create Admin and User
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return (
      targetRoleToCreate === UserRole.ADMIN ||
      targetRoleToCreate === UserRole.USER
    );
  }

  // Admin can only create regular Users
  if (currentUserRole === UserRole.ADMIN) {
    return targetRoleToCreate === UserRole.USER;
  }

  // Regular users cannot create anyone
  return false;
};

/**
 * Check if a user can update another user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserId - ID of the user being updated
 * @param currentUserId - ID of the user performing the action
 * @param targetUserRole - Current role of the user being updated
 * @param newRole - New role to be assigned (optional)
 * @returns object - { allowed: boolean, message: string }
 */
export const canUpdateUser = (
  currentUserRole: string,
  targetUserId: string,
  currentUserId: string,
  targetUserRole: string,
  newRole?: string
): { allowed: boolean; message: string } => {
  // Cannot update Super Admin (except Super Admin themselves for email/password)
  if (targetUserRole === UserRole.SUPER_ADMIN) {
    // Super Admin can update their own email/password but not role
    if (
      currentUserRole === UserRole.SUPER_ADMIN &&
      targetUserId === currentUserId
    ) {
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
    if (newRole && !canCreateUserWithRole(currentUserRole, newRole)) {
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

/**
 * Check if a user can delete another user
 * @param currentUserRole - Role of the user performing the action
 * @param targetUserId - ID of the user being deleted
 * @param currentUserId - ID of the user performing the action
 * @param targetUserRole - Role of the user being deleted
 * @returns object - { allowed: boolean, message: string }
 */
export const canDeleteUser = (
  currentUserRole: string,
  targetUserId: string,
  currentUserId: string,
  targetUserRole: string
): { allowed: boolean; message: string } => {
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

/**
 * Get allowed roles for creation based on current user role
 * @param currentUserRole - Role of the user performing the action
 * @returns string[] - Array of allowed roles
 */
export const getAllowedRolesForCreation = (
  currentUserRole: string
): string[] => {
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return [UserRole.ADMIN, UserRole.USER];
  }

  if (currentUserRole === UserRole.ADMIN) {
    return [UserRole.USER];
  }

  return [];
};

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

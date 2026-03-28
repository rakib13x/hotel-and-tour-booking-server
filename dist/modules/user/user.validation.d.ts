import { z } from "zod";
declare const createUserValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        profileImg: z.ZodOptional<z.ZodString>;
        password: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            active: "active";
            block: "block";
            deactive: "deactive";
        }>>;
        role: z.ZodOptional<z.ZodEnum<{
            admin: "admin";
            user: "user";
            super_admin: "super_admin";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateUserValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        profileImg: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            active: "active";
            block: "block";
            deactive: "deactive";
        }>>;
        role: z.ZodOptional<z.ZodEnum<{
            admin: "admin";
            user: "user";
            super_admin: "super_admin";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getUserValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteUserValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const changeUserStatusValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            active: "active";
            block: "block";
            deactive: "deactive";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const changeUserRoleValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        role: z.ZodEnum<{
            admin: "admin";
            user: "user";
            super_admin: "super_admin";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export { changeUserRoleValidation, changeUserStatusValidation, createUserValidation, deleteUserValidation, getUserValidation, updateUserValidation, };
//# sourceMappingURL=user.validation.d.ts.map
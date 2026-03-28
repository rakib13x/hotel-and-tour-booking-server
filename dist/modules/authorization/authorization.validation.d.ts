import { z } from "zod";
export declare const AuthorizationValidation: {
    createAuthorizationValidation: z.ZodObject<{
        image: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    createAuthorizationWithJsonValidation: z.ZodObject<{
        body: z.ZodObject<{
            image: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateAuthorizationValidation: z.ZodObject<{
        image: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    updateAuthorizationWithJsonValidation: z.ZodObject<{
        body: z.ZodObject<{
            image: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getSingleAuthorizationValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deleteAuthorizationValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=authorization.validation.d.ts.map
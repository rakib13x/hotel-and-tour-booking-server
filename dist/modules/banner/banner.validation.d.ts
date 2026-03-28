import { z } from "zod";
export declare const BannerValidation: {
    createBannerValidation: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        backgroundImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    createBannerWithJsonValidation: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            backgroundImage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateBannerValidation: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        backgroundImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    updateBannerWithJsonValidation: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            backgroundImage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getSingleBannerValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deleteBannerValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=banner.validation.d.ts.map
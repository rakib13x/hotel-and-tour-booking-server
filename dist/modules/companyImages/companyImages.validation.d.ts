import { z } from "zod";
export declare const CompanyImagesValidation: {
    createCompanyImagesZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            affiliation: z.ZodArray<z.ZodString>;
            paymentAccept: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateCompanyImagesZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            affiliation: z.ZodOptional<z.ZodArray<z.ZodString>>;
            paymentAccept: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deleteImageZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            imageUrl: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=companyImages.validation.d.ts.map
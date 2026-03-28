import { z } from "zod";
export declare const createTourCategorySchema: z.ZodObject<{
    body: z.ZodObject<{
        category_name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateTourCategorySchema: z.ZodObject<{
    body: z.ZodObject<{
        category_name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const tourCategoryIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=tourCategory.validation.d.ts.map
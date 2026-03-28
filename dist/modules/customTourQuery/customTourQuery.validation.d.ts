import { z } from "zod";
export declare const zCreateCustomTourQuery: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        tourId: z.ZodOptional<z.ZodString>;
        tourTitle: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const zUpdateCustomTourQuery: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            contacted: "contacted";
            closed: "closed";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=customTourQuery.validation.d.ts.map
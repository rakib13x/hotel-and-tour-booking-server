import { z } from "zod";
export declare const ContactValidation: {
    createContactValidation: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            phone: z.ZodString;
            message: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getContactByIdValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=contact.validation.d.ts.map
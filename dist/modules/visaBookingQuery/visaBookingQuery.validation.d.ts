import { z } from "zod";
export declare const zCreateVisaBookingQuery: z.ZodObject<{
    body: z.ZodObject<{
        country: z.ZodString;
        visaType: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const zUpdateVisaBookingQuery: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodEnum<{
            pending: "pending";
            contacted: "contacted";
            closed: "closed";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=visaBookingQuery.validation.d.ts.map
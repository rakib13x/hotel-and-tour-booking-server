import { z } from "zod";
export declare const PolicyPageValidation: {
    createPolicyPageValidation: z.ZodObject<{
        body: z.ZodObject<{
            slug: z.ZodEnum<{
                terms: "terms";
                privacy: "privacy";
                refund: "refund";
            }>;
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updatePolicyPageValidation: z.ZodObject<{
        body: z.ZodObject<{
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getSinglePolicyPageValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getPolicyPageBySlugValidation: z.ZodObject<{
        params: z.ZodObject<{
            slug: z.ZodEnum<{
                terms: "terms";
                privacy: "privacy";
                refund: "refund";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deletePolicyPageValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=policyPage.validation.d.ts.map
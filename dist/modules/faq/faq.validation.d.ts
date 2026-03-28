import { z } from "zod";
export declare const createFaqZodSchema: z.ZodObject<{
    body: z.ZodObject<{
        question: z.ZodString;
        answer: z.ZodString;
        orderIndex: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateFaqZodSchema: z.ZodObject<{
    body: z.ZodObject<{
        question: z.ZodOptional<z.ZodString>;
        answer: z.ZodOptional<z.ZodString>;
        orderIndex: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const faqIdZodSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const reorderFaqsZodSchema: z.ZodObject<{
    body: z.ZodObject<{
        faqs: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            orderIndex: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const FaqValidation: {
    createFaqZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            question: z.ZodString;
            answer: z.ZodString;
            orderIndex: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateFaqZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            question: z.ZodOptional<z.ZodString>;
            answer: z.ZodOptional<z.ZodString>;
            orderIndex: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    faqIdZodSchema: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    reorderFaqsZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            faqs: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                orderIndex: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=faq.validation.d.ts.map
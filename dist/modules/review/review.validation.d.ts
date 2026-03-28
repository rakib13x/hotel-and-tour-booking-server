import { z } from "zod";
export declare const ReviewValidation: {
    createReviewSchema: z.ZodObject<{
        params: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
        query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
        body: z.ZodObject<{
            userName: z.ZodString;
            userProfileImg: z.ZodOptional<z.ZodString>;
            designation: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            rating: z.ZodCoercedNumber<unknown>;
            comment: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateReviewSchema: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
        body: z.ZodObject<{
            userName: z.ZodOptional<z.ZodString>;
            userProfileImg: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{}, z.core.$loose>]>>;
            designation: z.ZodOptional<z.ZodString>;
            rating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            comment: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    idParamSchema: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=review.validation.d.ts.map
import { z } from "zod";
export declare const BlogValidation: {
    createBlogValidation: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            categoryName: z.ZodString;
            coverImage: z.ZodOptional<z.ZodString>;
            images: z.ZodOptional<z.ZodArray<z.ZodString>>;
            content: z.ZodString;
            tags: z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any[], string>>]>;
            readTime: z.ZodString;
            status: z.ZodDefault<z.ZodEnum<{
                draft: "draft";
                published: "published";
            }>>;
            featured: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodPipe<z.ZodString, z.ZodTransform<boolean, string>>, z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<boolean, string | undefined>>]>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateBlogValidation: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            categoryName: z.ZodOptional<z.ZodString>;
            coverImage: z.ZodOptional<z.ZodString>;
            images: z.ZodOptional<z.ZodArray<z.ZodString>>;
            content: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any[], string>>]>>;
            readTime: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                draft: "draft";
                published: "published";
            }>>;
            featured: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodPipe<z.ZodString, z.ZodTransform<boolean, string>>, z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<boolean, string | undefined>>]>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getSingleBlogValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deleteBlogValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=blogs.validation.d.ts.map
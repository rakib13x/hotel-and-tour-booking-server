import { z } from "zod";

const createBlogValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    categoryName: z.string().min(1, "Category name is required"),
    coverImage: z.string().optional(), // Made optional since it will be added by controller
    images: z.array(z.string()).optional(),
    content: z.string().min(1, "Content is required"),
    tags: z.union([
      z.array(z.string()).min(1, "At least one tag is required"),
      z.string().transform((str) => {
        try {
          const parsed = JSON.parse(str);
          return Array.isArray(parsed) ? parsed : [str];
        } catch {
          return [str];
        }
      }),
    ]),
    readTime: z.string().min(1, "Read time is required"),
    status: z.enum(["draft", "published"]).default("draft"),
    featured: z
      .union([
        z.boolean(),
        z.string().transform((val) => val === "true" || val === "1"),
        z
          .string()
          .optional()
          .transform((val) => val === "true" || val === "1"),
      ])
      .optional(),
  }),
});

const updateBlogValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    categoryName: z.string().min(1, "Category name is required").optional(),
    coverImage: z.string().optional(),
    images: z.array(z.string()).optional(),
    content: z.string().min(1, "Content is required").optional(),
    tags: z
      .union([
        z.array(z.string()).min(1, "At least one tag is required"),
        z.string().transform((str) => {
          try {
            const parsed = JSON.parse(str);
            return Array.isArray(parsed) ? parsed : [str];
          } catch {
            return [str];
          }
        }),
      ])
      .optional(),
    readTime: z.string().min(1, "Read time is required").optional(),
    status: z.enum(["draft", "published"]).optional(),
    featured: z
      .union([
        z.boolean(),
        z.string().transform((val) => val === "true" || val === "1"),
        z
          .string()
          .optional()
          .transform((val) => val === "true" || val === "1"),
      ])
      .optional(),
  }),
});

const getSingleBlogValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Blog ID is required"),
  }),
});

const deleteBlogValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Blog ID is required"),
  }),
});

export const BlogValidation = {
  createBlogValidation,
  updateBlogValidation,
  getSingleBlogValidation,
  deleteBlogValidation,
};

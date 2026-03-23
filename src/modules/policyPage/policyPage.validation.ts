import { z } from "zod";

const createPolicyPageValidation = z.object({
  body: z.object({
    slug: z.enum(["terms", "privacy", "refund"], {
      message: "Slug must be one of: terms, privacy, refund",
    }),
    content: z.string().min(1, "Content is required"),
  }),
});

const updatePolicyPageValidation = z.object({
  body: z.object({
    content: z.string().min(1, "Content is required"),
  }),
});

const getSinglePolicyPageValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Policy page ID is required"),
  }),
});

const getPolicyPageBySlugValidation = z.object({
  params: z.object({
    slug: z.enum(["terms", "privacy", "refund"], {
      message: "Slug must be one of: terms, privacy, refund",
    }),
  }),
});

const deletePolicyPageValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Policy page ID is required"),
  }),
});

export const PolicyPageValidation = {
  createPolicyPageValidation,
  updatePolicyPageValidation,
  getSinglePolicyPageValidation,
  getPolicyPageBySlugValidation,
  deletePolicyPageValidation,
};

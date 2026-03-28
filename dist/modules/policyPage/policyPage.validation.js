"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyPageValidation = void 0;
const zod_1 = require("zod");
const createPolicyPageValidation = zod_1.z.object({
    body: zod_1.z.object({
        slug: zod_1.z.enum(["terms", "privacy", "refund"], {
            message: "Slug must be one of: terms, privacy, refund",
        }),
        content: zod_1.z.string().min(1, "Content is required"),
    }),
});
const updatePolicyPageValidation = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Content is required"),
    }),
});
const getSinglePolicyPageValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Policy page ID is required"),
    }),
});
const getPolicyPageBySlugValidation = zod_1.z.object({
    params: zod_1.z.object({
        slug: zod_1.z.enum(["terms", "privacy", "refund"], {
            message: "Slug must be one of: terms, privacy, refund",
        }),
    }),
});
const deletePolicyPageValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Policy page ID is required"),
    }),
});
exports.PolicyPageValidation = {
    createPolicyPageValidation,
    updatePolicyPageValidation,
    getSinglePolicyPageValidation,
    getPolicyPageBySlugValidation,
    deletePolicyPageValidation,
};
//# sourceMappingURL=policyPage.validation.js.map
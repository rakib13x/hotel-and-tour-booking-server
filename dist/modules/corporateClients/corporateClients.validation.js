"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateClientValidation = void 0;
const zod_1 = require("zod");
const createCorporateClientValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            message: "Name is required",
        }),
        logo: zod_1.z.string().optional(),
    }),
});
const updateCorporateClientValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
    }),
});
const getSingleCorporateClientValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            message: "ID is required",
        }),
    }),
});
const deleteCorporateClientValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            message: "ID is required",
        }),
    }),
});
// Reorder corporate clients validation
const reorderCorporateClientsValidation = zod_1.z.object({
    body: zod_1.z.object({
        clientIds: zod_1.z
            .array(zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid client ID format" }))
            .min(1, { message: "At least one client ID is required" })
            .max(100, { message: "Too many clients to reorder" }),
    }),
});
exports.CorporateClientValidation = {
    createCorporateClientValidation,
    updateCorporateClientValidation,
    getSingleCorporateClientValidation,
    deleteCorporateClientValidation,
    reorderCorporateClientsValidation,
};
//# sourceMappingURL=corporateClients.validation.js.map
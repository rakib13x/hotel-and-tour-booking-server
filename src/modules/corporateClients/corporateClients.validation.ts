import { z } from "zod";

const createCorporateClientValidation = z.object({
  body: z.object({
    name: z.string({
      message: "Name is required",
    }),
    logo: z.string().optional(),
  }),
});

const updateCorporateClientValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
  }),
});

const getSingleCorporateClientValidation = z.object({
  params: z.object({
    id: z.string({
      message: "ID is required",
    }),
  }),
});

const deleteCorporateClientValidation = z.object({
  params: z.object({
    id: z.string({
      message: "ID is required",
    }),
  }),
});

// Reorder corporate clients validation
const reorderCorporateClientsValidation = z.object({
  body: z.object({
    clientIds: z
      .array(
        z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid client ID format" })
      )
      .min(1, { message: "At least one client ID is required" })
      .max(100, { message: "Too many clients to reorder" }),
  }),
});

export const CorporateClientValidation = {
  createCorporateClientValidation,
  updateCorporateClientValidation,
  getSingleCorporateClientValidation,
  deleteCorporateClientValidation,
  reorderCorporateClientsValidation,
};

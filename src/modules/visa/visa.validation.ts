import { z } from "zod";

const visaTypeEnum = z.enum(["tourist visa", "sticker visa", "e-visa"]);

const createCountryVisaValidation = z.object({
  body: z.object({
    countryName: z
      .string()
      .min(1, "Country name is required")
      .max(100, "Country name must be less than 100 characters")
      .trim(),
    visaTypes: z
      .array(visaTypeEnum)
      .min(1, "At least one visa type is required")
      .max(3, "Maximum 3 visa types allowed"),
    processingFee: z
      .number()
      .min(0, "Processing fee must be a positive number")
      .optional(),
    required_document: z
      .string()
      .min(1, "Required document description is required")
      .max(
        50000,
        "Required document description must be less than 50000 characters"
      )
      .trim()
      .optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateCountryVisaValidation = z.object({
  body: z.object({
    countryName: z
      .string()
      .min(1, "Country name is required")
      .max(100, "Country name must be less than 100 characters")
      .trim()
      .optional(),
    visaTypes: z
      .array(visaTypeEnum)
      .min(1, "At least one visa type is required")
      .max(3, "Maximum 3 visa types allowed")
      .optional(),
    processingFee: z
      .number()
      .min(0, "Processing fee must be a positive number")
      .optional(),
    required_document: z
      .string()
      .min(1, "Required document description is required")
      .max(
        50000,
        "Required document description must be less than 50000 characters"
      )
      .trim()
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

const getSingleCountryVisaValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Country visa ID is required"),
  }),
});

const deleteCountryVisaValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Country visa ID is required"),
  }),
});

const getCountryVisaByCountryNameValidation = z.object({
  params: z.object({
    countryName: z.string().min(1, "Country name is required"),
  }),
});

const getCountryVisasByVisaTypeValidation = z.object({
  params: z.object({
    visaType: visaTypeEnum,
  }),
});

const toggleCountryVisaStatusValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Country visa ID is required"),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const CountryVisaValidation = {
  createCountryVisaValidation,
  updateCountryVisaValidation,
  getSingleCountryVisaValidation,
  deleteCountryVisaValidation,
  getCountryVisaByCountryNameValidation,
  getCountryVisasByVisaTypeValidation,
  toggleCountryVisaStatusValidation,
};

import { z } from "zod";

const createQueryValidation = z
  .object({
    formType: z.enum(["hajj_umrah", "package_tour", "group_ticket"], {
      message:
        "Form type must be one of: hajj_umrah, package_tour, group_ticket",
    }),

    // Common fields
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name cannot exceed 100 characters" })
      .trim(),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please provide a valid email address" })
      .toLowerCase()
      .trim(),

    contactNumber: z
      .string()
      .min(1, { message: "Contact number is required" })
      .max(20, { message: "Contact number cannot exceed 20 characters" })
      .trim(),

    startingDate: z
      .string()
      .min(1, { message: "Starting date is required" })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Please provide a valid starting date",
      }),

    returnDate: z
      .string()
      .min(1, { message: "Return date is required" })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Please provide a valid return date",
      }),

    airlineTicketCategory: z.enum(["economy", "business", "first_class"], {
      message:
        "Airline ticket category must be one of: economy, business, first_class",
    }),

    specialRequirements: z
      .string()
      .max(1000, {
        message: "Special requirements cannot exceed 1000 characters",
      })
      .trim()
      .optional(),

    // Hajj & Umrah specific fields
    nightsStayMakkah: z
      .number()
      .int({ message: "Nights stay in Makkah must be an integer" })
      .min(0, { message: "Nights stay in Makkah cannot be negative" })
      .optional(),

    nightsStayMadinah: z
      .number()
      .int({ message: "Nights stay in Madinah must be an integer" })
      .min(0, { message: "Nights stay in Madinah cannot be negative" })
      .optional(),

    maleAdults: z
      .number()
      .int({ message: "Male adults count must be an integer" })
      .min(0, { message: "Male adults count cannot be negative" })
      .optional(),

    femaleAdults: z
      .number()
      .int({ message: "Female adults count must be an integer" })
      .min(0, { message: "Female adults count cannot be negative" })
      .optional(),

    childs: z
      .number()
      .int({ message: "Children count must be an integer" })
      .min(0, { message: "Children count cannot be negative" })
      .optional(),

    accommodationType: z
      .enum(["2_star", "3_star", "4_star", "5_star"], {
        message:
          "Accommodation type must be one of: 2_star, 3_star, 4_star, 5_star",
      })
      .optional(),

    foodsIncluded: z.boolean().optional(),
    guideRequired: z.boolean().optional(),
    privateTransportation: z.boolean().optional(),

    // Package Tour specific fields
    visitingCountry: z
      .string()
      .max(100, { message: "Visiting country cannot exceed 100 characters" })
      .trim()
      .optional(),

    visitingCities: z
      .string()
      .max(500, { message: "Visiting cities cannot exceed 500 characters" })
      .trim()
      .optional(),

    // Group Ticket specific fields
    totalPassengers: z
      .number()
      .int({ message: "Total passengers must be an integer" })
      .min(0, { message: "Total passengers cannot be negative" })
      .optional(),
  })
  .refine(
    (data) => {
      // Validate return date is after starting date
      const startingDate = new Date(data.startingDate);
      const returnDate = new Date(data.returnDate);
      return returnDate > startingDate;
    },
    {
      message: "Return date must be after starting date",
      path: ["returnDate"],
    }
  )
  .refine(
    (data) => {
      // Validate form-specific required fields
      if (data.formType === "hajj_umrah") {
        return (
          data.nightsStayMakkah !== undefined &&
          data.nightsStayMadinah !== undefined &&
          data.maleAdults !== undefined &&
          data.femaleAdults !== undefined &&
          data.childs !== undefined
        );
      }
      if (data.formType === "group_ticket") {
        return data.totalPassengers !== undefined;
      }
      return true;
    },
    {
      message: "Form-specific required fields are missing",
      path: ["formType"],
    }
  );

const getQueryByIdValidation = z.object({
  id: z
    .string()
    .min(1, { message: "Query ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid query ID format" }),
});

const queryParamsValidation = z.object({
  id: z
    .string()
    .min(1, { message: "Query ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid query ID format" }),
});

const getQueryWithParamsValidation = z.object({
  params: queryParamsValidation,
});

const deleteQueryWithParamsValidation = z.object({
  params: queryParamsValidation,
});

const updateQueryValidation = z.object({
  status: z
    .enum(["pending", "reviewed", "contacted", "closed"], {
      message: "Status must be one of: pending, reviewed, contacted, closed",
    })
    .optional(),

  // Allow updating common fields
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" })
    .trim()
    .optional(),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" })
    .toLowerCase()
    .trim()
    .optional(),

  contactNumber: z
    .string()
    .min(1, { message: "Contact number is required" })
    .max(20, { message: "Contact number cannot exceed 20 characters" })
    .trim()
    .optional(),

  specialRequirements: z
    .string()
    .max(1000, {
      message: "Special requirements cannot exceed 1000 characters",
    })
    .trim()
    .optional(),
});

const updateQueryWithParamsValidation = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, { message: "Query ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid query ID format" }),
  }),
  body: updateQueryValidation,
});

const getAllQueriesValidation = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a positive number" })
    .optional(),

  limit: z
    .string()
    .regex(/^\d+$/, { message: "Limit must be a positive number" })
    .optional(),

  sortBy: z.string().optional(),

  sortOrder: z
    .enum(["asc", "desc"], { message: "Sort order must be 'asc' or 'desc'" })
    .optional(),

  search: z.string().optional(),

  formType: z
    .enum(["hajj_umrah", "package_tour", "group_ticket"], {
      message:
        "Form type must be one of: hajj_umrah, package_tour, group_ticket",
    })
    .optional(),

  status: z
    .enum(["pending", "reviewed", "contacted", "closed"], {
      message: "Status must be one of: pending, reviewed, contacted, closed",
    })
    .optional(),
});

export const QueryValidation = {
  createQueryValidation,
  getQueryByIdValidation,
  queryParamsValidation,
  getQueryWithParamsValidation,
  deleteQueryWithParamsValidation,
  updateQueryValidation,
  updateQueryWithParamsValidation,
  getAllQueriesValidation,
};

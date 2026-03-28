"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryValidation = void 0;
const zod_1 = require("zod");
const createQueryValidation = zod_1.z
    .object({
    formType: zod_1.z.enum(["hajj_umrah", "package_tour", "group_ticket"], {
        message: "Form type must be one of: hajj_umrah, package_tour, group_ticket",
    }),
    // Common fields
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .trim(),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please provide a valid email address" })
        .toLowerCase()
        .trim(),
    contactNumber: zod_1.z
        .string()
        .min(1, { message: "Contact number is required" })
        .max(20, { message: "Contact number cannot exceed 20 characters" })
        .trim(),
    startingDate: zod_1.z
        .string()
        .min(1, { message: "Starting date is required" })
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Please provide a valid starting date",
    }),
    returnDate: zod_1.z
        .string()
        .min(1, { message: "Return date is required" })
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Please provide a valid return date",
    }),
    airlineTicketCategory: zod_1.z.enum(["economy", "business", "first_class"], {
        message: "Airline ticket category must be one of: economy, business, first_class",
    }),
    specialRequirements: zod_1.z
        .string()
        .max(1000, {
        message: "Special requirements cannot exceed 1000 characters",
    })
        .trim()
        .optional(),
    // Hajj & Umrah specific fields
    nightsStayMakkah: zod_1.z
        .number()
        .int({ message: "Nights stay in Makkah must be an integer" })
        .min(0, { message: "Nights stay in Makkah cannot be negative" })
        .optional(),
    nightsStayMadinah: zod_1.z
        .number()
        .int({ message: "Nights stay in Madinah must be an integer" })
        .min(0, { message: "Nights stay in Madinah cannot be negative" })
        .optional(),
    maleAdults: zod_1.z
        .number()
        .int({ message: "Male adults count must be an integer" })
        .min(0, { message: "Male adults count cannot be negative" })
        .optional(),
    femaleAdults: zod_1.z
        .number()
        .int({ message: "Female adults count must be an integer" })
        .min(0, { message: "Female adults count cannot be negative" })
        .optional(),
    childs: zod_1.z
        .number()
        .int({ message: "Children count must be an integer" })
        .min(0, { message: "Children count cannot be negative" })
        .optional(),
    accommodationType: zod_1.z
        .enum(["2_star", "3_star", "4_star", "5_star"], {
        message: "Accommodation type must be one of: 2_star, 3_star, 4_star, 5_star",
    })
        .optional(),
    foodsIncluded: zod_1.z.boolean().optional(),
    guideRequired: zod_1.z.boolean().optional(),
    privateTransportation: zod_1.z.boolean().optional(),
    // Package Tour specific fields
    visitingCountry: zod_1.z
        .string()
        .max(100, { message: "Visiting country cannot exceed 100 characters" })
        .trim()
        .optional(),
    visitingCities: zod_1.z
        .string()
        .max(500, { message: "Visiting cities cannot exceed 500 characters" })
        .trim()
        .optional(),
    // Group Ticket specific fields
    totalPassengers: zod_1.z
        .number()
        .int({ message: "Total passengers must be an integer" })
        .min(0, { message: "Total passengers cannot be negative" })
        .optional(),
})
    .refine((data) => {
    // Validate return date is after starting date
    const startingDate = new Date(data.startingDate);
    const returnDate = new Date(data.returnDate);
    return returnDate > startingDate;
}, {
    message: "Return date must be after starting date",
    path: ["returnDate"],
})
    .refine((data) => {
    // Validate form-specific required fields
    if (data.formType === "hajj_umrah") {
        return (data.nightsStayMakkah !== undefined &&
            data.nightsStayMadinah !== undefined &&
            data.maleAdults !== undefined &&
            data.femaleAdults !== undefined &&
            data.childs !== undefined);
    }
    if (data.formType === "group_ticket") {
        return data.totalPassengers !== undefined;
    }
    return true;
}, {
    message: "Form-specific required fields are missing",
    path: ["formType"],
});
const getQueryByIdValidation = zod_1.z.object({
    id: zod_1.z
        .string()
        .min(1, { message: "Query ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid query ID format" }),
});
const queryParamsValidation = zod_1.z.object({
    id: zod_1.z
        .string()
        .min(1, { message: "Query ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid query ID format" }),
});
const getQueryWithParamsValidation = zod_1.z.object({
    params: queryParamsValidation,
});
const deleteQueryWithParamsValidation = zod_1.z.object({
    params: queryParamsValidation,
});
const updateQueryValidation = zod_1.z.object({
    status: zod_1.z
        .enum(["pending", "reviewed", "contacted", "closed"], {
        message: "Status must be one of: pending, reviewed, contacted, closed",
    })
        .optional(),
    // Allow updating common fields
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please provide a valid email address" })
        .toLowerCase()
        .trim()
        .optional(),
    contactNumber: zod_1.z
        .string()
        .min(1, { message: "Contact number is required" })
        .max(20, { message: "Contact number cannot exceed 20 characters" })
        .trim()
        .optional(),
    specialRequirements: zod_1.z
        .string()
        .max(1000, {
        message: "Special requirements cannot exceed 1000 characters",
    })
        .trim()
        .optional(),
});
const updateQueryWithParamsValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "Query ID is required" })
            .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid query ID format" }),
    }),
    body: updateQueryValidation,
});
const getAllQueriesValidation = zod_1.z.object({
    page: zod_1.z
        .string()
        .regex(/^\d+$/, { message: "Page must be a positive number" })
        .optional(),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, { message: "Limit must be a positive number" })
        .optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z
        .enum(["asc", "desc"], { message: "Sort order must be 'asc' or 'desc'" })
        .optional(),
    search: zod_1.z.string().optional(),
    formType: zod_1.z
        .enum(["hajj_umrah", "package_tour", "group_ticket"], {
        message: "Form type must be one of: hajj_umrah, package_tour, group_ticket",
    })
        .optional(),
    status: zod_1.z
        .enum(["pending", "reviewed", "contacted", "closed"], {
        message: "Status must be one of: pending, reviewed, contacted, closed",
    })
        .optional(),
});
exports.QueryValidation = {
    createQueryValidation,
    getQueryByIdValidation,
    queryParamsValidation,
    getQueryWithParamsValidation,
    deleteQueryWithParamsValidation,
    updateQueryValidation,
    updateQueryWithParamsValidation,
    getAllQueriesValidation,
};
//# sourceMappingURL=query.validation.js.map
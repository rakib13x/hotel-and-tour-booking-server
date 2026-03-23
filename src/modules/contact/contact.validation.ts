import { z } from "zod";

const createContactValidation = z.object({
  body: z.object({
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

    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .max(20, { message: "Phone number cannot exceed 20 characters" })
      .trim(),

    message: z
      .string()
      .min(1, { message: "Message is required" })
      .max(1000, { message: "Message cannot exceed 1000 characters" })
      .trim(),
  }),
});

const getContactByIdValidation = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, { message: "Contact ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid contact ID format" }),
  }),
});

export const ContactValidation = {
  createContactValidation,
  getContactByIdValidation,
};

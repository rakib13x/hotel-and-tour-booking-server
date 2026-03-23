import { z } from "zod";

// Validation schema for creating a booking
export const zCreateBooking = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name cannot exceed 100 characters" })
      .trim(),
    
    email: z
      .string()
      .email({ message: "Please provide a valid email address" })
      .toLowerCase()
      .trim(),
    
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 characters" })
      .max(20, { message: "Phone number cannot exceed 20 characters" })
      .trim(),
    
    message: z
      .string()
      .max(2000, { message: "Message cannot exceed 2000 characters" })
      .trim()
      .optional(),
    
    tourId: z
      .string()
      .trim(),
    
    tourTitle: z
      .string()
      .trim(),
    
    destination: z
      .string()
      .trim(),
    
    duration: z
      .number()
      .int({ message: "Duration must be an integer" })
      .min(1, { message: "Duration must be at least 1 day" }),
    
    validFrom: z.string(),
    
    validTo: z.string(),
    
    bookingFee: z
      .number()
      .min(0, { message: "Booking fee cannot be negative" }),
  }),
});

// Validation schema for updating booking status (admin only)
export const zUpdateBookingStatus = z.object({
  body: z.object({
    bookingStatus: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  }),
});

// Validation schema for payment verification
export const zVerifyPayment = z.object({
  body: z.object({
    transactionId: z.string(),
    status: z.string(),
  }),
});

export type CreateBookingInput = z.infer<typeof zCreateBooking>['body'];
export type UpdateBookingStatusInput = z.infer<typeof zUpdateBookingStatus>['body'];
export type VerifyPaymentInput = z.infer<typeof zVerifyPayment>['body'];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zVerifyPayment = exports.zUpdateBookingStatus = exports.zCreateBooking = void 0;
const zod_1 = require("zod");
// Validation schema for creating a booking
exports.zCreateBooking = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, { message: "Name must be at least 2 characters" })
            .max(100, { message: "Name cannot exceed 100 characters" })
            .trim(),
        email: zod_1.z
            .string()
            .email({ message: "Please provide a valid email address" })
            .toLowerCase()
            .trim(),
        phone: zod_1.z
            .string()
            .min(10, { message: "Phone number must be at least 10 characters" })
            .max(20, { message: "Phone number cannot exceed 20 characters" })
            .trim(),
        message: zod_1.z
            .string()
            .max(2000, { message: "Message cannot exceed 2000 characters" })
            .trim()
            .optional(),
        tourId: zod_1.z
            .string()
            .trim(),
        tourTitle: zod_1.z
            .string()
            .trim(),
        destination: zod_1.z
            .string()
            .trim(),
        duration: zod_1.z
            .number()
            .int({ message: "Duration must be an integer" })
            .min(1, { message: "Duration must be at least 1 day" }),
        validFrom: zod_1.z.string(),
        validTo: zod_1.z.string(),
        bookingFee: zod_1.z
            .number()
            .min(0, { message: "Booking fee cannot be negative" }),
    }),
});
// Validation schema for updating booking status (admin only)
exports.zUpdateBookingStatus = zod_1.z.object({
    body: zod_1.z.object({
        bookingStatus: zod_1.z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
    }),
});
// Validation schema for payment verification
exports.zVerifyPayment = zod_1.z.object({
    body: zod_1.z.object({
        transactionId: zod_1.z.string(),
        status: zod_1.z.string(),
    }),
});
//# sourceMappingURL=booking.validation.js.map
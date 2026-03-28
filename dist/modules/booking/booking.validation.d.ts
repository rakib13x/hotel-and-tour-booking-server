import { z } from "zod";
export declare const zCreateBooking: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        message: z.ZodOptional<z.ZodString>;
        tourId: z.ZodString;
        tourTitle: z.ZodString;
        destination: z.ZodString;
        duration: z.ZodNumber;
        validFrom: z.ZodString;
        validTo: z.ZodString;
        bookingFee: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const zUpdateBookingStatus: z.ZodObject<{
    body: z.ZodObject<{
        bookingStatus: z.ZodEnum<{
            pending: "pending";
            confirmed: "confirmed";
            cancelled: "cancelled";
            completed: "completed";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const zVerifyPayment: z.ZodObject<{
    body: z.ZodObject<{
        transactionId: z.ZodString;
        status: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateBookingInput = z.infer<typeof zCreateBooking>['body'];
export type UpdateBookingStatusInput = z.infer<typeof zUpdateBookingStatus>['body'];
export type VerifyPaymentInput = z.infer<typeof zVerifyPayment>['body'];
//# sourceMappingURL=booking.validation.d.ts.map
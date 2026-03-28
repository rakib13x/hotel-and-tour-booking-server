import { IBooking } from "../../models/booking.model";
export declare const BookingService: {
    createBookingAndInitiatePayment: (bookingData: Partial<IBooking>, ipAddress: string, userAgent: string, userId?: string) => Promise<{
        booking: IBooking;
        paymentUrl: string;
        sessionKey: string;
    }>;
    verifyPayment: (transactionId: string) => Promise<{
        isValid: boolean;
        booking?: IBooking;
        validationData?: any;
    }>;
    handlePaymentSuccess: (paymentData: any) => Promise<IBooking>;
    handlePaymentFailure: (transactionId: string, errorData: any) => Promise<void>;
    getAllBookings: (page?: number, limit?: number, sortBy?: string, sortOrder?: "asc" | "desc", search?: string, paymentStatus?: string, bookingStatus?: string) => Promise<{
        bookings: IBooking[];
        totalBookings: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getBookingById: (bookingId: string) => Promise<IBooking>;
    getBookingByTransactionId: (transactionId: string) => Promise<IBooking>;
    updateBookingStatus: (bookingId: string, bookingStatus: "pending" | "confirmed" | "cancelled" | "completed") => Promise<IBooking>;
    getBookingStats: () => Promise<{
        totalBookings: number;
        pendingBookings: number;
        confirmedBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        todayBookings: number;
        weekBookings: number;
        monthBookings: number;
    }>;
    getMyBookings: (userId: string) => Promise<IBooking[]>;
};
//# sourceMappingURL=booking.service.d.ts.map
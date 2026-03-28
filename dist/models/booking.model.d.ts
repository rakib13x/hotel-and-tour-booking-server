import mongoose from "mongoose";
export interface IBooking {
    _id?: string;
    userId?: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    tourId: string;
    tourTitle: string;
    destination: string;
    duration: number;
    validFrom: string;
    validTo: string;
    bookingFee: number;
    transactionId?: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod?: string;
    paymentGateway?: string;
    sslcommerz: {
        sessionKey?: string;
        GatewayPageURL?: string;
        transactionId?: string;
        amount?: number;
        currency?: string;
        bankTransactionId?: string;
        cardType?: string;
        cardNo?: string;
        cardIssuer?: string;
        cardBrand?: string;
        cardCategory?: string;
        storeAmount?: number;
        validatedOn?: Date;
        status?: string;
        error?: string;
    };
    bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    ipAddress?: string;
    userAgent?: string;
    createdAt?: Date;
    updatedAt?: Date;
    paidAt?: Date;
    confirmedAt?: Date;
    cancelledAt?: Date;
}
export declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, {}> & IBooking & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=booking.model.d.ts.map
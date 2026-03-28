import { Request, Response } from "express";
export declare const BookingController: {
    createBooking: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentSuccess: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentFail: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentCancel: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentIPN: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllBookings: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMyBookings: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBookingById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBookingByTransactionId: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verifyPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateBookingStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBookingStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=booking.controller.d.ts.map
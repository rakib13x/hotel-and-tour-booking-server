"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_service_1 = require("./booking.service");
const logger_1 = __importDefault(require("../../config/logger"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const env_1 = __importDefault(require("../../config/env"));
// Create booking and initiate payment
const createBooking = (0, catchAsync_1.default)(async (req, res) => {
    const bookingData = req.body;
    const userId = req.user?.id;
    console.log('=== CREATE BOOKING API CALLED ===');
    console.log('Booking request received:', {
        name: bookingData.name,
        email: bookingData.email,
        tourTitle: bookingData.tourTitle,
        bookingFee: bookingData.bookingFee,
        userId: userId || 'Guest',
    });
    // Extract security information
    const ipAddress = req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.ip ||
        req.socket.remoteAddress ||
        'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const result = await booking_service_1.BookingService.createBookingAndInitiatePayment(bookingData, ipAddress, userAgent, userId);
    console.log('✅ Booking service returned:', {
        bookingId: result.booking._id,
        transactionId: result.booking.transactionId,
        paymentUrl: result.paymentUrl ? 'Generated' : 'MISSING',
    });
    logger_1.default.info('Booking created via API', {
        bookingId: result.booking._id,
        transactionId: result.booking.transactionId,
        ip: ipAddress,
    });
    (0, sendResponse_1.default)(res, http_status_codes_1.default.CREATED, {
        success: true,
        message: "Booking created successfully. Redirecting to payment gateway.",
        data: {
            bookingId: result.booking._id,
            transactionId: result.booking.transactionId,
            paymentUrl: result.paymentUrl,
            sessionKey: result.sessionKey,
            booking: {
                name: result.booking.name,
                email: result.booking.email,
                tourTitle: result.booking.tourTitle,
                bookingFee: result.booking.bookingFee,
                bookingStatus: result.booking.bookingStatus,
                paymentStatus: result.booking.paymentStatus,
            },
        },
    });
});
// Payment success callback
const paymentSuccess = (0, catchAsync_1.default)(async (req, res) => {
    // SSLCommerz can send data in both body and query, merge them
    const paymentData = { ...req.query, ...req.body };
    console.log('=== PAYMENT SUCCESS CALLBACK ===');
    console.log('Request method:', req.method);
    console.log('Query params:', req.query);
    console.log('Body params:', req.body);
    console.log('Merged payment data:', paymentData);
    console.log('Transaction ID from callback:', paymentData.tran_id);
    if (!paymentData.tran_id) {
        console.error('❌ No transaction ID in callback!');
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Transaction ID is missing from payment callback');
    }
    logger_1.default.info('Payment success callback received', { paymentData });
    const booking = await booking_service_1.BookingService.handlePaymentSuccess(paymentData);
    // Redirect to frontend success page with booking details
    const frontendUrl = env_1.default.cors.origin || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/booking-success?bookingId=${booking._id}&transactionId=${booking.transactionId}`;
    console.log('✅ Payment successful, redirecting to:', redirectUrl);
    // Redirect instead of JSON response for better UX
    res.redirect(redirectUrl);
});
// Payment failure callback
const paymentFail = (0, catchAsync_1.default)(async (req, res) => {
    const paymentData = { ...req.query, ...req.body };
    const tran_id = paymentData.tran_id;
    console.log('=== PAYMENT FAILURE CALLBACK ===');
    console.log('Transaction ID:', tran_id);
    console.log('Error data:', paymentData);
    logger_1.default.warn('Payment failure callback received', {
        transactionId: tran_id,
        errorData: paymentData
    });
    await booking_service_1.BookingService.handlePaymentFailure(tran_id, paymentData);
    // Redirect to frontend failure page
    const frontendUrl = env_1.default.cors.origin || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/booking-failed?transactionId=${tran_id}`;
    console.log('Redirecting to failure page:', redirectUrl);
    res.redirect(redirectUrl);
});
// Payment cancellation callback
const paymentCancel = (0, catchAsync_1.default)(async (req, res) => {
    const paymentData = { ...req.query, ...req.body };
    const tran_id = paymentData.tran_id;
    console.log('=== PAYMENT CANCELLATION CALLBACK ===');
    console.log('Transaction ID:', tran_id);
    logger_1.default.info('Payment cancellation callback received', { transactionId: tran_id });
    await booking_service_1.BookingService.handlePaymentFailure(tran_id, {
        error: 'Payment cancelled by user',
    });
    // Redirect to frontend cancellation page
    const frontendUrl = env_1.default.cors.origin || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/booking-cancelled?transactionId=${tran_id}`;
    console.log('Redirecting to cancellation page:', redirectUrl);
    res.redirect(redirectUrl);
});
// IPN (Instant Payment Notification) callback
const paymentIPN = (0, catchAsync_1.default)(async (req, res) => {
    const ipnData = req.body;
    logger_1.default.info('IPN callback received', { ipnData });
    // Verify the payment
    const transactionId = ipnData.tran_id;
    const verification = await booking_service_1.BookingService.verifyPayment(transactionId);
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: "IPN processed successfully.",
        data: {
            transactionId,
            isValid: verification.isValid,
        },
    });
});
// Get all bookings (Admin only)
const getAllBookings = (0, catchAsync_1.default)(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, paymentStatus, bookingStatus, } = req.query;
    const result = await booking_service_1.BookingService.getAllBookings(Number(page), Number(limit), sortBy, sortOrder, search, paymentStatus, bookingStatus);
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: "Bookings retrieved successfully.",
        data: result.bookings,
        pagination: {
            page: result.currentPage,
            limit: Number(limit),
            total: result.totalBookings,
            pages: result.totalPages,
        },
    });
});
// Get user's own bookings
const getMyBookings = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    console.log('=== GET MY BOOKINGS API CALLED ===');
    console.log('User ID from token:', userId);
    if (!userId) {
        console.error('❌ No user ID found in request!');
        throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const bookings = await booking_service_1.BookingService.getMyBookings(userId);
    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: "User bookings retrieved successfully.",
        data: bookings,
        pagination: {
            page: 1,
            limit: bookings.length,
            total: bookings.length,
            pages: 1,
        },
    });
});
// Get booking by ID
const getBookingById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const booking = await booking_service_1.BookingService.getBookingById(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: "Booking retrieved successfully.",
        data: booking,
    });
});
// Get booking by transaction ID
const getBookingByTransactionId = (0, catchAsync_1.default)(async (req, res) => {
    const transactionId = req.params.transactionId;
    const booking = await booking_service_1.BookingService.getBookingByTransactionId(transactionId);
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: "Booking retrieved successfully.",
        data: booking,
    });
});
// Verify payment status
const verifyPayment = (0, catchAsync_1.default)(async (req, res) => {
    const transactionId = req.params.transactionId;
    const verification = await booking_service_1.BookingService.verifyPayment(transactionId);
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: verification.isValid
            ? "Payment verified successfully."
            : "Payment verification failed.",
        data: {
            transactionId,
            isValid: verification.isValid,
            booking: verification.booking,
        },
    });
});
// Update booking status (Admin only)
const updateBookingStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const { bookingStatus } = req.body;
    const booking = await booking_service_1.BookingService.updateBookingStatus(id, bookingStatus);
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: "Booking status updated successfully.",
        data: booking,
    });
});
// Get booking statistics (Admin only)
const getBookingStats = (0, catchAsync_1.default)(async (req, res) => {
    const stats = await booking_service_1.BookingService.getBookingStats();
    (0, sendResponse_1.default)(res, http_status_codes_1.default.OK, {
        success: true,
        message: "Booking statistics retrieved successfully.",
        data: stats,
    });
});
exports.BookingController = {
    createBooking,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN,
    getAllBookings,
    getMyBookings,
    getBookingById,
    getBookingByTransactionId,
    verifyPayment,
    updateBookingStatus,
    getBookingStats,
};
//# sourceMappingURL=booking.controller.js.map
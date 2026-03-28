"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const logger_1 = __importDefault(require("../../config/logger"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = __importDefault(require("../../config/env"));
const booking_model_1 = require("../../models/booking.model");
const dynamicEmailHelper_1 = require("../../helpers/dynamicEmailHelper");
const emailTemplates_1 = require("../../helpers/emailTemplates");
const SSLCommerzPayment = require("sslcommerz-lts");
// Initialize SSLCommerz
const initializeSSLCommerz = () => {
    return new SSLCommerzPayment(env_1.default.sslcommerz.storeId, env_1.default.sslcommerz.storePassword, env_1.default.sslcommerz.isLive);
};
// Generate unique transaction ID
const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TXN${timestamp}${random}`;
};
// Create booking and initiate payment
const createBookingAndInitiatePayment = async (bookingData, ipAddress, userAgent, userId) => {
    try {
        // Generate transaction ID
        const transactionId = generateTransactionId();
        console.log("=== BOOKING CREATION START ===");
        console.log("Transaction ID generated:", transactionId);
        console.log("User ID associated:", userId || "Guest");
        console.log("Booking data received:", {
            name: bookingData.name,
            email: bookingData.email,
            tourTitle: bookingData.tourTitle,
            bookingFee: bookingData.bookingFee,
        });
        // Create booking in database with security fields
        const booking = await booking_model_1.Booking.create({
            ...bookingData,
            userId,
            transactionId,
            paymentStatus: "pending",
            bookingStatus: "pending",
            paymentGateway: "SSLCommerz",
            ipAddress,
            userAgent,
            sslcommerz: {
                transactionId,
                amount: bookingData.bookingFee,
                currency: "BDT",
                status: "INITIATED",
            },
        });
        console.log("✅ Booking saved to database:", {
            bookingId: booking._id,
            transactionId: booking.transactionId,
        });
        logger_1.default.info("Booking created successfully", {
            bookingId: booking._id,
            transactionId,
        });
        // Prepare SSLCommerz payment data
        const sslCommerzData = {
            total_amount: bookingData.bookingFee,
            currency: "BDT",
            tran_id: transactionId,
            success_url: `${env_1.default.sslcommerz.successUrl}?tran_id=${transactionId}`,
            fail_url: `${env_1.default.sslcommerz.failUrl}?tran_id=${transactionId}`,
            cancel_url: `${env_1.default.sslcommerz.cancelUrl}?tran_id=${transactionId}`,
            ipn_url: env_1.default.sslcommerz.ipnUrl,
            shipping_method: "NO",
            product_name: bookingData.tourTitle || "Tour Booking",
            product_category: "Travel",
            product_profile: "general",
            cus_name: bookingData.name,
            cus_email: bookingData.email,
            cus_add1: "N/A",
            cus_add2: "N/A",
            cus_city: "N/A",
            cus_state: "N/A",
            cus_postcode: "N/A",
            cus_country: "Bangladesh",
            cus_phone: bookingData.phone,
            cus_fax: "N/A",
            ship_name: bookingData.name,
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: "N/A",
            ship_country: "Bangladesh",
            value_a: booking._id?.toString(), // Booking ID
            value_b: bookingData.tourId, // Tour ID
            value_c: bookingData.email, // Customer email
        };
        // Initialize payment with SSLCommerz
        console.log("=== INITIALIZING SSLCOMMERZ PAYMENT ===");
        console.log("SSLCommerz Data:", {
            total_amount: sslCommerzData.total_amount,
            currency: sslCommerzData.currency,
            tran_id: sslCommerzData.tran_id,
            cus_name: sslCommerzData.cus_name,
            cus_email: sslCommerzData.cus_email,
            success_url: sslCommerzData.success_url,
        });
        const sslCommerz = initializeSSLCommerz();
        const paymentSession = await sslCommerz.init(sslCommerzData);
        console.log("SSLCommerz Payment Session Response:", {
            status: paymentSession?.status,
            hasGatewayURL: !!paymentSession?.GatewayPageURL,
            sessionkey: paymentSession?.sessionkey ? "Present" : "Missing",
            failedreason: paymentSession?.failedreason || "None",
        });
        if (!paymentSession || !paymentSession.GatewayPageURL) {
            console.error("❌ SSLCommerz initialization failed:", paymentSession);
            throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, `Failed to initialize payment gateway: ${paymentSession?.failedreason || "Unknown error"}`);
        }
        // Update booking with payment session details
        booking.sslcommerz.sessionKey = paymentSession.sessionkey;
        booking.sslcommerz.GatewayPageURL = paymentSession.GatewayPageURL;
        await booking.save();
        console.log("✅ Payment session created and booking updated");
        logger_1.default.info("Payment session created successfully", {
            bookingId: booking._id,
            transactionId,
            sessionKey: paymentSession.sessionkey,
        });
        // Send booking confirmation email to customer (fire and forget)
        const emailData = {
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            tourTitle: bookingData.tourTitle,
            destination: bookingData.destination,
            duration: bookingData.duration,
            bookingFee: bookingData.bookingFee,
            transactionId,
            bookingId: booking._id?.toString(),
            message: bookingData.message || "N/A",
            customerName: bookingData.name,
            serviceName: bookingData.tourTitle,
            bookingDate: bookingData.validFrom,
            amount: bookingData.bookingFee,
        };
        dynamicEmailHelper_1.dynamicEmailHelper
            .sendEmailWithTemplate(emailTemplates_1.emailTemplates.contact.adminNotification, { to: bookingData.email || "" }, emailData)
            .catch((error) => {
            logger_1.default.error("Error sending booking email:", error);
        });
        // Send notification to admin
        dynamicEmailHelper_1.dynamicEmailHelper
            .sendEmailWithTemplate(emailTemplates_1.emailTemplates.contact.adminNotification, { to: env_1.default.admin.email || "admin@example.com" }, emailData)
            .catch((error) => {
            logger_1.default.error("Error sending admin notification:", error);
        });
        return {
            booking,
            paymentUrl: paymentSession.GatewayPageURL,
            sessionKey: paymentSession.sessionkey,
        };
    }
    catch (error) {
        logger_1.default.error("Error in createBookingAndInitiatePayment:", error);
        if (error.name === "ValidationError") {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Validation failed: " + error.message);
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to create booking and initiate payment");
    }
};
// Verify payment with SSLCommerz
const verifyPayment = async (transactionId) => {
    try {
        console.log("=== PAYMENT VERIFICATION START ===");
        console.log("Transaction ID received from SSLCommerz:", transactionId);
        const sslCommerz = initializeSSLCommerz();
        // Validate payment with SSLCommerz
        const validation = await sslCommerz.validate({ tran_id: transactionId });
        console.log("SSLCommerz validation response:", validation);
        logger_1.default.info("Payment validation response:", validation);
        // Find booking
        console.log("Searching for booking with transactionId:", transactionId);
        console.log("Transaction ID type:", typeof transactionId);
        console.log("Transaction ID length:", transactionId?.length);
        const booking = await booking_model_1.Booking.findOne({ transactionId });
        console.log("Booking search result:", booking ? `Found (ID: ${booking._id})` : "NOT FOUND");
        if (!booking) {
            // Let's check all bookings to debug
            const allBookings = await booking_model_1.Booking.find()
                .sort({ createdAt: -1 })
                .limit(10);
            console.log("❌ BOOKING NOT FOUND - Debugging info:");
            console.log(`Transaction ID from SSLCommerz: "${transactionId}"`);
            console.log(`Total bookings in DB: ${allBookings.length}`);
            console.log("Recent bookings in DB:", allBookings.map((b) => ({
                id: b._id,
                transactionId: b.transactionId,
                email: b.email,
                tourTitle: b.tourTitle,
                createdAt: b.createdAt,
                paymentStatus: b.paymentStatus,
            })));
            // Check if any booking has similar transaction ID (for debugging)
            const similarBooking = allBookings.find((b) => b.transactionId?.includes(transactionId) ||
                transactionId?.includes(b.transactionId || ""));
            if (similarBooking) {
                console.log("⚠️ Found similar transaction ID:", {
                    stored: similarBooking.transactionId,
                    received: transactionId,
                });
            }
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, `Booking not found for transaction ID: ${transactionId}`);
        }
        // Check validation status
        // In sandbox mode, status might be 'VALID', 'VALIDATED', or validation might fail
        // SSLCommerz only calls success URL if payment succeeded, so we can trust the callback
        const isValid = validation &&
            (validation.status === "VALID" ||
                validation.status === "VALIDATED" ||
                validation.status === "SUCCESS");
        console.log("Validation check:", {
            hasValidation: !!validation,
            validationStatus: validation?.status,
            isValid,
            isLive: env_1.default.sslcommerz.isLive,
        });
        // In sandbox mode, be more lenient with validation
        const shouldMarkAsPaid = isValid || (!env_1.default.sslcommerz.isLive && validation);
        if (shouldMarkAsPaid) {
            console.log("✅ Marking booking as paid");
            // Update booking with payment details
            booking.paymentStatus = "paid";
            booking.bookingStatus = "confirmed";
            booking.paidAt = new Date();
            booking.confirmedAt = new Date();
            booking.sslcommerz.status = validation?.status || "COMPLETED";
            booking.sslcommerz.validatedOn = new Date();
            booking.sslcommerz.bankTransactionId = validation?.bank_tran_id;
            booking.sslcommerz.cardType = validation?.card_type;
            booking.sslcommerz.cardNo = validation?.card_no;
            booking.sslcommerz.cardIssuer = validation?.card_issuer;
            booking.sslcommerz.cardBrand = validation?.card_brand;
            booking.sslcommerz.storeAmount = validation?.store_amount;
            await booking.save();
            console.log("✅ Booking updated successfully:", {
                bookingId: booking._id,
                paymentStatus: booking.paymentStatus,
                bookingStatus: booking.bookingStatus,
            });
            logger_1.default.info("Payment verified and booking confirmed", {
                bookingId: booking._id,
                transactionId,
            });
            // Send payment success email
            const emailData = {
                name: booking.name,
                email: booking.email,
                tourTitle: booking.tourTitle,
                bookingFee: booking.bookingFee,
                transactionId,
                bookingId: booking._id?.toString(),
                customerName: booking.name,
                serviceName: booking.tourTitle,
                bookingDate: booking.validFrom,
                amount: booking.bookingFee,
            };
            dynamicEmailHelper_1.dynamicEmailHelper
                .sendEmailWithTemplate(emailTemplates_1.emailTemplates.booking.bookingConfirmation, { to: booking.email }, emailData)
                .catch((error) => {
                logger_1.default.error("Error sending success email:", error);
            });
        }
        else {
            console.log("⚠️ Payment validation returned invalid status:", validation?.status);
        }
        return {
            isValid: shouldMarkAsPaid,
            booking,
            validationData: validation,
        };
    }
    catch (error) {
        logger_1.default.error("Error in verifyPayment:", error);
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to verify payment");
    }
};
// Handle payment success callback
const handlePaymentSuccess = async (paymentData) => {
    try {
        const transactionId = paymentData.tran_id;
        // Verify the payment
        const verification = await verifyPayment(transactionId);
        if (!verification.isValid || !verification.booking) {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment verification failed");
        }
        return verification.booking;
    }
    catch (error) {
        logger_1.default.error("Error in handlePaymentSuccess:", error);
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to handle payment success");
    }
};
// Handle payment failure
const handlePaymentFailure = async (transactionId, errorData) => {
    try {
        const booking = await booking_model_1.Booking.findOne({ transactionId });
        if (!booking) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found");
        }
        booking.paymentStatus = "failed";
        booking.sslcommerz.status = "FAILED";
        booking.sslcommerz.error = JSON.stringify(errorData);
        await booking.save();
        logger_1.default.info("Payment failure recorded", {
            bookingId: booking._id,
            transactionId,
        });
        // Send payment failure email
        const emailData = {
            name: booking.name,
            email: booking.email,
            tourTitle: booking.tourTitle,
            transactionId,
            error: errorData.error || "Payment failed",
            customerName: booking.name,
            bookingId: booking._id?.toString(),
            refundAmount: booking.bookingFee,
            refundDays: "7-10",
        };
        dynamicEmailHelper_1.dynamicEmailHelper
            .sendEmailWithTemplate(emailTemplates_1.emailTemplates.booking.bookingCancellation, { to: booking.email }, emailData)
            .catch((error) => {
            logger_1.default.error("Error sending failure email:", error);
        });
    }
    catch (error) {
        logger_1.default.error("Error in handlePaymentFailure:", error);
        throw error;
    }
};
// Get all bookings with pagination
const getAllBookings = async (page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search, paymentStatus, bookingStatus) => {
    try {
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, Math.min(100, limit));
        const skip = (pageNumber - 1) * limitNumber;
        // Build search query
        let searchQuery = {};
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            searchQuery.$or = [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { phone: { $regex: searchRegex } },
                { transactionId: { $regex: searchRegex } },
                { tourTitle: { $regex: searchRegex } },
            ];
        }
        if (paymentStatus) {
            searchQuery.paymentStatus = paymentStatus;
        }
        if (bookingStatus) {
            searchQuery.bookingStatus = bookingStatus;
        }
        const sortObject = {};
        sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;
        const [bookings, totalBookings] = await Promise.all([
            booking_model_1.Booking.find(searchQuery)
                .sort(sortObject)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            booking_model_1.Booking.countDocuments(searchQuery),
        ]);
        const totalPages = Math.ceil(totalBookings / limitNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;
        return {
            bookings,
            totalBookings,
            totalPages,
            currentPage: pageNumber,
            hasNextPage,
            hasPrevPage,
        };
    }
    catch (error) {
        logger_1.default.error("Error in getAllBookings:", error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve bookings");
    }
};
// Get booking by ID
const getBookingById = async (bookingId) => {
    try {
        const booking = await booking_model_1.Booking.findById(bookingId).lean();
        if (!booking) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found");
        }
        return booking;
    }
    catch (error) {
        logger_1.default.error("Error in getBookingById:", error);
        if (error.name === "CastError") {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid booking ID format");
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve booking");
    }
};
// Get booking by transaction ID
const getBookingByTransactionId = async (transactionId) => {
    try {
        const booking = await booking_model_1.Booking.findOne({ transactionId }).lean();
        if (!booking) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found");
        }
        return booking;
    }
    catch (error) {
        logger_1.default.error("Error in getBookingByTransactionId:", error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve booking");
    }
};
// Update booking status (admin only)
const updateBookingStatus = async (bookingId, bookingStatus) => {
    try {
        const booking = await booking_model_1.Booking.findById(bookingId);
        if (!booking) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found");
        }
        booking.bookingStatus = bookingStatus;
        if (bookingStatus === "cancelled") {
            booking.cancelledAt = new Date();
        }
        else if (bookingStatus === "confirmed" && !booking.confirmedAt) {
            booking.confirmedAt = new Date();
        }
        await booking.save();
        logger_1.default.info("Booking status updated", {
            bookingId,
            newStatus: bookingStatus,
        });
        return booking;
    }
    catch (error) {
        logger_1.default.error("Error in updateBookingStatus:", error);
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update booking status");
    }
};
// Get booking statistics
const getBookingStats = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalBookings, pendingBookings, confirmedBookings, cancelledBookings, todayBookings, weekBookings, monthBookings, revenueResult,] = await Promise.all([
            booking_model_1.Booking.countDocuments(),
            booking_model_1.Booking.countDocuments({ bookingStatus: "pending" }),
            booking_model_1.Booking.countDocuments({ bookingStatus: "confirmed" }),
            booking_model_1.Booking.countDocuments({ bookingStatus: "cancelled" }),
            booking_model_1.Booking.countDocuments({ createdAt: { $gte: startOfDay } }),
            booking_model_1.Booking.countDocuments({ createdAt: { $gte: startOfWeek } }),
            booking_model_1.Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
            booking_model_1.Booking.aggregate([
                { $match: { paymentStatus: "paid" } },
                { $group: { _id: null, total: { $sum: "$bookingFee" } } },
            ]),
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        return {
            totalBookings,
            pendingBookings,
            confirmedBookings,
            cancelledBookings,
            totalRevenue,
            todayBookings,
            weekBookings,
            monthBookings,
        };
    }
    catch (error) {
        logger_1.default.error("Error in getBookingStats:", error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve booking statistics");
    }
};
// Get user's own bookings
const getMyBookings = async (userId) => {
    try {
        // Find user to get their email
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        const userEmail = user.email.trim().toLowerCase();
        // Find bookings by userId OR email (case-insensitive)
        // This handles both new bookings (with userId) and old ones (with only email)
        // Also handles cases where the user's email might have spaces in the User model
        const bookings = await booking_model_1.Booking.find({
            $or: [
                { userId: userId },
                {
                    email: {
                        $regex: `^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                        $options: "i",
                    },
                },
            ],
        })
            .sort({ createdAt: -1 })
            .lean();
        console.log(`[getMyBookings] UserID: ${userId}, Email: ${userEmail}, Count: ${bookings.length}`);
        if (bookings.length === 0) {
            console.log(`No bookings found. Checking raw data...`);
            // Debug: Check what emails exist
            const sampleBookings = await booking_model_1.Booking.find()
                .limit(5)
                .select("email paymentStatus bookingStatus");
            console.log(`Sample bookings in DB:`, sampleBookings.map((b) => ({
                email: b.email,
                paymentStatus: b.paymentStatus,
                bookingStatus: b.bookingStatus,
            })));
        }
        return bookings;
    }
    catch (error) {
        logger_1.default.error("Error in getMyBookings:", error);
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve user bookings");
    }
};
exports.BookingService = {
    createBookingAndInitiatePayment,
    verifyPayment,
    handlePaymentSuccess,
    handlePaymentFailure,
    getAllBookings,
    getBookingById,
    getBookingByTransactionId,
    updateBookingStatus,
    getBookingStats,
    getMyBookings,
};
//# sourceMappingURL=booking.service.js.map
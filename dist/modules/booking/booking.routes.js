"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const booking_validation_1 = require("./booking.validation");
const router = express_1.default.Router();
// Public routes
// Create booking and initiate payment (optional auth - associate with user if logged in)
router.post("/create", (0, auth_1.default)(), (0, zodValidation_1.default)(booking_validation_1.zCreateBooking), booking_controller_1.BookingController.createBooking);
// Payment callback routes (called by SSLCommerz)
// These routes should be publicly accessible as SSLCommerz will call them
router.post("/payment/success", booking_controller_1.BookingController.paymentSuccess);
router.post("/payment/fail", booking_controller_1.BookingController.paymentFail);
router.post("/payment/cancel", booking_controller_1.BookingController.paymentCancel);
router.post("/payment/ipn", booking_controller_1.BookingController.paymentIPN);
// These are also GET routes for browser redirects
router.get("/payment/success", booking_controller_1.BookingController.paymentSuccess);
router.get("/payment/fail", booking_controller_1.BookingController.paymentFail);
router.get("/payment/cancel", booking_controller_1.BookingController.paymentCancel);
// Public route to verify payment (can be used by frontend)
router.get("/verify/:transactionId", booking_controller_1.BookingController.verifyPayment);
// Public route to get booking by transaction ID
router.get("/transaction/:transactionId", booking_controller_1.BookingController.getBookingByTransactionId);
// Protected routes (require authentication)
// User only routes
// Get user's own bookings
router.get("/my-bookings", authMiddleware_1.default, booking_controller_1.BookingController.getMyBookings);
// Admin only routes
// Get all bookings with filters and pagination
router.get("/", authMiddleware_1.default, adminMiddleware_1.default, booking_controller_1.BookingController.getAllBookings);
// Get booking statistics
router.get("/stats", authMiddleware_1.default, adminMiddleware_1.default, booking_controller_1.BookingController.getBookingStats);
// Get booking by ID
router.get("/:id", authMiddleware_1.default, adminMiddleware_1.default, booking_controller_1.BookingController.getBookingById);
// Update booking status
router.patch("/:id/status", authMiddleware_1.default, adminMiddleware_1.default, (0, zodValidation_1.default)(booking_validation_1.zUpdateBookingStatus), booking_controller_1.BookingController.updateBookingStatus);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map
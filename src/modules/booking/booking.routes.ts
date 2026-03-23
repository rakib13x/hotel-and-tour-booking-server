import express from "express";
import { BookingController } from "./booking.controller";
import authMiddleware from "../../middlewares/authMiddleware";
import adminMiddleware from "../../middlewares/adminMiddleware";
import validateRequest from "../../middlewares/zodValidation";
import optionalAuth from "../../middlewares/auth";
import { zCreateBooking, zUpdateBookingStatus } from "./booking.validation";

const router = express.Router();

// Public routes
// Create booking and initiate payment (optional auth - associate with user if logged in)
router.post(
  "/create",
  optionalAuth(),
  validateRequest(zCreateBooking),
  BookingController.createBooking,
);

// Payment callback routes (called by SSLCommerz)
// These routes should be publicly accessible as SSLCommerz will call them
router.post("/payment/success", BookingController.paymentSuccess);
router.post("/payment/fail", BookingController.paymentFail);
router.post("/payment/cancel", BookingController.paymentCancel);
router.post("/payment/ipn", BookingController.paymentIPN);

// These are also GET routes for browser redirects
router.get("/payment/success", BookingController.paymentSuccess);
router.get("/payment/fail", BookingController.paymentFail);
router.get("/payment/cancel", BookingController.paymentCancel);

// Public route to verify payment (can be used by frontend)
router.get("/verify/:transactionId", BookingController.verifyPayment);

// Public route to get booking by transaction ID
router.get(
  "/transaction/:transactionId",
  BookingController.getBookingByTransactionId,
);

// Protected routes (require authentication)
// User only routes
// Get user's own bookings
router.get("/my-bookings", authMiddleware, BookingController.getMyBookings);

// Admin only routes
// Get all bookings with filters and pagination
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  BookingController.getAllBookings,
);

// Get booking statistics
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  BookingController.getBookingStats,
);

// Get booking by ID
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  BookingController.getBookingById,
);

// Update booking status
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  validateRequest(zUpdateBookingStatus),
  BookingController.updateBookingStatus,
);

export default router;

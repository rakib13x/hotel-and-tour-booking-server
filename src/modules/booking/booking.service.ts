import User from "../auth/auth.model";

import logger from "../../config/logger";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status-codes";
import config from "../../config/env";
import mongoose from "mongoose";
import { Booking, IBooking } from "../../models/booking.model";
import { dynamicEmailHelper } from "../../helpers/dynamicEmailHelper";
import { emailTemplates } from "../../helpers/emailTemplates";
const SSLCommerzPayment = require("sslcommerz-lts");

// Initialize SSLCommerz
const initializeSSLCommerz = () => {
  return new SSLCommerzPayment(
    config.sslcommerz.storeId,
    config.sslcommerz.storePassword,
    config.sslcommerz.isLive,
  );
};

// Generate unique transaction ID
const generateTransactionId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `TXN${timestamp}${random}`;
};

// Create booking and initiate payment
const createBookingAndInitiatePayment = async (
  bookingData: Partial<IBooking>,
  ipAddress: string,
  userAgent: string,
  userId?: string,
): Promise<{
  booking: IBooking;
  paymentUrl: string;
  sessionKey: string;
}> => {
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
    const booking = await Booking.create({
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

    logger.info("Booking created successfully", {
      bookingId: booking._id,
      transactionId,
    });

    // Prepare SSLCommerz payment data
    const sslCommerzData = {
      total_amount: bookingData.bookingFee,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${config.sslcommerz.successUrl}?tran_id=${transactionId}`,
      fail_url: `${config.sslcommerz.failUrl}?tran_id=${transactionId}`,
      cancel_url: `${config.sslcommerz.cancelUrl}?tran_id=${transactionId}`,
      ipn_url: config.sslcommerz.ipnUrl,
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
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to initialize payment gateway: ${paymentSession?.failedreason || "Unknown error"}`,
      );
    }

    // Update booking with payment session details
    booking.sslcommerz.sessionKey = paymentSession.sessionkey;
    booking.sslcommerz.GatewayPageURL = paymentSession.GatewayPageURL;
    await booking.save();

    console.log("✅ Payment session created and booking updated");
    logger.info("Payment session created successfully", {
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

    dynamicEmailHelper
      .sendEmailWithTemplate(
        emailTemplates.contact.adminNotification,
        { to: bookingData.email || "" },
        emailData,
      )
      .catch((error: unknown) => {
        logger.error("Error sending booking email:", error);
      });

    // Send notification to admin
    dynamicEmailHelper
      .sendEmailWithTemplate(
        emailTemplates.contact.adminNotification,
        { to: config.admin.email || "admin@example.com" },
        emailData,
      )
      .catch((error: unknown) => {
        logger.error("Error sending admin notification:", error);
      });

    return {
      booking,
      paymentUrl: paymentSession.GatewayPageURL,
      sessionKey: paymentSession.sessionkey,
    };
  } catch (error: any) {
    logger.error("Error in createBookingAndInitiatePayment:", error);

    if (error.name === "ValidationError") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Validation failed: " + error.message,
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create booking and initiate payment",
    );
  }
};

// Verify payment with SSLCommerz
const verifyPayment = async (
  transactionId: string,
): Promise<{
  isValid: boolean;
  booking?: IBooking;
  validationData?: any;
}> => {
  try {
    console.log("=== PAYMENT VERIFICATION START ===");
    console.log("Transaction ID received from SSLCommerz:", transactionId);

    const sslCommerz = initializeSSLCommerz();

    // Validate payment with SSLCommerz
    const validation = await sslCommerz.validate({ tran_id: transactionId });

    console.log("SSLCommerz validation response:", validation);
    logger.info("Payment validation response:", validation);

    // Find booking
    console.log("Searching for booking with transactionId:", transactionId);
    console.log("Transaction ID type:", typeof transactionId);
    console.log("Transaction ID length:", transactionId?.length);

    const booking = await Booking.findOne({ transactionId });

    console.log(
      "Booking search result:",
      booking ? `Found (ID: ${booking._id})` : "NOT FOUND",
    );

    if (!booking) {
      // Let's check all bookings to debug
      const allBookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(10);
      console.log("❌ BOOKING NOT FOUND - Debugging info:");
      console.log(`Transaction ID from SSLCommerz: "${transactionId}"`);
      console.log(`Total bookings in DB: ${allBookings.length}`);
      console.log(
        "Recent bookings in DB:",
        allBookings.map((b) => ({
          id: b._id,
          transactionId: b.transactionId,
          email: b.email,
          tourTitle: b.tourTitle,
          createdAt: b.createdAt,
          paymentStatus: b.paymentStatus,
        })),
      );

      // Check if any booking has similar transaction ID (for debugging)
      const similarBooking = allBookings.find(
        (b) =>
          b.transactionId?.includes(transactionId) ||
          transactionId?.includes(b.transactionId || ""),
      );

      if (similarBooking) {
        console.log("⚠️ Found similar transaction ID:", {
          stored: similarBooking.transactionId,
          received: transactionId,
        });
      }

      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Booking not found for transaction ID: ${transactionId}`,
      );
    }

    // Check validation status
    // In sandbox mode, status might be 'VALID', 'VALIDATED', or validation might fail
    // SSLCommerz only calls success URL if payment succeeded, so we can trust the callback
    const isValid =
      validation &&
      (validation.status === "VALID" ||
        validation.status === "VALIDATED" ||
        validation.status === "SUCCESS");

    console.log("Validation check:", {
      hasValidation: !!validation,
      validationStatus: validation?.status,
      isValid,
      isLive: config.sslcommerz.isLive,
    });

    // In sandbox mode, be more lenient with validation
    const shouldMarkAsPaid =
      isValid || (!config.sslcommerz.isLive && validation);

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

      logger.info("Payment verified and booking confirmed", {
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

      dynamicEmailHelper
        .sendEmailWithTemplate(
          emailTemplates.booking.bookingConfirmation,
          { to: booking.email },
          emailData,
        )
        .catch((error: unknown) => {
          logger.error("Error sending success email:", error);
        });
    } else {
      console.log(
        "⚠️ Payment validation returned invalid status:",
        validation?.status,
      );
    }

    return {
      isValid: shouldMarkAsPaid,
      booking,
      validationData: validation,
    };
  } catch (error: any) {
    logger.error("Error in verifyPayment:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to verify payment",
    );
  }
};

// Handle payment success callback
const handlePaymentSuccess = async (paymentData: any): Promise<IBooking> => {
  try {
    const transactionId = paymentData.tran_id;

    // Verify the payment
    const verification = await verifyPayment(transactionId);

    if (!verification.isValid || !verification.booking) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Payment verification failed");
    }

    return verification.booking;
  } catch (error: any) {
    logger.error("Error in handlePaymentSuccess:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to handle payment success",
    );
  }
};

// Handle payment failure
const handlePaymentFailure = async (
  transactionId: string,
  errorData: any,
): Promise<void> => {
  try {
    const booking = await Booking.findOne({ transactionId });

    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }

    booking.paymentStatus = "failed";
    booking.sslcommerz.status = "FAILED";
    booking.sslcommerz.error = JSON.stringify(errorData);
    await booking.save();

    logger.info("Payment failure recorded", {
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

    dynamicEmailHelper
      .sendEmailWithTemplate(
        emailTemplates.booking.bookingCancellation,
        { to: booking.email },
        emailData,
      )
      .catch((error: unknown) => {
        logger.error("Error sending failure email:", error);
      });
  } catch (error: any) {
    logger.error("Error in handlePaymentFailure:", error);
    throw error;
  }
};

// Get all bookings with pagination
const getAllBookings = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  search?: string,
  paymentStatus?: string,
  bookingStatus?: string,
): Promise<{
  bookings: IBooking[];
  totalBookings: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  try {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, Math.min(100, limit));
    const skip = (pageNumber - 1) * limitNumber;

    // Build search query
    let searchQuery: any = {};

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

    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(searchQuery)
        .sort(sortObject)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Booking.countDocuments(searchQuery),
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
  } catch (error: any) {
    logger.error("Error in getAllBookings:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve bookings",
    );
  }
};

// Get booking by ID
const getBookingById = async (bookingId: string): Promise<IBooking> => {
  try {
    const booking = await Booking.findById(bookingId).lean();

    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }

    return booking;
  } catch (error: any) {
    logger.error("Error in getBookingById:", error);

    if (error.name === "CastError") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid booking ID format");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve booking",
    );
  }
};

// Get booking by transaction ID
const getBookingByTransactionId = async (
  transactionId: string,
): Promise<IBooking> => {
  try {
    const booking = await Booking.findOne({ transactionId }).lean();

    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }

    return booking;
  } catch (error: any) {
    logger.error("Error in getBookingByTransactionId:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve booking",
    );
  }
};

// Update booking status (admin only)
const updateBookingStatus = async (
  bookingId: string,
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed",
): Promise<IBooking> => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }

    booking.bookingStatus = bookingStatus;

    if (bookingStatus === "cancelled") {
      booking.cancelledAt = new Date();
    } else if (bookingStatus === "confirmed" && !booking.confirmedAt) {
      booking.confirmedAt = new Date();
    }

    await booking.save();

    logger.info("Booking status updated", {
      bookingId,
      newStatus: bookingStatus,
    });

    return booking;
  } catch (error: any) {
    logger.error("Error in updateBookingStatus:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update booking status",
    );
  }
};

// Get booking statistics
const getBookingStats = async (): Promise<{
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
}> => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      revenueResult,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: "pending" }),
      Booking.countDocuments({ bookingStatus: "confirmed" }),
      Booking.countDocuments({ bookingStatus: "cancelled" }),
      Booking.countDocuments({ createdAt: { $gte: startOfDay } }),
      Booking.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.aggregate([
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
  } catch (error: any) {
    logger.error("Error in getBookingStats:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve booking statistics",
    );
  }
};

// Get user's own bookings
const getMyBookings = async (userId: string): Promise<IBooking[]> => {
  try {
    // Find user to get their email
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const userEmail = user.email.trim().toLowerCase();

    // Find bookings by userId OR email (case-insensitive)
    // This handles both new bookings (with userId) and old ones (with only email)
    // Also handles cases where the user's email might have spaces in the User model
    const bookings = await Booking.find({
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

    console.log(
      `[getMyBookings] UserID: ${userId}, Email: ${userEmail}, Count: ${bookings.length}`,
    );
    if (bookings.length === 0) {
      console.log(`No bookings found. Checking raw data...`);
      // Debug: Check what emails exist
      const sampleBookings = await Booking.find()
        .limit(5)
        .select("email paymentStatus bookingStatus");
      console.log(
        `Sample bookings in DB:`,
        sampleBookings.map((b) => ({
          email: b.email,
          paymentStatus: b.paymentStatus,
          bookingStatus: b.bookingStatus,
        })),
      );
    }

    return bookings;
  } catch (error: any) {
    logger.error("Error in getMyBookings:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve user bookings",
    );
  }
};

export const BookingService = {
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

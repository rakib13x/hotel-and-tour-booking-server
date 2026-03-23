import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { BookingService } from "./booking.service";
import logger from "../../config/logger";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ApiError from "../../utils/ApiError";
import config from "../../config/env";

// Create booking and initiate payment
const createBooking = catchAsync(async (req: Request, res: Response) => {
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
  const ipAddress = (req.headers['x-forwarded-for'] as string) ||
                   (req.headers['x-real-ip'] as string) ||
                   req.ip ||
                   req.socket.remoteAddress ||
                   'unknown';

  const userAgent = req.headers['user-agent'] || 'unknown';

  const result = await BookingService.createBookingAndInitiatePayment(
    bookingData,
    ipAddress,
    userAgent,
    userId
  );
  console.log('✅ Booking service returned:', {
    bookingId: result.booking._id,
    transactionId: result.booking.transactionId,
    paymentUrl: result.paymentUrl ? 'Generated' : 'MISSING',
  });

  logger.info('Booking created via API', {
    bookingId: result.booking._id,
    transactionId: result.booking.transactionId,
    ip: ipAddress,
  });

  sendResponse(res, httpStatus.CREATED, {
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
const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
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
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Transaction ID is missing from payment callback'
    );
  }
  
  logger.info('Payment success callback received', { paymentData });

  const booking = await BookingService.handlePaymentSuccess(paymentData);

  // Redirect to frontend success page with booking details
  const frontendUrl = config.cors.origin || 'http://localhost:3000';
  const redirectUrl = `${frontendUrl}/booking-success?bookingId=${booking._id}&transactionId=${booking.transactionId}`;
  
  console.log('✅ Payment successful, redirecting to:', redirectUrl);
  
  // Redirect instead of JSON response for better UX
  res.redirect(redirectUrl);
});

// Payment failure callback
const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const paymentData = { ...req.query, ...req.body };
  const tran_id = paymentData.tran_id;

  console.log('=== PAYMENT FAILURE CALLBACK ===');
  console.log('Transaction ID:', tran_id);
  console.log('Error data:', paymentData);

  logger.warn('Payment failure callback received', { 
    transactionId: tran_id,
    errorData: paymentData 
  });

  await BookingService.handlePaymentFailure(tran_id as string, paymentData);

  // Redirect to frontend failure page
  const frontendUrl = config.cors.origin || 'http://localhost:3000';
  const redirectUrl = `${frontendUrl}/booking-failed?transactionId=${tran_id}`;
  
  console.log('Redirecting to failure page:', redirectUrl);
  res.redirect(redirectUrl);
});

// Payment cancellation callback
const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const paymentData = { ...req.query, ...req.body };
  const tran_id = paymentData.tran_id;

  console.log('=== PAYMENT CANCELLATION CALLBACK ===');
  console.log('Transaction ID:', tran_id);

  logger.info('Payment cancellation callback received', { transactionId: tran_id });

  await BookingService.handlePaymentFailure(tran_id as string, {
    error: 'Payment cancelled by user',
  });

  // Redirect to frontend cancellation page
  const frontendUrl = config.cors.origin || 'http://localhost:3000';
  const redirectUrl = `${frontendUrl}/booking-cancelled?transactionId=${tran_id}`;
  
  console.log('Redirecting to cancellation page:', redirectUrl);
  res.redirect(redirectUrl);
});

// IPN (Instant Payment Notification) callback
const paymentIPN = catchAsync(async (req: Request, res: Response) => {
  const ipnData = req.body;

  logger.info('IPN callback received', { ipnData });

  // Verify the payment
  const transactionId = ipnData.tran_id;
  const verification = await BookingService.verifyPayment(transactionId);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "IPN processed successfully.",
    data: {
      transactionId,
      isValid: verification.isValid,
    },
  });
});

// Get all bookings (Admin only)
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
    paymentStatus,
    bookingStatus,
  } = req.query;

  const result = await BookingService.getAllBookings(
    Number(page),
    Number(limit),
    sortBy as string,
    sortOrder as 'asc' | 'desc',
    search as string,
    paymentStatus as string,
    bookingStatus as string
  );

  sendResponse(res, httpStatus.OK, {
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
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  console.log('=== GET MY BOOKINGS API CALLED ===');
  console.log('User ID from token:', userId);

  if (!userId) {
    console.error('❌ No user ID found in request!');
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const bookings = await BookingService.getMyBookings(userId);
  console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);

  sendResponse(res, httpStatus.OK, {
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
const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const booking = await BookingService.getBookingById(id);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Booking retrieved successfully.",
    data: booking,
  });
});

// Get booking by transaction ID
const getBookingByTransactionId = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.params.transactionId as string;

  const booking = await BookingService.getBookingByTransactionId(transactionId);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Booking retrieved successfully.",
    data: booking,
  });
});

// Verify payment status
const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.params.transactionId as string;

  const verification = await BookingService.verifyPayment(transactionId);

  sendResponse(res, httpStatus.OK, {
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
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { bookingStatus } = req.body;

  const booking = await BookingService.updateBookingStatus(id, bookingStatus);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Booking status updated successfully.",
    data: booking,
  });
});

// Get booking statistics (Admin only)
const getBookingStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await BookingService.getBookingStats();

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Booking statistics retrieved successfully.",
    data: stats,
  });
});

export const BookingController = {
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


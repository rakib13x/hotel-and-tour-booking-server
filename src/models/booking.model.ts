import mongoose, { Schema, model } from "mongoose";

export interface IBooking {
  _id?: string;
  // User Association (Optional for guest bookings)
  userId?: string;
  
  // Customer Information
  name: string;
  email: string;
  phone: string;
  message?: string;
  
  // Tour Information
  tourId: string;
  tourTitle: string;
  destination: string;
  duration: number;
  validFrom: string;
  validTo: string;
  
  // Payment Information
  bookingFee: number;
  transactionId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentGateway?: string;
  
  // SSLCommerz Transaction Data
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
  
  // Booking Status
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  
  // Security Fields
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  paidAt?: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    // User Association (Optional for guest bookings)
    userId: {
      type: String,
      index: true,
    },
    // Customer Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    
    // Tour Information
    tourId: {
      type: String,
      required: [true, "Tour ID is required"],
      index: true,
    },
    tourTitle: {
      type: String,
      required: [true, "Tour title is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"],
    },
    validFrom: {
      type: String,
      required: [true, "Valid from date is required"],
    },
    validTo: {
      type: String,
      required: [true, "Valid to date is required"],
    },
    
    // Payment Information
    bookingFee: {
      type: Number,
      required: [true, "Booking fee is required"],
      min: [0, "Booking fee cannot be negative"],
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    paymentGateway: {
      type: String,
      default: 'SSLCommerz',
      trim: true,
    },
    
    // SSLCommerz Transaction Data
    sslcommerz: {
      sessionKey: String,
      GatewayPageURL: String,
      transactionId: String,
      amount: Number,
      currency: String,
      bankTransactionId: String,
      cardType: String,
      cardNo: String,
      cardIssuer: String,
      cardBrand: String,
      cardCategory: String,
      storeAmount: Number,
      validatedOn: Date,
      status: String,
      error: String,
    },
    
    // Booking Status
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    
    // Security Fields
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    
    // Payment Timestamps
    paidAt: {
      type: Date,
    },
    confirmedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create compound indexes for better query performance
bookingSchema.index({ email: 1, createdAt: -1 });
bookingSchema.index({ transactionId: 1, paymentStatus: 1 });
bookingSchema.index({ bookingStatus: 1, createdAt: -1 });
bookingSchema.index({ tourId: 1, bookingStatus: 1 });

// Pre-save middleware for security
bookingSchema.pre('save', function(next) {
  // Sanitize sensitive data before saving
  if (this.sslcommerz && this.sslcommerz.cardNo) {
    // Mask card number, keeping only last 4 digits
    const cardNo = this.sslcommerz.cardNo;
    if (cardNo.length > 4) {
      this.sslcommerz.cardNo = '**** **** **** ' + cardNo.slice(-4);
    }
  }
  next();
});

export const Booking =
  (mongoose.models.Booking as mongoose.Model<IBooking>) ||
  model<IBooking>("Booking", bookingSchema);



import mongoose, { Schema, model } from "mongoose";

export interface IQuery {
  _id?: string;

  // Form identification
  formType: "hajj_umrah" | "package_tour" | "group_ticket";

  // Common fields
  name: string;
  email: string;
  contactNumber: string;
  startingDate: Date;
  returnDate: Date;
  airlineTicketCategory: "economy" | "business" | "first_class";
  specialRequirements?: string;

  // Hajj & Umrah specific fields
  nightsStayMakkah?: number;
  nightsStayMadinah?: number;
  maleAdults?: number;
  femaleAdults?: number;
  childs?: number;
  accommodationType?: "2_star" | "3_star" | "4_star" | "5_star";
  foodsIncluded?: boolean;
  guideRequired?: boolean;
  privateTransportation?: boolean;

  // Package Tour specific fields
  visitingCountry?: string;
  visitingCities?: string;

  // Group Ticket specific fields
  totalPassengers?: number;

  // Query Status
  status: "pending" | "reviewed" | "contacted" | "closed";

  createdAt?: Date;
  updatedAt?: Date;
}

const querySchema = new Schema<IQuery>(
  {
    // Form identification
    formType: {
      type: String,
      enum: ["hajj_umrah", "package_tour", "group_ticket"],
      required: [true, "Form type is required"],
    },

    // Common fields
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      maxlength: [20, "Contact number cannot exceed 20 characters"],
    },
    startingDate: {
      type: Date,
      required: [true, "Starting date is required"],
    },
    returnDate: {
      type: Date,
      required: [true, "Return date is required"],
      validate: {
        validator: function (this: IQuery, value: Date) {
          return value > this.startingDate;
        },
        message: "Return date must be after starting date",
      },
    },
    airlineTicketCategory: {
      type: String,
      enum: ["economy", "business", "first_class"],
      required: [true, "Airline ticket category is required"],
    },
    specialRequirements: {
      type: String,
      trim: true,
      maxlength: [1000, "Special requirements cannot exceed 1000 characters"],
    },

    // Hajj & Umrah specific fields
    nightsStayMakkah: {
      type: Number,
      default: 0,
      min: [0, "Nights stay in Makkah cannot be negative"],
    },
    nightsStayMadinah: {
      type: Number,
      default: 0,
      min: [0, "Nights stay in Madinah cannot be negative"],
    },
    maleAdults: {
      type: Number,
      default: 0,
      min: [0, "Male adults count cannot be negative"],
    },
    femaleAdults: {
      type: Number,
      default: 0,
      min: [0, "Female adults count cannot be negative"],
    },
    childs: {
      type: Number,
      default: 0,
      min: [0, "Children count cannot be negative"],
    },
    accommodationType: {
      type: String,
      enum: ["2_star", "3_star", "4_star", "5_star"],
    },
    foodsIncluded: {
      type: Boolean,
      default: false,
    },
    guideRequired: {
      type: Boolean,
      default: false,
    },
    privateTransportation: {
      type: Boolean,
      default: false,
    },

    // Package Tour specific fields
    visitingCountry: {
      type: String,
      trim: true,
      maxlength: [100, "Visiting country cannot exceed 100 characters"],
    },
    visitingCities: {
      type: String,
      trim: true,
      maxlength: [500, "Visiting cities cannot exceed 500 characters"],
    },

    // Group Ticket specific fields
    totalPassengers: {
      type: Number,
      default: 0,
      min: [0, "Total passengers cannot be negative"],
    },

    // Query Status
    status: {
      type: String,
      enum: ["pending", "reviewed", "contacted", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for better query performance
querySchema.index({ createdAt: -1 });
querySchema.index({ status: 1 });
querySchema.index({ formType: 1 });
querySchema.index({ email: 1 });

export const Query =
  (mongoose.models.Query as mongoose.Model<IQuery>) ||
  model<IQuery>("Query", querySchema);

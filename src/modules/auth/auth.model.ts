import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string | null;
  email: string;
  phone: string | null;
  profileImg: string | null;
  password?: string;
  googleId?: string;
  status: "active" | "block" | "deactive";
  role: "admin" | "user" | "super_admin";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
    },
    profileImg: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["active", "block", "deactive"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["admin", "user", "super_admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Password hashing + comparePassword method

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;

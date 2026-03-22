import { StatusCodes } from "http-status-codes";

import { LoginInput, RegisterInput } from "./auth.interface";
import User, { IUser } from "./auth.model";
import ApiError from "../../utils/ApiError";
import generateToken from "../../utils/generateToken";

class AuthService {
  async register(
    input: RegisterInput,
  ): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    const user = new User({ ...input, role: "user" });
    await user.save();

    const token = generateToken((user._id as any).toString(), user.role);

    // Fetch user without password for response
    const userWithoutPassword = await User.findById(user._id).select(
      "-password",
    );
    return { user: userWithoutPassword!, token };
  }
  async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
    console.log(input, "this is input");
    const user = await User.findOne({ email: input.email }).select("+password");
    console.log(user);
    if (!user) throw new ApiError(400, "Invalid email or password");

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) throw new ApiError(400, "Invalid email or password");

    const token = generateToken((user._id as any).toString(), user.role);

    // Fetch user without password for response
    const userWithoutPassword = await User.findById(user._id).select(
      "-password",
    );
    return { user: userWithoutPassword!, token };
  }

  async updateProfile(userId: string, updateData: any): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // If email is being updated, check if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "User with this email already exists",
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return updatedUser;
  }

  // Default admin creation
  async createDefaultAdmin() {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "admin123";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new User({
        name: "super_admin",
        email: adminEmail,
        password: adminPassword,
        role: "super_admin",
      });
      await admin.save();
      console.log("✅ Default admin user created");
    }
  }
}

export default new AuthService();

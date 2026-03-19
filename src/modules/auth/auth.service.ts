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

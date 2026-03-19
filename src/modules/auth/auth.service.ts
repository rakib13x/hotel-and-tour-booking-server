import { StatusCodes } from "http-status-codes";

import { LoginInput, RegisterInput } from "./auth.interface";
import User, { IUser } from "./auth.model";
import ApiError from "../../utils/ApiError";
import generateToken from "../../utils/generateToken";

class AuthService {
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

import { Request, Response } from "express";
import AuthService from "./auth.service";
import generateToken from "../../utils/generateToken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

class AuthController {
  register = catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json({ success: true, user, token });
  });
  login = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body);
    const { user, token } = await AuthService.login(req.body);
    res.status(200).json({ success: true, user, token });
  });
  updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, 401, {
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await AuthService.updateProfile(userId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  });

  changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, 401, {
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await AuthService.changePassword(userId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  });

  uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, 401, {
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return sendResponse(res, 400, {
        success: false,
        message: "Profile image file is required",
      });
    }

    // Get image URL from Cloudinary upload
    const imageUrl = req.file.path;

    // Update user profile with new image URL
    const result = await AuthService.updateProfile(userId, {
      profileImg: imageUrl,
    });

    sendResponse(res, 200, {
      success: true,
      message: "Profile image uploaded successfully",
      data: result,
    });
  });

  googleCallback = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as any;
    console.log(user, "this is user");

    if (!user) {
      // Redirect to frontend with error
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/google/callback?error=authentication_failed`,
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Prepare user data (exclude sensitive fields)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImg: user.profileImg,
      status: user.status,
    };

    // Redirect to frontend with token and user data
    const encodedUser = encodeURIComponent(JSON.stringify(userData));
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/google/callback?token=${token}&user=${encodedUser}`,
    );
  });
}

export default new AuthController();

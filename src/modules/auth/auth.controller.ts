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
}

export default new AuthController();

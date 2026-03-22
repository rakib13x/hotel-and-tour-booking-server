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
}

export default new AuthController();

import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');
import ApiError from '../utils/ApiError';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error: any) => error.msg);
    return next(new ApiError(400, errorMessages.join(', ')));
  }
  
  next();
};

export default validateRequest;
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate route parameters
      if (req.params && Object.keys(req.params).length > 0) {
        req.params = schema.parse(req.params) as any;
      }
      
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Parameter validation error',
        errors: error.errors || [error.message]
      });
    }
  };
};

export default validateParams;

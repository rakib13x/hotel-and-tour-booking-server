import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
declare const validateRequest: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validateRequest;
//# sourceMappingURL=zodValidation.d.ts.map
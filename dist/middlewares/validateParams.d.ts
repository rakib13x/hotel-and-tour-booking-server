import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
declare const validateParams: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validateParams;
//# sourceMappingURL=validateParams.d.ts.map
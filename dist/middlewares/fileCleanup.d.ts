import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to clean up uploaded files after processing
 * This should be used after Cloudinary upload to remove local files
 */
export declare const cleanupUploadedFiles: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Direct function to clean up files (can be called from controller)
 */
export declare const fileCleanup: (req: Request) => void;
export default cleanupUploadedFiles;
//# sourceMappingURL=fileCleanup.d.ts.map
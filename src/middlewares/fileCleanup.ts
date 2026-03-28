import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

/**
 * Middleware to clean up uploaded files after processing
 * This should be used after Cloudinary upload to remove local files
 */
export const cleanupUploadedFiles = (req: Request, res: Response, next: NextFunction) => {
  // Store original res.json to intercept the response
  const originalJson = res.json;

  res.json = function(body: any) {
    // Clean up files after successful response
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cleanupFiles(req);
    }
    
    // Call original json method
    return originalJson.call(this, body);
  };

  next();
};

/**
 * Clean up uploaded files from the request
 */
const cleanupFiles = (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const file = req.file as Express.Multer.File | undefined;

  // Clean up single file (only if it has a path - not in-memory)
  if (file && file.path) {
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  // Clean up multiple files from different fields (only if they have paths - not in-memory)
  if (files) {
    Object.values(files).forEach(fileArray => {
      if (Array.isArray(fileArray)) {
        fileArray.forEach(file => {
          if (file.path) {
            try {
              fs.unlinkSync(file.path);
            } catch (error) {
              console.error('Error deleting file:', error);
            }
          }
        });
      }
    });
  }
};

/**
 * Direct function to clean up files (can be called from controller)
 */
export const fileCleanup = (req: Request) => {
  cleanupFiles(req);
};

export default cleanupUploadedFiles;
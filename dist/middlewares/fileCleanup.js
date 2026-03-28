"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileCleanup = exports.cleanupUploadedFiles = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Middleware to clean up uploaded files after processing
 * This should be used after Cloudinary upload to remove local files
 */
const cleanupUploadedFiles = (req, res, next) => {
    // Store original res.json to intercept the response
    const originalJson = res.json;
    res.json = function (body) {
        // Clean up files after successful response
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cleanupFiles(req);
        }
        // Call original json method
        return originalJson.call(this, body);
    };
    next();
};
exports.cleanupUploadedFiles = cleanupUploadedFiles;
/**
 * Clean up uploaded files from the request
 */
const cleanupFiles = (req) => {
    const files = req.files;
    const file = req.file;
    // Clean up single file (only if it has a path - not in-memory)
    if (file && file.path) {
        try {
            fs_1.default.unlinkSync(file.path);
        }
        catch (error) {
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
                            fs_1.default.unlinkSync(file.path);
                        }
                        catch (error) {
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
const fileCleanup = (req) => {
    cleanupFiles(req);
};
exports.fileCleanup = fileCleanup;
exports.default = exports.cleanupUploadedFiles;
//# sourceMappingURL=fileCleanup.js.map
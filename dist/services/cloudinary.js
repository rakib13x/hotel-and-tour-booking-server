"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("../config/env"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: env_1.default.cloudinary.cloudName,
    api_key: env_1.default.cloudinary.apiKey,
    api_secret: env_1.default.cloudinary.apiSecret,
});
// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
    const { cloudName, apiKey, apiSecret } = env_1.default.cloudinary;
    console.log("=== CLOUDINARY CONFIG DEBUG ===");
    console.log("Cloud Name:", cloudName || "MISSING");
    console.log("API Key:", apiKey ? "SET" : "MISSING");
    console.log("API Secret:", apiSecret ? "SET" : "MISSING");
    console.log("=== END CLOUDINARY CONFIG ===");
    if (!cloudName || !apiKey || !apiSecret) {
        console.error("Cloudinary configuration missing:", {
            cloudName: !!cloudName,
            apiKey: !!apiKey,
            apiSecret: !!apiSecret,
        });
        console.error("Please add these environment variables to your .env file:");
        console.error("CLOUDINARY_CLOUD_NAME=your_cloud_name");
        console.error("CLOUDINARY_API_KEY=your_api_key");
        console.error("CLOUDINARY_API_SECRET=your_api_secret");
        throw new Error("Cloudinary configuration is incomplete. Please check your environment variables.");
    }
};
// Validate on module load
validateCloudinaryConfig();
class CloudinaryService {
    /**
     * Upload a single image to Cloudinary from buffer
     */
    async uploadImage(file, options = {}) {
        try {
            // Validate input
            if (!file) {
                throw new Error("No file provided for upload");
            }
            const uploadOptions = {
                folder: options.folder || "uploads",
                resource_type: options.resource_type || "image",
                quality: options.quality || "auto:best",
            };
            if (options.public_id)
                uploadOptions.public_id = options.public_id;
            if (options.transformation)
                uploadOptions.transformation = options.transformation;
            if (options.format)
                uploadOptions.format = options.format;
            // Handle both file objects and buffers
            const fileData = Buffer.isBuffer(file) ? file : file.buffer;
            if (!fileData || fileData.length === 0) {
                throw new Error("File buffer is empty or invalid");
            }
            console.log("Uploading to Cloudinary with options:", {
                folder: uploadOptions.folder,
                resource_type: uploadOptions.resource_type,
                fileSize: fileData.length,
            });
            const result = await cloudinary_1.v2.uploader.upload(`data:image/jpeg;base64,${fileData.toString("base64")}`, uploadOptions);
            return {
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                resource_type: result.resource_type,
            };
        }
        catch (error) {
            console.error("Cloudinary upload error:", error);
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else if (typeof error === "object" && error !== null) {
                errorMessage = JSON.stringify(error);
            }
            else {
                errorMessage = String(error);
            }
            throw new Error(`Cloudinary upload failed: ${errorMessage}`);
        }
    }
    /**
     * Upload multiple images to Cloudinary
     */
    async uploadMultipleImages(files, options = {}) {
        try {
            const uploadPromises = files.map((file) => this.uploadImage(file, options));
            return await Promise.all(uploadPromises);
        }
        catch (error) {
            throw new Error(`Cloudinary multiple upload failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete an image from Cloudinary
     */
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result.result === "ok";
        }
        catch (error) {
            throw new Error(`Cloudinary delete failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete multiple images from Cloudinary
     */
    async deleteMultipleImages(publicIds) {
        try {
            const result = await cloudinary_1.v2.api.delete_resources(publicIds);
            return result.deleted && Object.keys(result.deleted).length > 0;
        }
        catch (error) {
            throw new Error(`Cloudinary multiple delete failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get image URL with transformations
     */
    getImageUrl(publicId, transformations) {
        return cloudinary_1.v2.url(publicId, {
            ...transformations,
            secure: true,
        });
    }
    /**
     * Generate a signed upload URL for direct client uploads
     */
    generateSignedUploadUrl(folder = "uploads", publicId, transformations) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicIdToUse = publicId || `image_${timestamp}`;
        const signature = cloudinary_1.v2.utils.api_sign_request({
            public_id: publicIdToUse,
            folder,
            timestamp,
            ...transformations,
        }, env_1.default.cloudinary.apiSecret);
        const url = `https://api.cloudinary.com/v1_1/${env_1.default.cloudinary.cloudName}/image/upload`;
        return {
            url: `${url}?signature=${signature}&timestamp=${timestamp}&api_key=${env_1.default.cloudinary.apiKey}`,
            publicId: publicIdToUse,
        };
    }
}
// Convenience function for backward compatibility
const uploadImageToCloudinary = async (buffer, folder = "uploads") => {
    // Validate buffer before proceeding
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Invalid or empty buffer provided for upload");
    }
    const result = await cloudinaryService.uploadImage(buffer, { folder });
    return result.secure_url;
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
const cloudinaryService = new CloudinaryService();
exports.default = cloudinaryService;
//# sourceMappingURL=cloudinary.js.map
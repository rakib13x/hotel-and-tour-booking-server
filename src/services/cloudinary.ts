import { v2 as cloudinary } from "cloudinary";
import config from "../config/env";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
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
    throw new Error(
      "Cloudinary configuration is incomplete. Please check your environment variables."
    );
  }
};

// Validate on module load
validateCloudinaryConfig();

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any;
  resource_type?: "image" | "video" | "raw" | "auto";
  quality?: string | number;
  format?: string;
}

class CloudinaryService {
  /**
   * Upload a single image to Cloudinary from buffer
   */
  async uploadImage(
    file: Express.Multer.File | Buffer,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Validate input
      if (!file) {
        throw new Error("No file provided for upload");
      }

      const uploadOptions: any = {
        folder: options.folder || "uploads",
        resource_type: options.resource_type || "image",
        quality: options.quality || "auto:best",
      };

      if (options.public_id) uploadOptions.public_id = options.public_id;
      if (options.transformation)
        uploadOptions.transformation = options.transformation;
      if (options.format) uploadOptions.format = options.format;

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

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${fileData.toString("base64")}`,
        uploadOptions
      );

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      let errorMessage = "Unknown error";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }

      throw new Error(`Cloudinary upload failed: ${errorMessage}`);
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  async uploadMultipleImages(
    files: Express.Multer.File[],
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, options)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(
        `Cloudinary multiple upload failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      throw new Error(
        `Cloudinary delete failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Delete multiple images from Cloudinary
   */
  async deleteMultipleImages(publicIds: string[]): Promise<boolean> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result.deleted && Object.keys(result.deleted).length > 0;
    } catch (error) {
      throw new Error(
        `Cloudinary multiple delete failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get image URL with transformations
   */
  getImageUrl(publicId: string, transformations?: any): string {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true,
    });
  }

  /**
   * Generate a signed upload URL for direct client uploads
   */
  generateSignedUploadUrl(
    folder: string = "uploads",
    publicId?: string,
    transformations?: any
  ): { url: string; publicId: string } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicIdToUse = publicId || `image_${timestamp}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: publicIdToUse,
        folder,
        timestamp,
        ...transformations,
      },
      config.cloudinary.apiSecret
    );

    const url = `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`;

    return {
      url: `${url}?signature=${signature}&timestamp=${timestamp}&api_key=${config.cloudinary.apiKey}`,
      publicId: publicIdToUse,
    };
  }
}

// Convenience function for backward compatibility
export const uploadImageToCloudinary = async (
  buffer: Buffer,
  folder: string = "uploads"
): Promise<string> => {
  // Validate buffer before proceeding
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Invalid or empty buffer provided for upload");
  }

  const result = await cloudinaryService.uploadImage(buffer, { folder });
  return result.secure_url;
};

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;

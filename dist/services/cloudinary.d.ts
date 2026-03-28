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
declare class CloudinaryService {
    /**
     * Upload a single image to Cloudinary from buffer
     */
    uploadImage(file: Express.Multer.File | Buffer, options?: CloudinaryUploadOptions): Promise<CloudinaryUploadResult>;
    /**
     * Upload multiple images to Cloudinary
     */
    uploadMultipleImages(files: Express.Multer.File[], options?: CloudinaryUploadOptions): Promise<CloudinaryUploadResult[]>;
    /**
     * Delete an image from Cloudinary
     */
    deleteImage(publicId: string): Promise<boolean>;
    /**
     * Delete multiple images from Cloudinary
     */
    deleteMultipleImages(publicIds: string[]): Promise<boolean>;
    /**
     * Get image URL with transformations
     */
    getImageUrl(publicId: string, transformations?: any): string;
    /**
     * Generate a signed upload URL for direct client uploads
     */
    generateSignedUploadUrl(folder?: string, publicId?: string, transformations?: any): {
        url: string;
        publicId: string;
    };
}
export declare const uploadImageToCloudinary: (buffer: Buffer, folder?: string) => Promise<string>;
declare const cloudinaryService: CloudinaryService;
export default cloudinaryService;
//# sourceMappingURL=cloudinary.d.ts.map
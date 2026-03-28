import { CloudinaryUploadResult } from '../services/cloudinary';
export interface ImageUploadParams {
    file: Express.Multer.File;
    folder?: string;
    publicId?: string;
    quality?: string | number;
    format?: string;
    transformations?: any;
}
export interface MultipleImageUploadParams {
    files: Express.Multer.File[];
    folder?: string;
    quality?: string | number;
    format?: string;
    transformations?: any;
}
/**
 * Upload a single image and return the result
 */
export declare const uploadImage: (params: ImageUploadParams) => Promise<CloudinaryUploadResult>;
/**
 * Upload multiple images and return the results
 */
export declare const uploadMultipleImages: (params: MultipleImageUploadParams) => Promise<CloudinaryUploadResult[]>;
/**
 * Delete an image by public ID
 */
export declare const deleteImage: (publicId: string) => Promise<boolean>;
/**
 * Delete multiple images by public IDs
 */
export declare const deleteMultipleImages: (publicIds: string[]) => Promise<boolean>;
/**
 * Get image URL with transformations
 */
export declare const getImageUrl: (publicId: string, transformations?: any) => string;
/**
 * Generate a signed upload URL for direct client uploads
 */
export declare const generateSignedUploadUrl: (folder?: string, publicId?: string, transformations?: any) => {
    url: string;
    publicId: string;
};
/**
 * Common image transformations
 */
export declare const imageTransformations: {
    thumbnail: {
        width: number;
        height: number;
        crop: string;
        quality: string;
    };
    medium: {
        width: number;
        height: number;
        crop: string;
        quality: string;
    };
    large: {
        width: number;
        height: number;
        crop: string;
        quality: string;
    };
    avatar: {
        width: number;
        height: number;
        crop: string;
        gravity: string;
        quality: string;
    };
    banner: {
        width: number;
        height: number;
        crop: string;
        quality: string;
    };
};
/**
 * Get transformed image URL for common use cases
 */
export declare const getTransformedImageUrl: (publicId: string, size: keyof typeof imageTransformations) => string;
//# sourceMappingURL=imageUtils.d.ts.map
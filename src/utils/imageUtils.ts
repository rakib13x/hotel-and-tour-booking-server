import cloudinaryService from '../services/cloudinary';
import { CloudinaryUploadOptions, CloudinaryUploadResult } from '../services/cloudinary';

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
export const uploadImage = async (params: ImageUploadParams): Promise<CloudinaryUploadResult> => {
  const { file, folder, publicId, quality, format, transformations } = params;
  
  const options: CloudinaryUploadOptions = {
    folder: folder || 'uploads',
    ...(publicId && { public_id: publicId }),
    quality: quality || 'auto',
    ...(format && { format }),
    ...(transformations && { transformation: transformations }),
  };

  return await cloudinaryService.uploadImage(file, options);
};

/**
 * Upload multiple images and return the results
 */
export const uploadMultipleImages = async (params: MultipleImageUploadParams): Promise<CloudinaryUploadResult[]> => {
  const { files, folder, quality, format, transformations } = params;
  
  const options: CloudinaryUploadOptions = {
    folder: folder || 'uploads',
    quality: quality || 'auto',
    ...(format && { format }),
    ...(transformations && { transformation: transformations }),
  };

  return await cloudinaryService.uploadMultipleImages(files, options);
};

/**
 * Delete an image by public ID
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  return await cloudinaryService.deleteImage(publicId);
};

/**
 * Delete multiple images by public IDs
 */
export const deleteMultipleImages = async (publicIds: string[]): Promise<boolean> => {
  return await cloudinaryService.deleteMultipleImages(publicIds);
};

/**
 * Get image URL with transformations
 */
export const getImageUrl = (publicId: string, transformations?: any): string => {
  return cloudinaryService.getImageUrl(publicId, transformations);
};

/**
 * Generate a signed upload URL for direct client uploads
 */
export const generateSignedUploadUrl = (folder?: string, publicId?: string, transformations?: any) => {
  return cloudinaryService.generateSignedUploadUrl(folder, publicId, transformations);
};

/**
 * Common image transformations
 */
export const imageTransformations = {
  thumbnail: {
    width: 150,
    height: 150,
    crop: 'fill',
    quality: 'auto',
  },
  medium: {
    width: 500,
    height: 500,
    crop: 'limit',
    quality: 'auto',
  },
  large: {
    width: 1200,
    height: 1200,
    crop: 'limit',
    quality: 'auto',
  },
  avatar: {
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
  },
  banner: {
    width: 1200,
    height: 400,
    crop: 'fill',
    quality: 'auto',
  },
};

/**
 * Get transformed image URL for common use cases
 */
export const getTransformedImageUrl = (publicId: string, size: keyof typeof imageTransformations): string => {
  return getImageUrl(publicId, imageTransformations[size]);
};

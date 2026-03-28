"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransformedImageUrl = exports.imageTransformations = exports.generateSignedUploadUrl = exports.getImageUrl = exports.deleteMultipleImages = exports.deleteImage = exports.uploadMultipleImages = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../services/cloudinary"));
/**
 * Upload a single image and return the result
 */
const uploadImage = async (params) => {
    const { file, folder, publicId, quality, format, transformations } = params;
    const options = {
        folder: folder || 'uploads',
        ...(publicId && { public_id: publicId }),
        quality: quality || 'auto',
        ...(format && { format }),
        ...(transformations && { transformation: transformations }),
    };
    return await cloudinary_1.default.uploadImage(file, options);
};
exports.uploadImage = uploadImage;
/**
 * Upload multiple images and return the results
 */
const uploadMultipleImages = async (params) => {
    const { files, folder, quality, format, transformations } = params;
    const options = {
        folder: folder || 'uploads',
        quality: quality || 'auto',
        ...(format && { format }),
        ...(transformations && { transformation: transformations }),
    };
    return await cloudinary_1.default.uploadMultipleImages(files, options);
};
exports.uploadMultipleImages = uploadMultipleImages;
/**
 * Delete an image by public ID
 */
const deleteImage = async (publicId) => {
    return await cloudinary_1.default.deleteImage(publicId);
};
exports.deleteImage = deleteImage;
/**
 * Delete multiple images by public IDs
 */
const deleteMultipleImages = async (publicIds) => {
    return await cloudinary_1.default.deleteMultipleImages(publicIds);
};
exports.deleteMultipleImages = deleteMultipleImages;
/**
 * Get image URL with transformations
 */
const getImageUrl = (publicId, transformations) => {
    return cloudinary_1.default.getImageUrl(publicId, transformations);
};
exports.getImageUrl = getImageUrl;
/**
 * Generate a signed upload URL for direct client uploads
 */
const generateSignedUploadUrl = (folder, publicId, transformations) => {
    return cloudinary_1.default.generateSignedUploadUrl(folder, publicId, transformations);
};
exports.generateSignedUploadUrl = generateSignedUploadUrl;
/**
 * Common image transformations
 */
exports.imageTransformations = {
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
const getTransformedImageUrl = (publicId, size) => {
    return (0, exports.getImageUrl)(publicId, exports.imageTransformations[size]);
};
exports.getTransformedImageUrl = getTransformedImageUrl;
//# sourceMappingURL=imageUtils.js.map
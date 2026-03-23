import { Request, Response } from 'express';
import { uploadMultipleImages, deleteMultipleImages, getTransformedImageUrl } from '../../utils/imageUtils';
import sendResponse from '../../utils/sendResponse';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';

class ProductController {
  // Example: Upload product images
  uploadProductImages = catchAsync(async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ApiError(400, 'No image files provided');
    }

    const { productId } = req.params;
    const results = await uploadMultipleImages({
      files: req.files,
      folder: `products/${productId}`,
      quality: 'auto',
      transformations: {
        width: 800,
        height: 600,
        crop: 'limit'
      }
    });

    // Generate different size URLs for each image
    const imagesWithUrls = results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url,
      thumbnail: getTransformedImageUrl(result.public_id, 'thumbnail'),
      medium: getTransformedImageUrl(result.public_id, 'medium'),
      large: getTransformedImageUrl(result.public_id, 'large')
    }));

    sendResponse(res, 200, {
      success: true,
      message: 'Product images uploaded successfully',
      data: imagesWithUrls
    });
  });

  // Example: Delete product images
  deleteProductImages = catchAsync(async (req: Request, res: Response) => {
    const { publicIds } = req.body;

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      throw new ApiError(400, 'Public IDs array is required');
    }

    const result = await deleteMultipleImages(publicIds);

    if (!result) {
      throw new ApiError(400, 'Failed to delete product images');
    }

    sendResponse(res, 200, {
      success: true,
      message: 'Product images deleted successfully'
    });
  });

  // Example: Get product image gallery with different sizes
  getProductImages = catchAsync(async (req: Request, res: Response) => {
    const { publicIds } = req.query;
    const { size = 'medium' } = req.query;

    if (!publicIds || typeof publicIds !== 'string') {
      throw new ApiError(400, 'Public IDs are required');
    }

    const ids = publicIds.split(',');
    const imageUrls = ids.map(id => ({
      public_id: id,
      url: getTransformedImageUrl(id, size as any)
    }));

    sendResponse(res, 200, {
      success: true,
      message: 'Product images retrieved successfully',
      data: imageUrls
    });
  });
}

export default new ProductController();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageUtils_1 = require("../../utils/imageUtils");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
class ProductController {
    constructor() {
        // Example: Upload product images
        this.uploadProductImages = (0, catchAsync_1.default)(async (req, res) => {
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                throw new ApiError_1.default(400, 'No image files provided');
            }
            const { productId } = req.params;
            const results = await (0, imageUtils_1.uploadMultipleImages)({
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
                thumbnail: (0, imageUtils_1.getTransformedImageUrl)(result.public_id, 'thumbnail'),
                medium: (0, imageUtils_1.getTransformedImageUrl)(result.public_id, 'medium'),
                large: (0, imageUtils_1.getTransformedImageUrl)(result.public_id, 'large')
            }));
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: 'Product images uploaded successfully',
                data: imagesWithUrls
            });
        });
        // Example: Delete product images
        this.deleteProductImages = (0, catchAsync_1.default)(async (req, res) => {
            const { publicIds } = req.body;
            if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
                throw new ApiError_1.default(400, 'Public IDs array is required');
            }
            const result = await (0, imageUtils_1.deleteMultipleImages)(publicIds);
            if (!result) {
                throw new ApiError_1.default(400, 'Failed to delete product images');
            }
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: 'Product images deleted successfully'
            });
        });
        // Example: Get product image gallery with different sizes
        this.getProductImages = (0, catchAsync_1.default)(async (req, res) => {
            const { publicIds } = req.query;
            const { size = 'medium' } = req.query;
            if (!publicIds || typeof publicIds !== 'string') {
                throw new ApiError_1.default(400, 'Public IDs are required');
            }
            const ids = publicIds.split(',');
            const imageUrls = ids.map(id => ({
                public_id: id,
                url: (0, imageUtils_1.getTransformedImageUrl)(id, size)
            }));
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: 'Product images retrieved successfully',
                data: imageUrls
            });
        });
    }
}
exports.default = new ProductController();
//# sourceMappingURL=product.controller.js.map
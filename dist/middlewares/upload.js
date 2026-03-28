"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCompany = exports.uploadAuthorization = exports.uploadTourCategorySingle = exports.debugReviewUpload = exports.uploadCountryFields = exports.uploadCorporateClientFields = exports.debugAfterMulter = exports.debugBlogUpload = exports.uploadBlogFields = exports.uploadReviewFields = exports.uploadBannerArray = exports.uploadTeamSingle = exports.uploadProfileSingle = exports.uploadCompanyFields = exports.uploadAuthorizationArray = exports.uploadAuthorizationSingle = exports.uploadTourFields = exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const env_1 = __importDefault(require("../config/env"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: env_1.default.cloudinary.cloudName,
    api_key: env_1.default.cloudinary.apiKey,
    api_secret: env_1.default.cloudinary.apiSecret,
});
// Configure Cloudinary storage for multer - Gallery Images
const galleryStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "gallery-images",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure Cloudinary storage for multer - Authorizations
const authorizationStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "authorizations",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure Cloudinary storage for multer - Company Info
const companyStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "company-info",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure Cloudinary storage for multer - Blogs
const blogStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "blogs",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure multer for gallery images
const upload = (0, multer_1.default)({
    storage: galleryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
// Configure multer for blogs - Using memory storage for debugging
const uploadBlog = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for blogs
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
// Configure multer for authorization images
const uploadAuthorization = (0, multer_1.default)({
    storage: authorizationStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
exports.uploadAuthorization = uploadAuthorization;
// Configure multer for company info images
const uploadCompany = (0, multer_1.default)({
    storage: companyStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
exports.uploadCompany = uploadCompany;
// Configure Cloudinary storage for multer - Corporate Clients
const corporateClientStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "corporate-clients",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 300, height: 200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure Cloudinary storage for multer - Profile Images
const profileStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "profile-images",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure multer for corporate clients
const uploadCorporateClient = (0, multer_1.default)({
    storage: corporateClientStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
// Configure Cloudinary storage for multer - Banners
const bannerStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "banners",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 1920, height: 1080, crop: "limit" },
            { quality: "auto:best" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure multer for banner images
const uploadBanner = (0, multer_1.default)({
    storage: bannerStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for banners
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
// Configure multer for profile images
const uploadProfile = (0, multer_1.default)({
    storage: profileStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit for profile images
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
// Export different upload configurations
exports.uploadSingle = upload.single("image");
exports.uploadMultiple = upload.array("images", 10); // Max 10 images
// Tour specific upload using memory storage (more reliable)
const tourUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for tours
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
exports.uploadFields = tourUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
]);
// Tour specific uploads - Using memory storage for manual Cloudinary upload
exports.uploadTourFields = tourUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
]);
// Authorization specific uploads
exports.uploadAuthorizationSingle = uploadAuthorization.single("image");
exports.uploadAuthorizationArray = uploadAuthorization.array("image", 1);
// Company specific uploads
exports.uploadCompanyFields = uploadCompany.fields([
    { name: "logo", maxCount: 1 },
    { name: "affiliation", maxCount: 10 },
    { name: "paymentAccept", maxCount: 10 },
]);
// Profile specific uploads
exports.uploadProfileSingle = uploadProfile.single("profileImg");
// Team specific uploads
exports.uploadTeamSingle = uploadProfile.single("image");
// Banner specific uploads
exports.uploadBannerArray = uploadBanner.array("backgroundImages", 10);
// Review specific uploads
exports.uploadReviewFields = uploadProfile.fields([
    { name: "userProfileImg", maxCount: 1 },
]);
// Blog specific uploads
exports.uploadBlogFields = uploadBlog.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
]);
// Debug middleware for blog uploads
const debugBlogUpload = (req, res, next) => {
    console.log("=== Debug Blog Upload ===");
    next();
};
exports.debugBlogUpload = debugBlogUpload;
// Debug middleware after multer
const debugAfterMulter = (req, res, next) => {
    console.log("=== Debug After Multer ===");
    next();
};
exports.debugAfterMulter = debugAfterMulter;
// Corporate Client specific uploads - Simple memory storage for debugging
const corporateClientMemoryStorage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
exports.uploadCorporateClientFields = corporateClientMemoryStorage.fields([
    { name: "coverImage", maxCount: 1 },
]);
// Configure Cloudinary storage for Country images
const countryStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "countries",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// Configure multer for country images
const uploadCountry = (0, multer_1.default)({
    storage: countryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
// Country specific upload fields
exports.uploadCountryFields = uploadCountry.fields([
    { name: "image", maxCount: 1 },
]);
// Debug middleware for review uploads
const debugReviewUpload = (req, res, next) => {
    next();
};
exports.debugReviewUpload = debugReviewUpload;
// Configure multer for tour category images - Using memory storage for reliability
const uploadTourCategory = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
        }
    },
});
// Tour Category specific upload
exports.uploadTourCategorySingle = uploadTourCategory.single("image");
exports.default = upload;
//# sourceMappingURL=upload.js.map
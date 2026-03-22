import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config/env";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Configure Cloudinary storage for multer - Gallery Images
const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gallery-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as any,
});

// Configure Cloudinary storage for multer - Authorizations
const authorizationStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "authorizations",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as any,
});

// Configure Cloudinary storage for multer - Company Info
const companyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "company-info",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as any,
});

// Configure Cloudinary storage for multer - Blogs
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as any,
});

// Configure multer for gallery images
const upload = multer({
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Configure multer for blogs - Using memory storage for debugging
const uploadBlog = multer({
  storage: multer.memoryStorage(),
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Configure multer for authorization images
const uploadAuthorization = multer({
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Configure multer for company info images
const uploadCompany = multer({
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Configure Cloudinary storage for multer - Corporate Clients
const corporateClientStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "corporate-clients",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 300, height: 200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as any,
});

// Configure Cloudinary storage for multer - Profile Images
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as any,
});

// Configure multer for corporate clients
const uploadCorporateClient = multer({
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Configure Cloudinary storage for multer - Banners
const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "banners",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 1920, height: 1080, crop: "limit" },
      { quality: "auto:best" },
      { fetch_format: "auto" },
      
    ],
  } as any,
});

// Configure multer for banner images
const uploadBanner = multer({
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Configure multer for profile images
const uploadProfile = multer({
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Export different upload configurations
export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images", 10); // Max 10 images
// Tour specific upload using memory storage (more reliable)
const tourUpload = multer({
  storage: multer.memoryStorage(),
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

export const uploadFields = tourUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "coverImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

// Tour specific uploads - Using memory storage for manual Cloudinary upload
export const uploadTourFields = tourUpload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

// Authorization specific uploads
export const uploadAuthorizationSingle = uploadAuthorization.single("image");
export const uploadAuthorizationArray = uploadAuthorization.array("image", 1);

// Company specific uploads
export const uploadCompanyFields = uploadCompany.fields([
  { name: "logo", maxCount: 1 },
  { name: "affiliation", maxCount: 10 },
  { name: "paymentAccept", maxCount: 10 },
]);

// Profile specific uploads
export const uploadProfileSingle = uploadProfile.single("profileImg");

// Team specific uploads
export const uploadTeamSingle = uploadProfile.single("image");

// Banner specific uploads
export const uploadBannerArray = uploadBanner.array("backgroundImages", 10);

// Review specific uploads
export const uploadReviewFields = uploadProfile.fields([
  { name: "userProfileImg", maxCount: 1 },
]);

// Blog specific uploads
export const uploadBlogFields = uploadBlog.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Debug middleware for blog uploads
export const debugBlogUpload = (req: any, res: any, next: any) => {
  console.log("=== Debug Blog Upload ===");
  next();
};

// Debug middleware after multer
export const debugAfterMulter = (req: any, res: any, next: any) => {
  console.log("=== Debug After Multer ===");
  next();
};

// Corporate Client specific uploads - Simple memory storage for debugging
const corporateClientMemoryStorage = multer({
  storage: multer.memoryStorage(),
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

export const uploadCorporateClientFields = corporateClientMemoryStorage.fields([
  { name: "coverImage", maxCount: 1 },
]);

// Configure Cloudinary storage for Country images
const countryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "countries",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as any,
});

// Configure multer for country images
const uploadCountry = multer({
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Country specific upload fields
export const uploadCountryFields = uploadCountry.fields([
  { name: "image", maxCount: 1 },
]);

// Debug middleware for review uploads
export const debugReviewUpload = (req: any, res: any, next: any) => {
  next();
};

// Configure multer for tour category images - Using memory storage for reliability
const uploadTourCategory = multer({
  storage: multer.memoryStorage(),
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
    } else {
      cb(
        new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!")
      );
    }
  },
});

// Tour Category specific upload
export const uploadTourCategorySingle = uploadTourCategory.single("image");

export default upload;
export { uploadAuthorization, uploadCompany };

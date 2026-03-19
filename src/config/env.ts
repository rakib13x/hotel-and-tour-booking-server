import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  // Server Configuration
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database Configuration
  mongoURI: process.env.DATABASE_URL || "",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: process.env.DB_PORT || 27017,
  dbName: process.env.DB_NAME || "your_database_name",
  dbUsername: process.env.DB_USERNAME || "",
  dbPassword: process.env.DB_PASSWORD || "",

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || "secretkey",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    username: process.env.EMAIL_USERNAME || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "noreply@yourapp.com",
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || "",
    db: parseInt(process.env.REDIS_DB || "0"),
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: process.env.CORS_CREDENTIALS === "true",
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(",") || [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "logs/app.log",
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12"),
    sessionSecret: process.env.SESSION_SECRET || "session_secret",
    cookieSecret: process.env.COOKIE_SECRET || "cookie_secret",
  },

  // API Configuration
  api: {
    version: process.env.API_VERSION || "v1",
    prefix: process.env.API_PREFIX || "/api",
  },

  // External Services
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  },

  // SSLCommerz Payment Gateway Configuration
  sslcommerz: {
    storeId: process.env.SSLCOMMERZ_STORE_ID || "",
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || "",
    isLive: process.env.SSLCOMMERZ_IS_LIVE === "true",
    successUrl: process.env.SSLCOMMERZ_SUCCESS_URL || "",
    failUrl: process.env.SSLCOMMERZ_FAIL_URL || "",
    cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL || "",
    ipnUrl: process.env.SSLCOMMERZ_IPN_URL || "",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },

  facebook: {
    appId: process.env.FACEBOOK_APP_ID || "",
    appSecret: process.env.FACEBOOK_APP_SECRET || "",
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "us-east-1",
    s3Bucket: process.env.AWS_S3_BUCKET || "",
  },

  // Monitoring
  sentry: {
    dsn: process.env.SENTRY_DSN || "",
  },

  googleAnalytics: {
    trackingId: process.env.GA_TRACKING_ID || "",
  },

  // Development Configuration
  development: {
    enableSwagger: process.env.ENABLE_SWAGGER === "true",
    enableLogging: process.env.ENABLE_LOGGING === "true",
    enableCors: process.env.ENABLE_CORS === "true",
    enableRateLimiting: process.env.ENABLE_RATE_LIMITING === "true",
  },
};

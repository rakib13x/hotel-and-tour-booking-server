declare const _default: {
    port: string | undefined;
    nodeEnv: string;
    mongoURI: string;
    dbHost: string;
    dbPort: string | number;
    dbName: string;
    dbUsername: string;
    dbPassword: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshSecret: string;
    jwtRefreshExpiresIn: string;
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    admin: {
        email: string | undefined;
        password: string | undefined;
    };
    email: {
        host: string;
        port: number;
        username: string;
        password: string;
        from: string;
    };
    redis: {
        host: string;
        port: number;
        password: string;
        db: number;
    };
    cors: {
        origin: string | undefined;
        credentials: boolean;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    upload: {
        maxFileSize: number;
        allowedFileTypes: string[];
    };
    logging: {
        level: string;
        file: string;
    };
    security: {
        bcryptRounds: number;
        sessionSecret: string;
        cookieSecret: string;
    };
    api: {
        version: string;
        prefix: string;
    };
    stripe: {
        secretKey: string;
        publishableKey: string;
    };
    sslcommerz: {
        storeId: string;
        storePassword: string;
        isLive: boolean;
        successUrl: string;
        failUrl: string;
        cancelUrl: string;
        ipnUrl: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
    };
    facebook: {
        appId: string;
        appSecret: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        s3Bucket: string;
    };
    sentry: {
        dsn: string;
    };
    googleAnalytics: {
        trackingId: string;
    };
    development: {
        enableSwagger: boolean;
        enableLogging: boolean;
        enableCors: boolean;
        enableRateLimiting: boolean;
    };
};
export default _default;
//# sourceMappingURL=env.d.ts.map
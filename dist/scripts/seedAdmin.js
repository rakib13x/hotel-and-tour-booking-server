"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("../config/env"));
const auth_model_1 = __importDefault(require("../modules/auth/auth.model"));
const seedAdmin = async () => {
    try {
        // Connect to database
        await mongoose_1.default.connect(env_1.default.mongoURI);
        console.log('Connected to database');
        // Delete existing admin if it exists
        const existingAdmin = await auth_model_1.default.findOne({ email: 'admin@admin.com' });
        if (existingAdmin) {
            await auth_model_1.default.deleteOne({ email: 'admin@admin.com' });
            console.log('Existing admin user deleted');
        }
        // Create admin user
        // Note: Password will be hashed by the User model's pre-save hook
        const admin = await auth_model_1.default.create({
            name: 'Super Admin',
            email: 'admin@admin.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Admin user created successfully:', {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
        console.log('Admin credentials:');
        console.log('Email: admin@admin.com');
        console.log('Password: admin123');
    }
    catch (error) {
        console.error('Error seeding admin:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from database');
    }
};
// Run the seed function
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map
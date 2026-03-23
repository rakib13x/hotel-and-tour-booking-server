import mongoose from 'mongoose';
import config from '../config/env';
import User from '../modules/auth/auth.model';

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoURI);
    console.log('Connected to database');

    // Delete existing admin if it exists
    const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
    if (existingAdmin) {
      await User.deleteOne({ email: 'admin@admin.com' });
      console.log('Existing admin user deleted');
    }

    // Create admin user
    // Note: Password will be hashed by the User model's pre-save hook
    const admin = await User.create({
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

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the seed function
seedAdmin();

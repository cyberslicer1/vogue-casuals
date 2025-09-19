import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const adminEmail = 'admin@vogue.com';
const adminPassword = 'admin123';
const adminName = 'Admin User';

const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vogue-casuals';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin user already exists:', adminEmail);
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin user created:', adminEmail);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();

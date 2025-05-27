import dotenv from 'dotenv';
dotenv.config({ path: 'c:\\Users\\Valena\\Desktop\\fichaje_valena\\backend\\.env' });

console.log('MongoDB URI:', process.env.MONGO_URI); // Add this line

import User from '../models/User.js';
import connectDB from '../config/db.js';

const createTestUser = async () => {
  try {
    await connectDB();
    const user = new User({
      name: 'Bruno',
      lastName: 'Marin',
      username: 'brunom',
      email: 'bmarin@valenaconsultinb.com',
      password: 'asd123',
      role: 'user',
      status: 'active'
    });
    await user.save();
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

createTestUser();
import mongoose from 'mongoose';
import { DB_URI } from '../config/env.config';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; 
  }
};

export default connectToDatabase;
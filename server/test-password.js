import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'admin@spec360.com.ng' });
  if (!user) {
    console.log('User not found');
    return;
  }
  const isMatch = await user.comparePassword('fidelia');
  console.log('Password match:', isMatch);
  mongoose.disconnect();
}
test();
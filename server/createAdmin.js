import mongoose from 'mongoose';
import { env } from './config/env.js';
import User from './models/User.js';

const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || '');

if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running createAdmin.js');

try {
  await mongoose.connect(env.mongoUri);
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Admin already exists');
  await User.create({ email, password, role: 'admin' });
  console.log('Admin created successfully');
} finally {
  await mongoose.disconnect();
}

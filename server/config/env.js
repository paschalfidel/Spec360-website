import dotenv from 'dotenv';

dotenv.config();

const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'PAYSTACK_SECRET_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

if (process.env.NODE_ENV === 'production') {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = {
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  clientOrigins: (process.env.CLIENT_ORIGINS || 'http://localhost:5173,https://spec360.com.ng,https://www.spec360.com.ng')
    .split(',').map((value) => value.trim()).filter(Boolean),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  receiverEmail: process.env.RECEIVER_EMAIL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

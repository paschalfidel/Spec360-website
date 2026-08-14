import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import contactRoutes from './routes/contact.js';
import orderRoutes, { handlePaystackWebhook, releaseExpiredOrders } from './routes/orders.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());

app.use(cors({
  origin(origin, callback) {
    if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS blocked'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many requests. Please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many login attempts. Try again later.' } });
app.use('/api/', apiLimiter);

// Paystack signs the exact raw request body, so this route must run before express.json().
app.post('/api/orders/webhook', express.raw({ type: 'application/json', limit: '1mb' }), handlePaystackWebhook);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((error, _req, res, _next) => {
  console.error(error.message);
  const status = Number(error.status || (error.name === 'ValidationError' ? 400 : 500));
  res.status(status).json({ message: process.env.NODE_ENV === 'production' && status >= 500 ? 'Internal server error' : error.message });
});

await connectDB();
app.listen(env.port, () => {
  console.log(`Spec360 API running on port ${env.port}`);
  setInterval(() => releaseExpiredOrders().catch((error) => console.error('Order cleanup error:', error.message)), 5 * 60 * 1000);
});

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import { env } from '../config/env.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== 'admin' || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Unable to sign in' });
  }
});

router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;

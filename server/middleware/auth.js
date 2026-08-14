import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export default function authMiddleware(req, res, next) {
  const header = req.get('authorization');
  const [scheme, token] = header?.split(' ') || [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

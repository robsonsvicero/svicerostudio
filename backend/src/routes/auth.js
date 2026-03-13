import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
  // Ensure user.id is a string
  const userId = user.id || user._id.toString();
  return jwt.sign({ sub: userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = await AdminUser.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const normalizedUser = { id: user._id.toString(), email: user.email };
  const token = signToken(normalizedUser);

  return res.json({ token, user: normalizedUser });
});

router.get('/session', authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;

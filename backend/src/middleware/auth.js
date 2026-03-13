import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET;

export function decodeToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const payload = decodeToken(token);
  if (!payload?.sub) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // Use lean() for a plain JS object, which is faster.
  const user = await AdminUser.findById(payload.sub).lean();
  if (!user) {
    return res.status(401).json({ error: 'Usuário inválido' });
  }

  req.user = { id: user._id.toString(), email: user.email };
  return next();
}

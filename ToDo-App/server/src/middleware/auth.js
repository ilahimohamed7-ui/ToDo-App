import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function auth(required = true) {
  return (req, _res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return required ? next(Object.assign(new Error('Unauthorized'), { status: 401 })) : next();
    }
    try {
      req.user = jwt.verify(token, env.jwtSecret);
      next();
    } catch {
      next(Object.assign(new Error('Invalid token'), { status: 401 }));
    }
  };
}

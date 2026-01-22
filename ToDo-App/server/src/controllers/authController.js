import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const TOKEN_TTL = '7d';

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) return res.status(400).json({ error: { message: 'Email & password required' }});

      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ error: { message: 'Email already in use' }});

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, passwordHash, name });

      const token = jwt.sign({ _id: user._id, email: user.email }, env.jwtSecret, { expiresIn: TOKEN_TTL });
      res.status(201).json({ token, user: { _id: user._id, email: user.email, name: user.name } });
    } catch (e) { next(e); }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' }});

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' }});

      const token = jwt.sign({ _id: user._id, email: user.email }, env.jwtSecret, { expiresIn: TOKEN_TTL }); // tokem signieren 
      res.json({ token, user: { _id: user._id, email: user.email, name: user.name } });
    } catch (e) { next(e); }
  },

  async me(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select('_id email name createdAt');
      res.json({ user });
    } catch (e) { next(e); }
  }
};

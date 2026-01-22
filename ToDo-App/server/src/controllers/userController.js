import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const userController = {
  async updateMe(req, res, next) {
    try {
      const { username } = req.body;

      if (!username?.trim()) {
        return res.status(400).json({ error: { message: "Username erforderlich" } });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name: username.trim() },      // Schema-Feld heißt "name"
        { new: true }
      ).select("-passwordHash");        //  Schema-Feld heißt "passwordHash"

      res.json({ user });
    } catch (e) {
      next(e);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { password } = req.body;

      if (!password || password.trim().length < 6) {
        return res.status(400).json({
          error: { message: "Passwort muss mindestens 6 Zeichen haben" },
        });
      }

      const hashed = await bcrypt.hash(password.trim(), 10);

      await User.findByIdAndUpdate(req.user._id, {
        passwordHash: hashed,          //  richtiges Feld
      });

      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
};

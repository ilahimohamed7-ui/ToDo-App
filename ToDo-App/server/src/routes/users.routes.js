import express from "express";
import { auth } from "../middleware/auth.js";
import { userController } from "../controllers/userController.js";

const router = express.Router();

// Username ändern
router.patch("/me", auth(), userController.updateMe);

// Passwort ändern
router.patch("/me/password", auth(), userController.changePassword);

export default router;

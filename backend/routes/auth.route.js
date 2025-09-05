// Import Express framework
import express from "express";

// Import authentication controller functions
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";

// Import authentication middleware
import { verifyToken } from "../middleware/verifyToken.js";

// Create Express router instance
const router = express.Router();

// Protected route: Check authentication status (requires valid JWT)
router.get("/check-auth", verifyToken, checkAuth);

// Public routes: Authentication endpoints
router.post("/signup", signup);              // Register new user
router.post("/login", login);                // Authenticate user
router.post("/logout", logout);              // End user session

// Email verification and password reset routes
router.post("/verify-email", verifyEmail);            // Verify user email
router.post("/forgot-password", forgotPassword);      // Request password reset
router.post("/reset-password/:token", resetPassword); // Reset password with token

// Export the configured router
export default router;

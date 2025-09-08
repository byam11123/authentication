// Import required libraries and modules
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

/**
 * Controller function to handle user registration
 * @param {Object} req - Express request object containing user data
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success status and user info
 */
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    // Check if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password for secure storage
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate verification token for email confirmation
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Create new user with hashed password and verification token
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hrs
    });

    // Save user to database
    await user.save();

    // Generate JWT token and set it as cookie
    generateTokenAndSetCookie(res, user._id);

    // Send verification email to user
    await sendVerificationEmail(user.email, verificationToken);

    // Return success response (without password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Controller function to verify user email using token
 * @param {Object} req - Express request object containing verification code
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success status and user info
 */
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    // Find user with matching verification token that hasn't expired
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Update user to mark as verified and clear verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Send welcome email to newly verified user
    await sendWelcomeEmail(user.email, user.name);

    // Return success response (without password)
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    // Handle errors
    console.log("error while verify email", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Controller function to handle user login
 * @param {Object} req - Express request object containing login credentials
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success status and user info
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token and set it as cookie
    generateTokenAndSetCookie(res, user._id);

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Return success response (without password)
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    // Handle errors
    console.log("Error in Login: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Controller function to handle user logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success status
 */
export const logout = async (req, res) => {
  // Clear the JWT cookie to end the session
  res.clearCookie("jwt-token");

  // Return success response
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/**
 * Controller function to handle password reset request
 * @param {Object} req - Express request object containing email
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success status
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    // Generate secure random token for password reset
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // Store reset token and expiration in user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Send password reset email with reset link
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    // Handle errors
    console.log("error while sending password reset email", error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

/**
 * Controller function to handle password reset with token
 * @param {Object} req - Express request object containing token and new password
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success status
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with matching reset token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // Send success notification email
    await sendResetSuccessEmail(user.email);

    // Return success response
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    // Handle errors
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Controller function to check authentication status of user
 * @param {Object} req - Express request object (with userId from middleware)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success status and user info
 */
export const checkAuth = async (req, res) => {
  try {
    // Find user by ID attached by verifyToken middleware
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Return user information
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Handle errors
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

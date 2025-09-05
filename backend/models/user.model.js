// Import Mongoose for MongoDB object modeling
import mongoose from "mongoose";

// Define the user schema with all required fields and validations
const userSchema = new mongoose.Schema(
  {
    // Email field: required and unique for user identification
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Password field: required for authentication (stored as hash)
    password: {
      type: String,
      required: true,
    },
    // Name field: required for user identification
    name: {
      type: String,
      required: true,
    },
    // Last login timestamp: tracks when user last logged in
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    // Verification status: indicates if email has been verified
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Password reset token: temporary token for password reset functionality
    resetPasswordToken: String,
    // Password reset expiration: when the reset token expires
    resetPasswordExpiresAt: Date,
    // Verification token: temporary token for email verification
    verificationToken: String,
    // Verification token expiration: when the verification token expires
    verificationTokenExpiresAt: Date,
  },
  {
    // Enable timestamps: automatically adds createdAt and updatedAt fields
    timestamps: true
  },
);

// Create and export the User model
export const User = mongoose.model("User", userSchema);

// Note: The timestamps option automatically adds createdAt and updatedAt fields to each document

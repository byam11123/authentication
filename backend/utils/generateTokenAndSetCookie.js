// Import JWT library for token creation
import jwt from "jsonwebtoken";

/**
 * Generates a JWT token and sets it as an HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} userId - User's unique identifier from database (_id)
 * @returns {string} - The generated JWT token
 */
export const generateTokenAndSetCookie = (res, userId) => {
  // Step 1: Create JWT token with user ID payload
  // The payload contains only essential user identification
  // Token expires in 7 days for security balance
  const token = jwt.sign(
    { userId },                    // Payload: contains user ID for identification
    process.env.JWT_SECRET,        // Secret key: used to sign the token securely
    { expiresIn: "7d" }           // Options: sets token expiration to 7 days
  );

  // Step 2: Set the token as an HTTP-only cookie
  // This ensures the token is secure and accessible only to server
  res.cookie(
    "jwt-token",                  // Cookie name: identifier for the cookie
    token,                        // Cookie value: the JWT token we just created
    {
      httpOnly: true,             // Security: prevents XSS attacks by blocking JS access
      secure: process.env.NODE_ENV === "production",  // Security: HTTPS only in production
      sameSite: "strict",         // Security: prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Duration: 7 days in milliseconds (matches JWT expiry)
    }
  );

  // Step 3: Return the token for potential additional use
  return token;
};

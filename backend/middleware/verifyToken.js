// Import JWT library for token verification
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token from cookies and attach user ID to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
export const verifyToken = (req, res, next) => {
  // Extract JWT token from cookies
  const token = req.cookies["jwt-token"];

  // Check if token exists
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token verification was successful
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    // Attach user ID to request object for use in subsequent middleware/route handlers
    req.userId = decoded.userId;

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    // Log error for debugging
    console.log("Error in verifyToken ", error);

    // Return server error response
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

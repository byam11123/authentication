// Import Mongoose for MongoDB connection
import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log successful connection with host information
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    // Log connection error and exit the process
    console.log("Error connecting to MongoDB : ", error.message);
    process.exit(1); // Exit with failure code
  }
};

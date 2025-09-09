// Import required modules and dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Mount authentication routes under the /api/v1/auth path
app.use("/api/v1/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}
// Start the server and connect to the database
const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.log("Error checking/connecting DB", error);
  }
}

startServer();

export default app;

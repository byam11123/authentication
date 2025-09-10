import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();

// Path setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", authRoutes);

// Database connection (singleton for serverless)
let isConnected = false;
const connectOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};
connectOnce();

// Serve static files only if dist exists
const staticPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Local dev server (Vercel doesn't use this)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server on port ${port}`));
}

export default app;

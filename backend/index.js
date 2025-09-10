import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

// ✅ Fix: Proper __dirname for ES modules on Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix: Better CORS for Vercel
const allowedOrigins = [
  "http://localhost:5173",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? allowedOrigins : "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", authRoutes);

// ✅ Fix: Correct path to frontend (sibling of backend folder)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

  app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}

// ✅ Fix: Connect DB before exporting for serverless
let isConnected = false;
const connectOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  connectOnce().then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  });
}

// Connect immediately for serverless cold start
connectOnce();

export default app;
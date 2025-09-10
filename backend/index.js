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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Log what we see
console.log("Current __dirname:", __dirname);
console.log("Contents of parent:", fs.readdirSync(path.join(__dirname, "..")));
console.log(
  "Does frontend/dist exist?",
  fs.existsSync(path.join(__dirname, "..", "frontend", "dist")),
);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API working", cwd: process.cwd(), dirname: __dirname });
});

app.use("/api/v1/auth", authRoutes);

let isConnected = false;
const connectOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};
connectOnce();

// Serve static files only if folder exists
const staticPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ error: "Frontend build not found", path: staticPath });
  });
}

export default app;

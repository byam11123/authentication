import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello, I am your Backend");
});

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is listening on http://localhost:5000`);
});

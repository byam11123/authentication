import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // allows us to parse incoming requests : req.body in json

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is listening on http://localhost:${port}`);
});

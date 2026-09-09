import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import workoutRoutes from "./routes/workouts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/workouts", workoutRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in server/.env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

start();

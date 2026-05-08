import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db";
import collegeRoutes from "./routes/college.routes";
import predictorRoutes from "./routes/predictor.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://college-platform-ivory.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/colleges", collegeRoutes);
app.use("/api/predict", predictorRoutes);

// Keep Neon DB alive — ping every 4 minutes
if (process.env.NODE_ENV === "production") {
  setInterval(async () => {
    try {
      await db.$queryRaw`SELECT 1`;
      console.log("🔄 DB keep-alive ping");
    } catch (e) {
      console.error("Keep-alive failed:", e);
    }
  }, 4 * 60 * 1000);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
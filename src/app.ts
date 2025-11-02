import express from "express";
import { jwtAuthMiddleware } from "./middleware/auth";

const app = express();

app.use(express.json());
// app.use(jwtAuthMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "Job DAM API Server" });
});

export default app;

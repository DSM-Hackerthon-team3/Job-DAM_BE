import dotenv from "dotenv";
import express from "express";
import { AppDataSource } from "./config/data-source";
import postRouter from "./routes/post/postRouter";
import commentRouter from "./routes/comment/commentRouter";
import jobRouter from "./routes/job/jobRouter";
import cors from "cors";
import userRouter from "./routes/user/userRoutes";
import adminRouter from "./routes/admin/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(postRouter);
app.use(commentRouter);
app.use(jobRouter);
app.use(adminRouter);
app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((req, res, next) => {
  res.status(400).json({ message: "잘못된 요청입니다. (Invalid URL)" });
});

app.use((err: any, res: express.Response) => {
  console.error(err);
  res.status(500).json({ message: "❤️‍🩹Internal Server Error" });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Data Source initialization error:", error);
  });

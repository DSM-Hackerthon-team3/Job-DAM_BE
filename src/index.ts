import express from "express";
import { AppDataSource } from "./config/data-source";
import postRouter from "./routes/post/postRouter";
import commentRouter from "./routes/comment/commentRouter";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(postRouter);
app.use(commentRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// 등록되지 않은 URL 처리 (400 에러 반환)
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

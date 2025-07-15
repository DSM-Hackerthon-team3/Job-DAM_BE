import express from "express";
import postRoutes from "./routes/user/postRoutes";
import { AppDataSource } from "./config/data-source";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(postRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
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

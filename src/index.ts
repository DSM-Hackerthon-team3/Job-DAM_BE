import express from "express";
import postRoutes from "./routes/user/postRoutes";

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

app.listen(PORT, () => {
  console.log(`🚀Server is running on port ${PORT}`);
});

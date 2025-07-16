import { Router } from "express";
import { PostController } from "../../controllers/post/postController";

const postRouter = Router();
const postController = new PostController();

postRouter.post("/post", postController.createPost.bind(postController));
postRouter.delete("/post/:id", postController.deletePost.bind(postController));
postRouter.patch("/post/:id", postController.updatePost.bind(postController));
postRouter.get("/posts", postController.queryPostList.bind(postController));
postRouter.get(
  "/post/:id",
  postController.queryPostDetail.bind(postController)
);

export default postRouter;

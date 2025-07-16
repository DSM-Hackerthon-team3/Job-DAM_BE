import { Router } from "express";
import { PostController } from "../../controllers/post/postController";
import { jwtAuthMiddleware } from "../../middleware/auth";

const postRouter = Router();
const postController = new PostController();

postRouter.post(
  "/post",
  jwtAuthMiddleware,
  postController.createPost.bind(postController)
);
postRouter.delete(
  "/post/:id",
  jwtAuthMiddleware,
  postController.deletePost.bind(postController)
);
postRouter.patch(
  "/post/:id",
  jwtAuthMiddleware,
  postController.updatePost.bind(postController)
);
postRouter.get("/posts", postController.queryPostList.bind(postController));
postRouter.get(
  "/post/:id",
  postController.queryPostDetail.bind(postController)
);

export default postRouter;

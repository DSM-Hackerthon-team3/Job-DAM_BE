import { Router } from "express";
import { CommentController } from "../../controllers/comment/commentController";

const commentRouter = Router();
const commentController = new CommentController();

commentRouter.post(
  "/comment",
  commentController.createComment.bind(commentController)
);
commentRouter.delete(
  "/comment/:id",
  commentController.deleteComment.bind(commentController)
);

export default commentRouter;

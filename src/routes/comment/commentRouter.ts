import { Router } from "express";
import { CommentController } from "../../controllers/comment/commentController";
import { jwtAuthMiddleware } from "../../middleware/auth";

const commentRouter = Router();
const commentController = new CommentController();

commentRouter.post(
  "/comment",
  jwtAuthMiddleware,
  commentController.createComment.bind(commentController)
);
commentRouter.delete(
  "/comment/:id",
  jwtAuthMiddleware,
  commentController.deleteComment.bind(commentController)
);
commentRouter.patch(
  "/comment/:id",
  jwtAuthMiddleware,
  commentController.updateComment.bind(commentController)
);
commentRouter.post(
  "/comment/rate",
  jwtAuthMiddleware,
  commentController.rateComment.bind(commentController)
);
commentRouter.get(
  "/comment/:id/post",
  commentController.getPostByCommentId.bind(commentController)
);

export default commentRouter;

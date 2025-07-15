import { Router } from "express";
import { PostController } from "../../controllers/post/postController";

const router = Router();
const postController = new PostController();

router.post("/post", postController.createPost.bind(postController));
router.delete("/post/:id", postController.deletePost.bind(postController));
router.patch("/post/:id", postController.updatePost.bind(postController));
router.get("/post/:id", postController.queryPostDetail.bind(postController));

export default router;

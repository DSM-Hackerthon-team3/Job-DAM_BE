import { Request, Response } from "express";
import { PostRequest } from "../../dtos/post/request/postRequest";
import { createPostService } from "../../services/post/commandPostService";
import { validate } from "class-validator";

export class PostController {
  async createPost(req: Request<{}, {}, PostRequest>, res: Response) {
    const postRequest = Object.assign(new PostRequest(), req.body);

    const errors = await validate(postRequest);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    try {
      await createPostService(req.body);
      res.status(201).json({ message: "Post created" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  }
}

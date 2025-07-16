import { Request, Response } from "express";
import {
  PostRequest,
  UpdatePostRequest,
} from "../../dtos/post/request/postRequest";
import {
  createPostService,
  deletePostService,
  updatePostService,
} from "../../services/post/commandPostService";
import { validate } from "class-validator";
import {
  queryPostDetailService,
  queryPostListService,
} from "../../services/post/queryPostService";
import express from "express";

export class PostController {
  async createPost(req: Request<{}, {}, PostRequest>, res: Response) {
    const postRequest = Object.assign(new PostRequest(), req.body);

    const errors = await validate(postRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "올바른 입력 형식이 아닙니다.", errors });
    }

    try {
      await createPostService(req.body);
      res.status(201).json({ message: "게시글이 성공적으로 작성되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "게시글 작성에 실패했습니다." });
    }
  }

  async deletePost(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await deletePostService(Number(id));
      res.status(204).json({ message: "게시글이 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "게시긋 삭제에 실패했습니다." });
    }
  }

  async updatePost(
    req: Request<{ id: string }, {}, UpdatePostRequest>,
    res: Response
  ) {
    const updateRequest = Object.assign(new UpdatePostRequest(), req.body);

    const errors = await validate(updateRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "올바른 입력 형식이 아닙니다.", errors });
    }

    const id = Number(req.params.id);

    try {
      await updatePostService(id, updateRequest);
      res.status(200).json({ message: "게시글 수정에 성공했습니다." });
    } catch (error) {
      res.status(500).json({ message: "게시글 수정에 실패했습니다." });
    }
  }

  async queryPostDetail(req: Request<{ id: string }>, res: Response) {
    const id = Number(req.params.id);

    try {
      const post = await queryPostDetailService(id);
      if (!post) {
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "게시글 조회에 실패했습니다." });
    }
  }
  async queryPostList(req: Request, res: Response) {
    try {
      const posts = await queryPostListService();

      res.status(200).json(posts);
    } catch (err) {
      console.error("게시글 전체 조회 오류:", err);
      res.status(500).json({ message: "게시글 전체 조회 중 서버 오류" });
    }
  }
}

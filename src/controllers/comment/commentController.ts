import { Request, Response } from "express";
import {
  CommentRequest,
  RateCommentRequest,
} from "../../dtos/comment/request/commentRequest";
import { validate } from "class-validator";
import {
  createCommentService,
  deleteCommentService,
  rateComentService,
  updateCommentService,
} from "../../services/comment/commandCommentService";
import { getPostByCommentIdService } from "../../services/comment/queryCommentService";

export class CommentController {
  async createComment(req: Request<{}, {}, CommentRequest>, res: Response) {
    const commentRequest = Object.assign(new CommentRequest(), req.body);

    const errors = await validate(commentRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "올바른 입력 형식이 아닙니다.", errors });
    }

    try {
      const admin = (req as any).user;
      if (!admin || admin.role !== "ADMIN") {
        return res.status(403).json({ message: "관리자 권한이 필요합니다." });
      }

      await createCommentService(req.body, admin.id);
      res.status(201).json({ message: "댓글이 성공적으로 작성되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "댓글 작성에 실패했습니다." });
    }
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const admin = (req as any).user;
      if (!admin || admin.role !== "ADMIN") {
        return res.status(403).json({ message: "관리자 권한이 필요합니다." });
      }

      await deleteCommentService(Number(id), admin.id);
      res.status(204).json({ message: "댓글이 삭제되었습니다." });
    } catch (error: any) {
      if (error.message === "댓글 작성자와 일치하지 않습니다.") {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: "댓글 삭제에 실패했습니다." });
    }
  }

  async updateComment(
    req: Request<{ id: string }, {}, { content: string }>,
    res: Response
  ) {
    const { id } = req.params;
    const { content } = req.body;

    try {
      const admin = (req as any).user;
      if (!admin || admin.role !== "ADMIN") {
        return res.status(403).json({ message: "관리자 권한이 필요합니다." });
      }

      await updateCommentService(Number(id), content, admin.id);
      res.status(200).json({ message: "댓글이 수정되었습니다." });
    } catch (error: any) {
      if (error.message === "댓글 작성자와 일치하지 않습니다.") {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: "댓글 수정에 실패했습니다." });
    }
  }

  async rateComment(req: Request<{}, {}, RateCommentRequest>, res: Response) {
    const rateRequest = Object.assign(new RateCommentRequest(), req.body);

    const errors = await validate(rateRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "올바른 입력 형식이 아닙니다.", errors });
    }

    try {
      const user = (req as any).user;
      if (!user || user.role !== "USER") {
        return res.status(403).json({ message: "유저 권한이 필요합니다." });
      }

      await rateComentService(rateRequest, user.id);
      res.status(200).json({ message: "평점이 성공적으로 반영되었습니다." });
    } catch (error: any) {
      if (error.message === "게시글 작성자와 일치하지 않습니다.") {
        return res.status(403).json({ message: error.message });
      }
      console.log(error.message);

      res.status(500).json({ message: error.message });
    }
  }

  async getPostByCommentId(req: Request<{ id: string }>, res: Response) {
    try {
      const commentId = Number(req.params.id);
      const post = await getPostByCommentIdService(commentId);
      res.status(200).json(post);
    } catch (error: any) {
      res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
        error: error.message || error,
      });
    }
  }
}

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
} from "../../services/comment/commandCommentService";

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
      await createCommentService(req.body);
      res.status(201).json({ message: "댓글이 성공적으로 작성되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "댓글 작성에 실패했습니다." });
    }
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await deleteCommentService(Number(id));
      res.status(204).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "댓글 삭제에 실패했습니다." });
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
      await rateComentService(rateRequest);
      res.status(200).json({ message: "평점이 성공적으로 반영되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "평점 반영에 실패했습니다." });
    }
  }
}

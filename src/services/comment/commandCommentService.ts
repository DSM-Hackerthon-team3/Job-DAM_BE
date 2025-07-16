import { todo } from "node:test";
import { CommentRepository } from "../../repository/comment/commentRepository";
import {
  CommentRequest,
  RateCommentRequest,
} from "../../dtos/comment/request/commentRequest";
import { PostRepository } from "../../repository/post/postRepository";

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();

export const createCommentService = async (request: CommentRequest) => {
  const post = await postRepository.findById(request.postId);
  if (!post) {
    throw { status: 404, message: "해당 게시글이 존재하지 않습니다." };
  }

  try {
    const comment = await commentRepository.save({
      postId: request.postId,
      content: request.content,
    });

    return comment;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    throw new Error("댓글 작성에 실패했습니다.");
  }
};

export const deleteCommentService = async (id: number) => {
  // if (todo("사용자와 작성자 일치 시")) {
  try {
    await commentRepository.delete(id);
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw new Error("게시글 삭제에 실패했습니다.");
  }
  // } else {
  //   throw { status: 401, message: "댓글 작성자와 일치하지 않습니다." };
  // }
};

export const rateComentService = async (request: RateCommentRequest) => {
  const comment = await commentRepository.findById(request.id);
  if (!comment) {
    throw { status: 404, message: "해당 댓글이 존재하지 않습니다." };
  }

  if (comment.isRated) {
    throw { status: 409, message: "이미 처리된 댓글입니다." };
  }

  // 2. 댓글 작성자와 현재 유저 비교 (토큰 기반)
  // if (post.author.id !== 추출한 토큰 기반 유저값) {
  //   throw { status: 401, message: "게시글 작성자와 일치하지 않습니다." };
  // }

  // 3.  유저 점수 관련 필드 업데이트

  comment.isRated = true;

  await commentRepository.update(comment);
};

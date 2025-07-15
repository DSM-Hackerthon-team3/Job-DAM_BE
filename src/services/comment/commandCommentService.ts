import { todo } from "node:test";
import { CommentRepository } from "../../repository/comment/commentRepository";
import { CommentRequest } from "../../dtos/comment/request/commentRequest";
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

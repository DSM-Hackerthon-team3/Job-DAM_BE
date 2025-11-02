import { PostDetailResponse } from "../../dtos/post/response/postResponse";
import { CommentRepository } from "../../repository/comment/commentRepository";
import { PostRepository } from "../../repository/post/postRepository";
import { AppDataSource } from "../../config/data-source";

const commentRepository = new CommentRepository(AppDataSource);
const postRepository = new PostRepository(AppDataSource);

export const getPostByCommentIdService = async (
  commentId: number
): Promise<PostDetailResponse> => {
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    throw new Error("댓글을 찾을 수 없습니다.");
  }

  const post = await postRepository.findById(comment.post.id);
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  return PostDetailResponse.from(post);
};

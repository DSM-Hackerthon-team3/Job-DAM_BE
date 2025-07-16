import { CommentRepository } from "../../repository/comment/commentRepository";
import {
  CommentRequest,
  RateCommentRequest,
} from "../../dtos/comment/request/commentRequest";
import { PostRepository } from "../../repository/post/postRepository";
import { UserRepository } from "../../repository/user/userRepository";
import { AppDataSource } from "../../config/data-source";

const commentRepository = new CommentRepository(AppDataSource);
const postRepository = new PostRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);

export const createCommentService = async (
  request: CommentRequest,
  userId: string
) => {
  const post = await postRepository.findById(request.postId);
  if (!post) {
    throw { status: 404, message: "해당 게시글이 존재하지 않습니다." };
  }

  // 유저 조회
  const user = await userRepository.findByUserId(userId);
  if (!user) {
    throw { status: 404, message: "유저를 찾을 수 없습니다." };
  }

  try {
    const comment = await commentRepository.save({
      postId: request.postId,
      content: request.content,
      author: user,
    });

    return comment;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    throw new Error("댓글 작성에 실패했습니다.");
  }
};

export const deleteCommentService = async (id: number, userId: string) => {
  try {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }

    const user = await userRepository.findByUserId(userId);
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    if (comment.author.id !== user.id) {
      throw new Error("댓글 작성자와 일치하지 않습니다.");
    }

    await commentRepository.delete(id);
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    throw error;
  }
};

export const updateCommentService = async (
  id: number,
  content: string,
  userId: string
) => {
  try {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }
    // 유저 조회
    const user = await userRepository.findByUserId(userId);
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    if (comment.author.id !== user.id) {
      throw new Error("댓글 작성자와 일치하지 않습니다.");
    }

    comment.content = content;
    await commentRepository.update(comment);
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    throw error;
  }
};

export const rateComentService = async (
  request: RateCommentRequest,
  userId: string
) => {
  const comment = await commentRepository.findById(request.id);
  if (!comment) {
    throw { status: 404, message: "해당 댓글이 존재하지 않습니다." };
  }

  if (comment.isRated) {
    throw { status: 409, message: "이미 처리된 댓글입니다." };
  }

  // 게시글 조회
  const post = await postRepository.findById(comment.post.id);
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  // 유저 조회
  const user = await userRepository.findByUserId(userId);
  if (!user) {
    throw new Error("유저를 찾을 수 없습니다.");
  }

  // 게시글 작성자와 일치 여부 확인 (작성자 id와 토큰 유저 id 비교)
  if (post.author.id !== user.id) {
    throw new Error("게시글 작성자와 일치하지 않습니다.");
  }

  comment.isRated = true;
  await commentRepository.update(comment);
};

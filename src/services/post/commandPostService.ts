import {
  PostRequest,
  UpdatePostRequest,
} from "../../dtos/post/request/postRequest";
import { Post } from "../../entities/Post";
import { PostRepository } from "../../repository/post/postRepository";
import { UserRepository } from "../../repository/user/userRepository";
import { AppDataSource } from "../../config/data-source";

const postRepository = new PostRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);

export const createPostService = async (
  request: PostRequest,
  userId: string
) => {
  try {
    const user = await userRepository.findByUserId(userId);
    if (!user) throw new Error("유저가 존재하지 않습니다.");

    const post = new Post();
    post.title = request.title;
    post.content = request.content;
    post.author = user;
    post.createdAt = new Date();

    await postRepository.save(post);
  } catch (error) {
    console.error("게시글 작성 실패:", error);
    throw new Error("게시글 작성에 실패했습니다.");
  }
};

export const deletePostService = async (id: number, userId: string) => {
  try {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const user = await userRepository.findByUserId(userId);
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    if (post.author.id !== user.id) {
      throw new Error("게시글 작성자와 일치하지 않습니다.");
    }

    await postRepository.delete(id);
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
};

export const updatePostService = async (
  id: number,
  request: UpdatePostRequest,
  userId: string
) => {
  try {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const user = await userRepository.findByUserId(userId);
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    if (post.author.id !== user.id) {
      throw new Error("게시글 작성자와 일치하지 않습니다.");
    }

    await postRepository.update(id, request.content);
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};

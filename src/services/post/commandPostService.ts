import { todo } from "node:test";
import {
  PostRequest,
  UpdatePostRequest,
} from "../../dtos/post/request/postRequest";
import { Post } from "../../entities/Post";
import { PostRepository } from "../../repository/post/postRepository";

const postRepository = new PostRepository();

export const createPostService = async (request: PostRequest) => {
  try {
    todo("토큰 기반 유저 아이디 검증 로직");

    const post = new Post();
    post.title = request.title;
    post.content = request.content;
    // post.author = 검증된 유저
    post.createdAt = new Date();

    await postRepository.save(post);
  } catch (error) {
    console.error("Post creation failed:", error);
    throw new Error("Post creation failed");
  }
};

export const deletePostService = async (id: number) => {
  // if (await todo("유저 비교 함수 호출")) {
  try {
    await postRepository.delete(id);
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw new Error("게시글 삭제에 실패했습니다.");
  }
  // } else {
  //   throw new Error("작성자가 일치하지 않습니다.");
  // }
};

export const updatePostService = async (
  id: number,
  request: UpdatePostRequest
) => {
  // if (await todo("유저 비교 함수 호출")) {
  try {
    await postRepository.update(id, request.content);
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw new Error("게시글 수정에 실패했습니다.");
  }
  // } else {
  //   throw new Error("작성자가 일치하지 않습니다.");
  // }
};

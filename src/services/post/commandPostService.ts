import { todo } from "node:test";
import {
  PostRequest,
  UpdatePostRequest,
} from "../../dtos/post/request/postRequest";
import { Post } from "../../entities/Post";
import { PostRepository } from "../../repository/post/postRepository";
import { PostDetailResponse } from "../../dtos/post/response/postResponse";

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
    console.error("게시글 작성 실패:", error);
    throw new Error("게시글 작성에 실패했습니다.");
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

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const queryPostDetailService = async (
  id: number
): Promise<PostDetailResponse> => {
  const post = await postRepository.findById(id);
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }
  const response = PostDetailResponse.from(post);
  return response;
};

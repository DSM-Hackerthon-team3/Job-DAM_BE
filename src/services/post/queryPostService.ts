import {
  PostDetailResponse,
  PostListResponse,
} from "../../dtos/post/response/postResponse";
import { PostRepository } from "../../repository/post/postRepository";

import { AppDataSource } from "../../config/data-source";

const postRepository = new PostRepository(AppDataSource);

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
  console.log(post);

  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  const commentsCnt = post.comments.length;
  return PostDetailResponse.from(post);
};

export const queryPostListService = async (): Promise<PostListResponse[]> => {
  const posts = await postRepository.findAll();
  console.log(posts);

  // return posts.map((post) => PostListResponse.from(post));
  return posts.map((post) => PostListResponse.from(post));
};

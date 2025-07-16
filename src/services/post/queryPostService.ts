import { PostDetailResponse, PostListResponse } from "../../dtos/post/response/postResponse";
import { PostRepository } from "../../repository/post/postRepository";

const postRepository = new PostRepository();

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

  const commentsCnt = await postRepository.countCommentsByPostId(id);
  return PostDetailResponse.from(post, commentsCnt);
};

export const queryPostListService = async (): Promise<PostListResponse[]> => {
  const postsWithCounts = await postRepository.findAllWithCommentCount();
  return postsWithCounts.map((row) => PostListResponse.fromRaw(row));
};
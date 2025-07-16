import {
  PostRequest,
  UpdatePostRequest,
} from "../../dtos/post/request/postRequest";
import { Post } from "../../entities/Post";
import { PostRepository } from "../../repository/post/postRepository";
import { UserRepository } from "../../repository/user/userRepository.1";

const postRepository = new PostRepository();
const userRepository = new UserRepository();

export const createPostService = async (request: PostRequest) => {
  try {
    // 유저 고정 조회(임시)
    const user = await userRepository.findByIdx(1);
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

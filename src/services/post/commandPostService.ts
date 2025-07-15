import { todo } from "node:test";
import { PostRequest } from "../../dtos/post/request/postRequest";
import { Post } from "../../entities/Post";
import { PostRepository } from "../../repository/post/postRepository";

const postRepository = new PostRepository();

export const createPostService = async (request: PostRequest) => {
  try {
    todo("유저 아이디 검증 로직");

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

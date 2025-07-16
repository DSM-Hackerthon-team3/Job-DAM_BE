import { Post } from "../../../entities/Post";
import { formatDate } from "../../../services/post/queryPostService";

export class PostDetailResponse {
  id!: number;
  title!: string;
  content!: string;
  createdAt!: string;
  author: string = "사람";
  commentsCnt!: number;

  static from(post: Post, commentsCnt: number): PostDetailResponse {
    const dto = new PostDetailResponse();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = formatDate(post.createdAt);
    dto.commentsCnt = commentsCnt;
    return dto;
  }
}

export class PostListResponse {
  id!: number;
  title!: string;
  content!: string;
  createdAt!: string;
  commentsCnt!: number;

  static from(post: Post, commentsCnt: number): PostListResponse {
    const dto = new PostListResponse();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = formatDate(post.createdAt);
    dto.commentsCnt = commentsCnt;
    return dto;
  }

  static fromRaw(raw: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    commentsCnt: number | string;
  }): PostListResponse {
    const dto = new PostListResponse();
    dto.id = raw.id;
    dto.title = raw.title;
    dto.content = raw.content;
    dto.createdAt = formatDate(raw.createdAt);
    dto.commentsCnt = Number(raw.commentsCnt);
    return dto;
  }
}
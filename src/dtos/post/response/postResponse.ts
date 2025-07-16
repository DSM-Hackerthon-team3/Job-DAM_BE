import { Post } from "../../../entities/Post";
import { formatDate } from "../../../services/post/queryPostService";
import { CommentListResponse } from "../../comment/response/commentResponse";

export class PostDetailResponse {
  id!: number;
  title!: string;
  content!: string;
  createdAt!: string;
  author: string = "사람";
  commentList!: CommentListResponse;

  static from(post: Post): PostDetailResponse {
    const dto = new PostDetailResponse();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = formatDate(post.createdAt);
    dto.author = post.author?.id || "사람";
    dto.commentList = CommentListResponse.from(post.comments || []);
    return dto;
  }
}

export class PostListResponse {
  id!: number;
  author: string = "작성자";
  title!: string;
  content!: string;
  createdAt!: string;
  commentsCnt!: number;

  static from(post: Post): PostListResponse {
    const dto = new PostListResponse();
    dto.id = post.id;
    dto.author = post.author.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = formatDate(post.createdAt);
    dto.commentsCnt = post.comments.length;
    return dto;
  }

  static fromRaw(raw: {
    id: number;
    author: string;
    title: string;
    content: string;
    createdAt: Date;
    commentsCnt: number | string;
  }): PostListResponse {
    const dto = new PostListResponse();
    dto.id = raw.id;
    dto.author = raw.author;
    dto.title = raw.title;
    dto.content = raw.content;
    dto.createdAt = formatDate(raw.createdAt);
    dto.commentsCnt = Number(raw.commentsCnt);
    return dto;
  }
}

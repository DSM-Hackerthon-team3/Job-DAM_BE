import { Post } from "../../../entities/Post";
import { formatDate } from "../../../services/post/commandPostService";
import { CommentListResponse } from "../../comment/response/commentResponse";

export class PostDetailResponse {
  id!: number;
  title!: string;
  content!: string;
  createdAt!: string;
  // author!: User; // 유저 정보 추가 필요
  author: string = "사람";
  commentList!: CommentListResponse;

  static from(post: Post): PostDetailResponse {
    const dto = new PostDetailResponse();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = formatDate(post.createdAt);
    // dto.author = post.author; // 유저 정보 추가 필요
    dto.commentList = CommentListResponse.from(post.comments || []);
    return dto;
  }
}

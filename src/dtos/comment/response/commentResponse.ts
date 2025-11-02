import { Comment } from "../../../entities/Comment";
import { Post } from "../../../entities/Post";
import { formatDate } from "../../../services/post/queryPostService";

export class CommentResponse {
  id!: number;
  content!: string;
  createdAt!: string;
  isRated!: Boolean;
  author!: string;

  static from(entity: Comment): CommentResponse {
    const dto = new CommentResponse();
    dto.id = entity.id;
    dto.content = entity.content;
    dto.createdAt = formatDate(entity.createdAt);
    dto.author = entity.author.id;
    dto.isRated = entity.isRated;
    return dto;
  }
}

export class CommentListResponse {
  comments!: CommentResponse[];
  commentsCnt!: number;

  static from(entities: Comment[]): CommentListResponse {
    const dto = new CommentListResponse();
    dto.comments = entities.map(CommentResponse.from);
    dto.commentsCnt = dto.comments.length;
    return dto;
  }
}

export class PostResponse {
  id: number;
  title: string;
  content: string;
  commentCount: number;

  constructor(post: Post, commentCount: number) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.commentCount = commentCount;
  }
}

export class SimpleCommentResponse {
  id!: number;
  content!: string;

  static from(entity: Comment): SimpleCommentResponse {
    const dto = new SimpleCommentResponse();
    dto.id = entity.id;
    dto.content = entity.content;
    return dto;
  }
}

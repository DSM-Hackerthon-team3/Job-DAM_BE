import { Comment } from "../../../entities/Comment";

export class CommentResponse {
  id!: number;
  content!: string;
  createdAt!: Date;
  // author!: User; // 유저 정보 추가 필요
  author: string = "사람";

  static from(entity: Comment): CommentResponse {
    const dto = new CommentResponse();
    dto.id = entity.id;
    dto.content = entity.content;
    dto.createdAt = entity.createdAt;
    // dto.author = entity.author; // 유저 정보 추가 필요
    dto.author = "사람"; // 임시로 작성자 이름 설정
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

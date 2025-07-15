import { Length } from "class-validator";

export class CommentRequest {
  @Length(1, 500)
  content!: string;
  postId!: number;
}

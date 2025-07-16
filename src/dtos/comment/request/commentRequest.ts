import { IsNumber, Length, Max, Min } from "class-validator";

export class CommentRequest {
  @Length(1, 500)
  content!: string;
  postId!: number;
}

export class RateCommentRequest {
  id!: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  point!: number;
}

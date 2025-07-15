import { Length } from "class-validator";

export class PostRequest {
  @Length(1, 100)
  title!: string;
  @Length(1, 5000)
  content!: string;
  authorId!: string;
}

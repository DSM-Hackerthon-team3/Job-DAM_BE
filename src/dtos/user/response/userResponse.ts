import { Gender } from "../../../entities/enum/Gender";

export interface UserTokenResponse {
  accessToken: string;
}

export class SimplePostResponse {
  id!: number;
  title!: string;
  content!: string;

  static from(post: {
    id: number;
    title: string;
    content: string;
  }): SimplePostResponse {
    const dto = new SimplePostResponse();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    return dto;
  }
}

export class UserMyPageResponse {
  id!: string;
  jobType: string = "학생";
  gender!: Gender;
  posts!: SimplePostResponse[];
}

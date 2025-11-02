import { Gender } from "../../../entities/enum/Gender";
import { JobPosition } from "../../../entities/enum/Position";
import { SimpleCommentResponse } from "../../comment/response/commentResponse";

export interface AdminTokenResponse {
  accessToken: string;
}

export class AdminMyPageResponse {
  id!: string;
  position!: JobPosition;
  gender!: Gender;
  point!: number;
  commentList!: SimpleCommentResponse[];
}

import {
  IsString,
  Length,
  IsEnum,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { Gender } from "../../../entities/enum/Gender";

export enum SchoolLevel {
  초등학교 = "초등학교",
  중학교 = "중학교",
  고등학교 = "고등학교",
}

export class UserRegisterRequest {
  @IsString()
  @Length(2, 20, { message: "아이디는 2~20자 사이여야 합니다." })
  id!: string;

  @IsString()
  @Length(4, 20, { message: "비밀번호는 4~20자 사이여야 합니다." })
  password!: string;

  @IsOptional()
  @IsEnum(SchoolLevel, {
    message: "학년은 초등학교, 중학교, 고등학교 중 하나여야 합니다.",
  })
  schoolLevel!: SchoolLevel;

  @IsEnum(Gender)
  gender!: Gender;
}

export class UserLoginRequest {
  @IsString()
  id!: string;

  @IsString()
  password!: string;
}

export class AptitudeTestRequest {
  @IsArray()
  @ArrayNotEmpty()
  answers!: string[]; // 적성검사 답변 배열, 구체 타입에 맞게 수정 가능
}

export class JobExperienceRequest {
  @IsString()
  input!: string; // GPT 모의 대화 입력
}

export class TrustEvaluationRequest {
  @IsNumber()
  commentId!: number; // 평가 대상 답변 ID

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number; // 신뢰도 평가 값 (예: 점수, 등급 등)
}

export class UserProfileRequest {
  @IsOptional()
  @IsEnum(SchoolLevel, {
    message: "학년은 초등학교, 중학교, 고등학교 중 하나여야 합니다.",
  })
  schoolLevel?: SchoolLevel;
}

export class UserChangePasswordRequest {
  @IsString()
  currentPassword!: string;

  @IsString()
  newPassword!: string;
}

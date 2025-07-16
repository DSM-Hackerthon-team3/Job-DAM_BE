import { IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { Position, Gender } from '../../../entities/Admin';

export class AdminRegisterRequest {
  @IsString()
  @Length(2, 20, { message: '아이디는 2~20자 사이여야 합니다.' })
  id!: string;

  @IsString()
  @Length(4, 20, { message: '비밀번호는 4~20자 사이여야 합니다.' })
  password!: string;

  @IsEnum(Position, { message: '유효한 직종을 선택해주세요.' })
  position!: Position;

  @IsOptional()
  @IsString()
  credentials?: string;

  @IsOptional()
  @IsEnum(Gender, { message: '유효한 성별을 선택해주세요.' })
  gender?: Gender;
}

export class AdminLoginRequest {
  @IsString()
  id!: string;

  @IsString()
  password!: string;
}

export class AdminUpdateProfileRequest {
  @IsOptional()
  @IsEnum(Position, { message: '유효한 직종을 선택해주세요.' })
  position?: Position;

  @IsOptional()
  @IsString()
  credentials?: string;

  @IsOptional()
  @IsEnum(Gender, { message: '유효한 성별을 선택해주세요.' })
  gender?: Gender;
}

export class AdminChangePasswordRequest {
  @IsString()
  currentPassword!: string;

  @IsString()
  newPassword!: string;
}
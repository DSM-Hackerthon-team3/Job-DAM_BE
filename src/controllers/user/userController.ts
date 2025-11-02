import { Request, Response } from "express";
import { validate } from "class-validator";
import {
  UserRegisterRequest,
  UserLoginRequest,
  AptitudeTestRequest,
  JobExperienceRequest,
  TrustEvaluationRequest,
  UserProfileRequest,
  UserChangePasswordRequest,
} from "../../dtos/user/request/userRequest";
import { UserService } from "../../services/user/userService";
import { AppDataSource } from "../../config/data-source";
import { generateAccessToken } from "../../utils/jwt";

const userService = new UserService(AppDataSource);

export class UserController {
  async register(req: Request<{}, {}, UserRegisterRequest>, res: Response) {
    const registerRequest = Object.assign(new UserRegisterRequest(), req.body);
    const errors = await validate(registerRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "입력값이 유효하지 않습니다.", errors });
    }
    try {
      const result = await userService.createUser(registerRequest);
      return res.status(201).json(result);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "회원가입 실패", error: error.message || error });
    }
  }

  async login(req: Request<{}, {}, UserLoginRequest>, res: Response) {
    const loginRequest = Object.assign(new UserLoginRequest(), req.body);
    const errors = await validate(loginRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "입력값이 유효하지 않습니다.", errors });
    }
    try {
      const result = await userService.loginUser(loginRequest);
      return res.status(200).json(result);
    } catch (error: any) {
      return res
        .status(401)
        .json({ message: "로그인 실패", error: error.message || error });
    }
  }

  async aptitudeTest(
    req: Request<{ id: string }, {}, AptitudeTestRequest>,
    res: Response
  ) {
    const aptitudeRequest = Object.assign(new AptitudeTestRequest(), req.body);
    const errors = await validate(aptitudeRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "입력값이 유효하지 않습니다.", errors });
    }
    try {
      const userId = req.params.id;
      const result = await userService.aptitudeTest(
        userId,
        aptitudeRequest.answers
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "적성검사 실패", error: error.message || error });
    }
  }

  async jobExperience(
    req: Request<{ id: string }, {}, JobExperienceRequest>,
    res: Response
  ) {
    const jobExpRequest = Object.assign(new JobExperienceRequest(), req.body);
    const errors = await validate(jobExpRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "입력값이 유효하지 않습니다.", errors });
    }
    try {
      const userId = req.params.id;
      const response = await userService.jobExperience(
        userId,
        jobExpRequest.input
      );
      return res.status(200).json(response);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "직업체험 실패", error: error.message || error });
    }
  }

  async trustEvaluation(
    req: Request<{ id: string }, {}, TrustEvaluationRequest>,
    res: Response
  ) {
    const trustRequest = Object.assign(new TrustEvaluationRequest(), req.body);
    const errors = await validate(trustRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "입력값이 유효하지 않습니다.", errors });
    }
    try {
      const userId = req.params.id;
      const result = await userService.rating(
        userId,
        trustRequest.commentId,
        trustRequest.rating
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "신뢰도 평가 실패", error: error.message || error });
    }
  }

  async getMyPage(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다.",
        error: error.message || error,
      });
    }
  }

  async updateProfile(
    req: Request<{ id: string }, {}, UserProfileRequest>,
    res: Response
  ) {
    const updateRequest = Object.assign(new UserProfileRequest(), req.body);
    const errors = await validate(updateRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "입력값이 유효하지 않습니다.", errors });
    }
    try {
      const userId = req.params.id;
      const updatedUser = await userService.updateUserProfile(
        userId,
        updateRequest
      );
      return res.status(200).json({ message: "프로필 수정 성공", updatedUser });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "프로필 수정 실패", error: error.message || error });
    }
  }

  async changePassword(
    req: Request<{ id: string }, {}, UserChangePasswordRequest>,
    res: Response
  ) {
    const changePasswordRequest = Object.assign(
      new UserChangePasswordRequest(),
      req.body
    );
    const errors = await validate(changePasswordRequest);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "입력값이 유효하지 않습니다.", errors });
    }
    try {
      const userId = req.params.id;
      await userService.changeUserPassword(
        userId,
        changePasswordRequest.currentPassword,
        changePasswordRequest.newPassword
      );
      return res.status(200).json({ message: "비밀번호 변경 성공" });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "비밀번호 변경 실패", error: error.message || error });
    }
  }

  async existsId(req: Request, res: Response) {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ message: "id 쿼리 파라미터가 필요합니다." });
    }
    try {
      const exists = await userService.existsByUserId(id);
      return res.status(200).json({ exists });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "중복 확인 실패", error: error.message || error });
    }
  }

  async getUserMyPage(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== "USER") {
        return res.status(403).json({ message: "유저 권한이 필요합니다." });
      }

      const result = await userService.getUserMyPage(user.id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "마이페이지 조회에 실패했습니다.",
        error: error.message || error,
      });
    }
  }
}

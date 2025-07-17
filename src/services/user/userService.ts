import { DataSource } from "typeorm";
import { User } from "../../entities/User";
import { UserRepository } from "../../repository/user/userRepository";
import * as bcrypt from "bcrypt";
import { generateAccessToken } from "../../utils/jwt";
import { SchoolLevel } from "../../entities/enum/SchoolLevel";
import {
  UserTokenResponse,
  UserMyPageResponse,
  SimplePostResponse,
} from "../../dtos/user/response/userResponse";
import {
  UserLoginRequest,
  UserRegisterRequest,
} from "../../dtos/user/request/userRequest";
import { AppDataSource } from "../../config/data-source";
import { Post } from "../../entities/Post";

export class UserService {
  private userRepository: UserRepository;

  constructor(private dataSource: DataSource) {
    this.userRepository = new UserRepository(dataSource);
  }

  async createUser(request: UserRegisterRequest): Promise<UserTokenResponse> {
    const existingUser = await this.userRepository.findByUserId(request.id);
    if (existingUser) {
      throw new Error("이미 존재하는 사용자 ID입니다.");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(request.password, saltRounds);

    const newUser = await this.userRepository.save({
      ...request,
      password: hashedPassword,
    });
    const accessToken = this.generateUserAccessToken(newUser);

    return { accessToken };
  }

  private generateUserAccessToken(user: User): string {
    const payload = { id: user.id, role: user.role };
    return generateAccessToken(payload);
  }

  async loginUser(loginRequest: UserLoginRequest): Promise<UserTokenResponse> {
    const { id, password } = loginRequest;
    const user = await this.userRepository.findByUserId(id);
    if (!user) {
      throw new Error("존재하지 않는 사용자 ID입니다.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("잘못된 비밀번호입니다.");
    }
    const accessToken = this.generateUserAccessToken(user);
    return { accessToken };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findByUserId(id);

    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    return user;
  }

  async updateUserProfile(
    id: string,
    profileData: {
      schoolLevel?: SchoolLevel;
    }
  ): Promise<User> {
    const user = await this.userRepository.findByUserId(id);

    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    await this.userRepository.updateUser(id, profileData);

    const updatedUser = await this.userRepository.findByUserId(id);
    return updatedUser!;
  }

  async aptitudeTest(userId: string, answers: string[]): Promise<any> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    // 간단한 적성검사 결과 생성
    const testResult = {
      answers,
      result: "적성검사 결과: 당신은 개발자에 적합합니다.",
      timestamp: new Date(),
    };

    await this.userRepository.updateUser(userId, {
      aptitudeTestResult: testResult,
    });

    return testResult;
  }

  async jobExperience(userId: string, input: string): Promise<any> {
    // 직업 체험 로직 구현 (예: GPT 모의 대화 처리)
    // 현재는 간단한 더미 데이터를 반환합니다.
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    console.log(
      `User ${userId} participated in job experience with input: ${input}`
    );
    return {
      userId,
      response: `직업 체험 응답: ${input}에 대한 흥미로운 답변입니다.`,
    };
  }

  async rating(
    userId: string,
    commentId: number,
    rating: number
  ): Promise<any> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    console.log(
      `유저 ${userId}님이 답변 ${commentId}에 대해 평점 ${rating}점을 주었습니다.`
    );
    return {
      userId,
      commentId,
      rating,
      message: "평점 평가가 완료되었습니다.",
    };
  }

  async changeUserPassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findByUserId(id);

    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("현재 비밀번호가 올바르지 않습니다.");
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.userRepository.updatePassword(id, hashedNewPassword);
  }

  async existsByUserId(id: string): Promise<boolean> {
    return await this.userRepository.existsByUserId(id);
  }

  async getUserMyPage(id: string): Promise<UserMyPageResponse> {
    const user = await this.userRepository.findByUserId(id);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    const postRepo = AppDataSource.getRepository(Post);
    const posts = await postRepo.find({
      where: { author: user },
      order: { createdAt: "DESC" },
    });

    const postList = posts.map(SimplePostResponse.from);

    return {
      id: user.id,
      jobType: "학생",
      gender: user.gender,
      posts: postList,
    };
  }
}

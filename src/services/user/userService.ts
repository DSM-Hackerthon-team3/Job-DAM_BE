import { DataSource } from 'typeorm';
import { User, SchoolLevel } from '../../entities/User';
import { UserRepository } from '../../repository/user/userRepository';
import { CommentRepository } from '../../repository/comment/commentRepository';
import { Comment } from '../../entities/Comment';
import * as bcrypt from 'bcrypt';
import { getAptitudeTestResult } from '../careerApiService';

export class UserService {

  private userRepository: UserRepository;
  private commentRepository: CommentRepository;

  constructor(private dataSource: DataSource) {
    this.userRepository = new UserRepository();
    this.commentRepository = new CommentRepository(dataSource);
  }

  async createUser(userData: {
    id: string;
    password: string;
    schoolLevel?: SchoolLevel;
  }): Promise<User> {
  
    const existingUser = await this.userRepository.findByUserId(userData.id);
    if (existingUser) {
      throw new Error('이미 존재하는 사용자 ID입니다.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword
    });

    return newUser;
  }

  async loginUser(id: string, password: string): Promise<User> {
    const user = await this.userRepository.findByUserId(id);
    
    if (!user) {
      throw new Error('존재하지 않는 사용자 ID입니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('잘못된 비밀번호입니다.');
    }

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findByUserId(id);
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async updateUserProfile(id: string, profileData: {
    schoolLevel?: SchoolLevel;
  }): Promise<User> {
    const user = await this.userRepository.findByUserId(id);
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.updateUser(id, profileData);
    
    const updatedUser = await this.userRepository.findByUserId(id);
    return updatedUser!;
  }

  async aptitudeTest(userId: string, answers: string[]): Promise<any> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const testResult = await getAptitudeTestResult({ answers });

    await this.userRepository.updateUser(userId, { aptitudeTestResult: testResult });

    return testResult;
  }

  async jobExperience(userId: string, input: string): Promise<any> {
    // 직업 체험 로직 구현 (예: GPT 모의 대화 처리)
    // 현재는 간단한 더미 데이터를 반환합니다.
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    console.log(`User ${userId} participated in job experience with input: ${input}`);
    return { userId, response: `직업 체험 응답: ${input}에 대한 흥미로운 답변입니다.` };
  }

  async evaluateTrust(userId: string, commentId: number, rating: number): Promise<Comment> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('답변을 찾을 수 없습니다.');
    }

    if (comment.isRated) {
      throw new Error('이미 평가된 답변입니다.');
    }

    comment.isRated = true;
    comment.rating = rating;
    comment.ratedBy = user;

    return await this.commentRepository.update(comment);
  }

  async changeUserPassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByUserId(id);
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('현재 비밀번호가 올바르지 않습니다.');
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.userRepository.updatePassword(id, hashedNewPassword);
  }
}
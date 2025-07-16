import { DataSource } from 'typeorm';
import { User, SchoolLevel } from '../../entities/User';
import { UserRepository } from '../../repository/user/userRepository.1';
import * as bcrypt from 'bcrypt';

export class UserService {

  private userRepository: UserRepository;

  constructor(private dataSource: DataSource) {
    this.userRepository = new UserRepository(dataSource);
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
    // 적성검사 로직 구현 (예: 답변 분석, 결과 반환)
    // 현재는 간단한 더미 데이터를 반환합니다.
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    console.log(`User ${userId} completed aptitude test with answers: ${answers}`);
    return { userId, result: '적성검사 결과: 당신은 개발자에 적합합니다.' };
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

  async evaluateTrust(userId: string, answerId: string, rating: string): Promise<any> {
    // 신뢰도 평가 로직 구현 (예: 답변에 대한 신뢰도 업데이트)
    // 현재는 간단한 더미 데이터를 반환합니다.
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    console.log(`User ${userId} evaluated answer ${answerId} with rating: ${rating}`);
    return { userId, answerId, rating, message: '신뢰도 평가가 완료되었습니다.' };
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
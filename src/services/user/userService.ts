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
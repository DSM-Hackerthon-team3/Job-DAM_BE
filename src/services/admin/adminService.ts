import { DataSource } from 'typeorm';
import { Admin, Position } from '../../entities/Admin';
import { AdminRepository } from '../../repository/admin/adminRepository';
import * as bcrypt from 'bcrypt';

export class AdminService {
  private adminRepository: AdminRepository;

  constructor(private dataSource: DataSource) {
    this.adminRepository = new AdminRepository(dataSource);
  }

  async createAdmin(adminData: {
    id: string;
    password: string;
    position: Position; // position 필수로 변경 (엔티티 기준)
    credentials?: string;
  }): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findByAdminId(adminData.id);
    if (existingAdmin) {
      throw new Error('이미 존재하는 관리자 ID입니다.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    const newAdmin = await this.adminRepository.createAdmin({
      ...adminData,
      password: hashedPassword,
    });

    return newAdmin;
  }

  async loginAdmin(id: string, password: string): Promise<Admin> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error('존재하지 않는 관리자 ID입니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('잘못된 비밀번호입니다.');
    }

    return admin;
  }

  async getAdminById(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error('관리자를 찾을 수 없습니다.');
    }

    return admin;
  }

  async updateAdminProfile(
    id: string,
    profileData: {
      position?: Position;
      credentials?: string;
    }
  ): Promise<Admin> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error('관리자를 찾을 수 없습니다.');
    }

    await this.adminRepository.updateAdmin(id, profileData);

    const updatedAdmin = await this.adminRepository.findByAdminId(id);
    return updatedAdmin!;
  }

  async changeAdminPassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error('관리자를 찾을 수 없습니다.');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error('현재 비밀번호가 올바르지 않습니다.');
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.adminRepository.updatePassword(id, hashedNewPassword);
  }
}
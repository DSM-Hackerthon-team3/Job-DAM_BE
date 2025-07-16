import { DataSource } from "typeorm";
import { Admin } from "../../entities/Admin";
import { AdminRepository } from "../../repository/admin/adminRepository";
import { CommentRepository } from "../../repository/comment/commentRepository";
import * as bcrypt from "bcrypt";
import { generateAccessToken } from "../../utils/jwt";
import {
  AdminMyPageResponse,
  AdminTokenResponse,
} from "../../dtos/admin/response/adminResponse";
import { AdminRegisterRequest } from "../../dtos/admin/request/adminRequest";
import { Comment } from "../../entities/Comment";
import { Post } from "../../entities/Post";
import { AppDataSource } from "../../config/data-source";
import { SimpleCommentResponse } from "../../dtos/comment/response/commentResponse";
import { JobPosition } from "../../entities/enum/Position";
import { Gender } from "../../entities/enum/Gender";

export class AdminService {
  private adminRepository: AdminRepository;
  private commentRepository: CommentRepository;

  constructor(private dataSource: DataSource) {
    this.adminRepository = new AdminRepository(dataSource);
    this.commentRepository = new CommentRepository(dataSource);
  }

  private generateAdminAccessToken(admin: Admin): string {
    const payload = { id: admin.id, role: admin.role };
    return generateAccessToken(payload);
  }

  async createAdmin(
    request: AdminRegisterRequest
  ): Promise<AdminTokenResponse> {
    const existingAdmin = await this.adminRepository.findByAdminId(request.id);
    if (existingAdmin) {
      throw new Error("이미 존재하는 관리자 ID입니다.");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(request.password, saltRounds);

    const newAdmin = await this.adminRepository.createAdmin({
      ...request,
      password: hashedPassword,
    });

    const accessToken = this.generateAdminAccessToken(newAdmin);
    return { accessToken };
  }

  async loginAdmin(id: string, password: string): Promise<AdminTokenResponse> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error("존재하지 않는 관리자 ID입니다.");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error("잘못된 비밀번호입니다.");
    }

    const accessToken = this.generateAdminAccessToken(admin);
    return { accessToken };
  }

  async getAdminById(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error("관리자를 찾을 수 없습니다.");
    }

    return admin;
  }

  async getAdminProfileWithTrustScore(
    id: string
  ): Promise<Admin & { trustScore: number }> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ["posts", "posts.comments"],
    });

    if (!admin) {
      throw new Error("관리자를 찾을 수 없습니다.");
    }

    let totalRating = 0;
    let ratedCommentsCount = 0;

    if (admin.posts) {
      admin.posts.forEach((post: Post) => {
        if (post.comments) {
          post.comments.forEach((comment: Comment) => {
            if (
              comment.isRated &&
              comment.rating !== null &&
              comment.rating !== undefined
            ) {
              totalRating += comment.rating;
              ratedCommentsCount++;
            }
          });
        }
      });
    }

    const trustScore =
      ratedCommentsCount > 0 ? totalRating / ratedCommentsCount : 0;

    return { ...admin, trustScore };
  }

  async updateAdminProfile(
    id: string,
    profileData: {
      position?: JobPosition;
      credentials?: string;
      gender?: Gender;
    }
  ): Promise<Admin> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error("관리자를 찾을 수 없습니다.");
    }

    await this.adminRepository.updateAdmin(id, profileData);

    const updatedAdmin = await this.adminRepository.findByAdminId(id);
    if (!updatedAdmin) {
      throw new Error("프로필 업데이트 후 관리자를 찾을 수 없습니다.");
    }
    return updatedAdmin;
  }

  async changeAdminPassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const admin = await this.adminRepository.findByAdminId(id);

    if (!admin) {
      throw new Error("관리자를 찾을 수 없습니다.");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("현재 비밀번호가 올바르지 않습니다.");
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.adminRepository.updatePassword(id, hashedNewPassword);
  }

  async existsByAdminId(id: string): Promise<boolean> {
    return await this.adminRepository.existsByAdminId(id);
  }

  async getAdminMyPage(id: string): Promise<AdminMyPageResponse> {
    const admin = await this.adminRepository.findByAdminId(id);
    if (!admin) throw new Error("관리자를 찾을 수 없습니다.");

    // 댓글 조회 (author가 Admin인 경우)
    const commentRepo = AppDataSource.getRepository(Comment);
    const comments = await commentRepo.find({
      where: { author: admin },
      order: { createdAt: "DESC" },
    });

    const commentList = comments.map(SimpleCommentResponse.from);

    return {
      id: admin.id,
      position: admin.position,
      point: admin.point,
      commentList,
    };
  }
}

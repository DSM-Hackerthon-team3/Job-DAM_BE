import { Request, Response } from 'express';
import { AdminService } from '../../services/admin/adminService';
import { AppDataSource } from '../../config/data-source';
import { Position } from '../../entities/Admin';  // 엔티티 파일 경로에 맞게 조정하세요

const adminService = new AdminService(AppDataSource);

class AdminController {

  // 회원가입
  async register(req: Request, res: Response) {
    try {
      const { id, password, position, gender } = req.body;

      if (!id || !password || !position) {
        return res.status(400).json({ message: '아이디, 비밀번호, 직종(position)은 필수 입력값입니다.' });
      }

      // 아이디, 비밀번호 길이 검증
      if (id.length < 2 || id.length > 20) {
        return res.status(400).json({ message: '아이디는 2~20자여야 합니다.' });
      }
      if (password.length < 4 || password.length > 20) {
        return res.status(400).json({ message: '비밀번호는 4~20자여야 합니다.' });
      }

      // position Enum 검증
      if (!Object.values(Position).includes(position)) {
        return res.status(400).json({ message: '유효하지 않은 직종(position)입니다.' });
      }

      const result = await adminService.createAdmin({ id, password, position, gender });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: '회원가입 실패', error });
    }
  }

  // 로그인
  async login(req: Request, res: Response) {
    try {
      const { id, password } = req.body;
      if (!id || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
      }
      const token = await adminService.loginAdmin(id, password);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ message: '로그인 실패', error });
    }
  }

  // 마이페이지 조회
  async getMyPage(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const profile = await adminService.getAdminProfileWithTrustScore(adminId);
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(404).json({ message: '어드민 정보를 찾을 수 없습니다.', error });
    }
  }

  // 게시글 댓글 작성
  async writeComment(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const { postId, comment } = req.body;
      if (!postId || !comment) {
        return res.status(400).json({ message: '게시글 ID와 댓글 내용을 입력해주세요.' });
      }
      const result = await adminService.writeComment(adminId, postId, comment);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: '댓글 작성 실패', error });
    }
  }

  // 마이페이지 수정
  async updateProfile(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const { position, credentials, gender } = req.body;
      if (!position && !credentials && !gender) {
        return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
      }
      const result = await adminService.updateAdminProfile(adminId, { position, credentials, gender });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: '프로필 수정 실패', error });
    }
  }

  // 비밀번호 변경
  async changePassword(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 입력해주세요.' });
      }
      await adminService.changeAdminPassword(adminId, currentPassword, newPassword);
      return res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
      return res.status(500).json({ message: '비밀번호 변경 실패', error });
    }
  }
}

export default new AdminController();
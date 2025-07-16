import { Request, Response } from "express";
import { AdminService } from "../../services/admin/adminService";
import { AppDataSource } from "../../config/data-source";
import { JobPosition } from "../../entities/enum/Position";
import { Gender } from "../../entities/enum/Gender";
import { Role } from "../../entities/enum/Role";
import { AdminRegisterRequest } from "../../dtos/admin/request/adminRequest";

const adminService = new AdminService(AppDataSource);

class AdminController {
  // 회원가입
  async register(req: Request, res: Response) {
    try {
      const { id, password, position, gender } =
        req.body as AdminRegisterRequest;

      if (!id || !password || !position) {
        return res.status(400).json({
          message: "아이디, 비밀번호, 직종(position)은 필수 입력값입니다.",
        });
      }

      // 아이디, 비밀번호 길이 검증
      if (id.length < 2 || id.length > 20) {
        return res.status(400).json({ message: "아이디는 2~20자여야 합니다." });
      }
      if (password.length < 4 || password.length > 20) {
        return res
          .status(400)
          .json({ message: "비밀번호는 4~20자여야 합니다." });
      }

      if (!Object.values(JobPosition).includes(position)) {
        return res
          .status(400)
          .json({ message: "유효하지 않은 직종(position)입니다." });
      }

      const result = await adminService.createAdmin({
        id,
        password,
        position: position as JobPosition,
        gender: gender as Gender,
      });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: "회원가입 실패", error });
    }
  }

  // 로그인
  async login(req: Request, res: Response) {
    try {
      const { id, password } = req.body;
      if (!id || !password) {
        return res
          .status(400)
          .json({ message: "아이디와 비밀번호를 입력해주세요." });
      }
      const result = await adminService.loginAdmin(id, password);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ message: "로그인 실패", error });
    }
  }

  // 마이페이지 조회
  async getMyPage(req: Request, res: Response) {
    try {
      const { id, role } = (req as any).user;
      console.log("User from token:", { id, role }); // 디버깅용 로그
      if (role !== "ADMIN") {
        console.log("Role check failed. Expected: ADMIN, Got:", role); // 디버깅용 로그
        return res.status(403).json({ message: "관리자만 접근 가능합니다." });
      }
      const response = await adminService.getAdminMyPage(id);
      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(404)
        .json({ message: "어드민 정보를 찾을 수 없습니다.", error });
    }
  }

  // 마이페이지 수정
  async updateProfile(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const { position, credentials } = req.body;
      if (!position && !credentials) {
        return res.status(400).json({ message: "수정할 내용을 입력해주세요." });
      }
      const result = await adminService.updateAdminProfile(adminId, {
        position,
        credentials,
      });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "프로필 수정 실패", error });
    }
  }

  // 비밀번호 변경
  async changePassword(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "현재 비밀번호와 새 비밀번호를 입력해주세요." });
      }
      await adminService.changeAdminPassword(
        adminId,
        currentPassword,
        newPassword
      );
      return res
        .status(200)
        .json({ message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (error) {
      return res.status(500).json({ message: "비밀번호 변경 실패", error });
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
      const exists = await adminService.existsByAdminId(id);
      return res.status(200).json({ exists });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "중복 확인 실패", error: error.message || error });
    }
  }

  async adminMyPage(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const response = await adminService.getAdminMyPage(adminId);
      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(404)
        .json({ message: "어드민 정보를 찾을 수 없습니다.", error });
    }
  }
}

export default new AdminController();

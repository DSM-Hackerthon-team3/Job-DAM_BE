import { Router } from "express";
import adminController from "../../controllers/admin/adminController";
import { jwtAuthMiddleware } from "../../middleware/auth";

const adminRouter = Router();

adminRouter.get("/admin/exist", adminController.existsId);

// 관리자 회원가입 라우트
adminRouter.post("/admin/register", adminController.register);

// 관리자 로그인 라우트
adminRouter.post("/admin/login", adminController.login);

adminRouter.get("/admin/mypage", jwtAuthMiddleware, adminController.getMyPage);

export default adminRouter;

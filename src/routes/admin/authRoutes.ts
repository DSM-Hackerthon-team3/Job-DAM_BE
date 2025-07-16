import { Router } from 'express';
import adminController from '../../controllers/admin/adminController';
import { adminAuthMiddleware } from '../../middleware/adminAuth';

const router = Router();

// 관리자 회원가입 라우트
router.post('/register', adminController.register);

// 관리자 로그인 라우트
router.post('/login', adminController.login);

// 관리자 비밀번호 변경 라우트 (인증 필요)
router.put('/password', adminAuthMiddleware, adminController.changePassword);

export default router;
import { Router } from 'express';
import adminController from '../../controllers/admin/adminController';
import { adminAuthMiddleware } from '../../middleware/adminAuth';

const router = Router();

// 관리자 프로필 조회 라우트 (인증 필요)
router.get('/:id', adminAuthMiddleware, adminController.getMyPage);

// 관리자 프로필 수정 라우트 (인증 필요)
router.put('/:id', adminAuthMiddleware, adminController.updateProfile);

// 게시글 댓글 작성
router.post('/:id/comment', adminAuthMiddleware, adminController.writeComment);

export default router;
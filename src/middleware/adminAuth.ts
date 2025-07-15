import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AdminRequest extends Request {
  admin?: any;
}

export const adminAuthMiddleware = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '관리자 토큰이 없습니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { adminId: number };
    
    // 임시로 관리자 정보 설정 (나중에 데이터베이스에서 조회)
    req.admin = { id: decoded.adminId };
    next();
  } catch (error) {
    res.status(401).json({ message: '관리자 토큰 검증에 실패했습니다.' });
  }
};
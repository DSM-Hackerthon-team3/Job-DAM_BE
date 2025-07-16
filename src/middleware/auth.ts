import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: number };
    
    // 임시로 사용자 정보 설정 (나중에 데이터베이스에서 조회)
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: '토큰 검증에 실패했습니다.' });
  }
};
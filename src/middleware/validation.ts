import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// 검증 결과 확인 미들웨어
export const validateResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '입력값이 유효하지 않습니다.',
      errors: errors.array()
    });
  }
  next();
};

// 회원가입 검증 규칙
export const validateUserRegistration = [
  body('id')
    .isLength({ min: 2, max: 20 })
    .withMessage('아이디는 2~20자 사이여야 합니다.')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('아이디는 영문과 숫자만 사용 가능합니다.'),
  
  body('password')
    .isLength({ min: 4, max: 20 })
    .withMessage('비밀번호는 4~20자 사이여야 합니다.'),
  
  body('schoolLevel')
    .isIn(['초등학교', '중학교', '고등학교'])
    .withMessage('학력은 초등학교, 중학교, 고등학교 중 하나여야 합니다.'),
  
  validateResult
];

// 로그인 검증 규칙
export const validateLogin = [
  body('id').notEmpty().withMessage('아이디를 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
  validateResult
];

// 관리자 회원가입 검증 규칙
export const validateAdminRegistration = [
  body('id')
    .isLength({ min: 2, max: 20 })
    .withMessage('아이디는 2~20자 사이여야 합니다.'),
  
  body('password')
    .isLength({ min: 4, max: 20 })
    .withMessage('비밀번호는 4~20자 사이여야 합니다.'),
  
  body('position')
    .isIn(['미정'])
    .withMessage('직종을 정확히 선택해주세요.'),
  
  validateResult
];
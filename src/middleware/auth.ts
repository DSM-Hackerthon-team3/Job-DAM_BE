import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../utils/jwt";

interface AuthRequest extends Request {
  user?: any;
}

export function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // if (req.method === "GET") return next();
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    console.log("Decoded token:", decoded); // 디버깅용 로그
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.log("Token verification error:", err); // 디버깅용 로그
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

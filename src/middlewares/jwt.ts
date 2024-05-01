import { NextFunction, Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../services/jwt.js";

interface AuthenticatedRequest extends Request {
  user: JwtPayload | string;
}

export function jwtMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token) {
    const user = verifyToken(token);
    req.user = user;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

import { NextFunction, Response, Request } from "express";
import { verifyJwtToken } from "../services/jwt.js";
import { ExtendedJwtPayload } from "../services/jwt.js";

export interface AuthenticatedRequest extends Request {
  user: ExtendedJwtPayload;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.slice(7);
  const cookie = req.cookies["token"];
  const accessToken = cookie ? cookie : token;
  try {
    const user = verifyJwtToken(accessToken) as ExtendedJwtPayload;
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
}

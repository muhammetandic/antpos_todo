import { NextFunction, Response, Request } from "express";
import { verifyJwtToken } from "../services/jwt.js";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user: JwtPayload | string;
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token) {
    const user = verifyJwtToken(token);
    (req as AuthenticatedRequest).user = user;
    next();
  } else {
    res.status(401).json({ error: "unauthorized" });
  }
}

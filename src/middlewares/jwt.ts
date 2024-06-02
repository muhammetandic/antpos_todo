import { NextFunction, Response, Request } from "express";
import { verifyJwtToken } from "../services/jwt.js";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user: JwtPayload | string;
}

export async function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.slice(7);
  if (token) {
    const user = await verifyJwtToken(token);
    (req as AuthenticatedRequest).user = user;
    next();
  } else {
    res.status(401).json({ error: "unauthorized" });
  }
}

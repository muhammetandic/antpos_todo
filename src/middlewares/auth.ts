import { NextFunction, Response, Request } from "express";
import { verifyJwtToken } from "../services/jwt.js";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user: JwtPayload | string;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.slice(7);
  const cookie = req.cookies["token"];
  const accessToken = cookie ? cookie : token;
  try {
    const user = await verifyJwtToken(accessToken);
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "unauthorized" });
  }
}

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user: JwtPayload | string;
}

export function createToken(userId: string, email: string) {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(
      {
        userId,
        email,
      },
      secret,
      { expiresIn: "1h" },
    );
  } catch (err) {
    throw new Error("Error in creating token", err);
  }
}

export function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Error in verifying token", err);
  }
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

import jwt, { JwtPayload } from "jsonwebtoken";

export interface ExtendedJwtPayload extends JwtPayload {
  email: string;
  id: string;
}

export function createJwtToken(userId: string, userEmail: string, expireDuration: number): string {
  const secret = process.env.JWT_SECRET || "";
  return jwt.sign({ email: userEmail, id: userId }, secret, { expiresIn: expireDuration });
}

export function verifyJwtToken(token: string): string | ExtendedJwtPayload {
  const secret = process.env.JWT_SECRET || "";

  const result = jwt.verify(token, secret);
  return result as ExtendedJwtPayload;
}

import jwt, { JwtPayload } from "jsonwebtoken";

export function createJwtToken(userEmail: string, expireDuration: number): string {
  const secret = process.env.JWT_SECRET || "";
  return jwt.sign({ email: userEmail }, secret, { expiresIn: expireDuration });
}

export async function verifyJwtToken(token: string): Promise<string | JwtPayload> {
  const secret = process.env.JWT_SECRET || "";
  return jwt.verify(token, secret);
}

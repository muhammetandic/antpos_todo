import jwt from "jsonwebtoken";

export function createJwtToken(email: string, expireDuration: number) {
  const secret = process.env.JWT_SECRET as string;
  try {
    return jwt.sign(
      {
        email,
      },
      secret,
      { expiresIn: expireDuration },
    );
  } catch (err) {
    throw new jwt.JsonWebTokenError("error when creating token");
  }
}

export function verifyJwtToken(token: string) {
  const secret = process.env.JWT_SECRET as string;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new jwt.JsonWebTokenError("error when verifying token");
  }
}

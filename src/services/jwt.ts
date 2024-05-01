import jwt from "jsonwebtoken";

export function createToken(userId: string, email: string, expireDuration: number) {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(
      {
        userId,
        email,
      },
      secret,
      { expiresIn: expireDuration },
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

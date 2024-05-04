import express, { Router, Request, Response, NextFunction } from "express";
import { createJwtToken } from "../../services/jwt.js";
import { IUser, User } from "./schema.js";
import { createHash } from "crypto";
import { SignUp, SetPassword, ForgottenPassword } from "./models.js";
import { TypedRequestBody } from "../../value-objects/request.js";
import { encrypt, decrypt } from "../../services/crypt.js";
import { asyncHandler } from "../../value-objects/asyncHandler.js";

const thirtyMinutes = 30 * 60 * 1000;
const oneHour = 60 * 60 * 1000;

export const authRouter: Router = express.Router();

authRouter.post("/signin", asyncHandler(signin));
authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/setpassword", asyncHandler(setPassword));
authRouter.post("/forgotpassword", asyncHandler(forgotPassword));

const createToken = (email: string) =>
  createHash("sha256")
    .update(email + Date.now())
    .digest("hex");

async function signin(req: Request, res: Response, _next: NextFunction) {
  const { email, password } = req.body;
  const expiresIn = new Date(Date.now() + oneHour);

  const user = await User.findOne<IUser>({ email: email, isDeleted: false });
  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }

  if (password !== decrypt(user?.password || "", user?.salt || "")) {
    return res.status(400).json({ error: "incorrect password" });
  }

  const token = createJwtToken(email, oneHour);
  return res.status(200).json({ email, token, expiresIn });
}

async function signup(req: TypedRequestBody<SignUp>, res: Response, _next: NextFunction) {
  const { email, name } = req.body;

  const isExist = await User.findOne<IUser>({ email: email, isDeleted: false });
  if (isExist) {
    return res.status(400).json({ error: "email already exist" });
  }

  const token = createToken(email);
  const tokenExpiresAt = new Date(Date.now() + thirtyMinutes);

  const user = new User<IUser>({
    email,
    name,
    token,
    tokenExpiresAt,
    isDeleted: false,
    createdAt: new Date(Date.now()),
  });

  await user.save();

  return res.status(200).json({ email, token });
}

async function setPassword(req: TypedRequestBody<SetPassword>, res: Response, _next: NextFunction) {
  const { email, token, password } = req.body;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }

  if (user?.token !== token) {
    return res.status(400).json({ error: "invalid token" });
  }

  if (user?.tokenExpiresAt && user?.tokenExpiresAt.getTime() < Date.now()) {
    return res.status(400).json({ error: "token expired" });
  }

  const { encryptedText, salt } = encrypt(password);

  await user.updateOne({
    password: encryptedText,
    salt,
    token: null,
    tokenExpiresAt: null,
    updatedAt: new Date(Date.now()),
  });

  return res.status(200).json({});
}

async function forgotPassword(req: TypedRequestBody<ForgottenPassword>, res: Response, _next: NextFunction) {
  const { email } = req.body;
  const user = await User.findOne({ email: email, isDeleted: false });

  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }

  const token = createToken(email);
  const tokenExpiresAt = new Date(Date.now() + thirtyMinutes);

  await user.updateOne({ token, tokenExpiresAt, updatedAt: new Date(Date.now()) });

  return res.status(200).json({ email, token });
}

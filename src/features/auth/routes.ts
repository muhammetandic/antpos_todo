import express, { Router, Request, Response, NextFunction } from "express";
import { createJwtToken } from "../../services/jwt.js";
import { IUser, User } from "./schema.js";
import { createHash } from "crypto";
import { SignUp, SetPassword, ForgottenPassword } from "./models.js";
import { TypedRequestBody } from "../../helpers/value-objects/request.js";
import { encrypt, decrypt } from "../../services/crypt.js";
import { asyncHandler } from "../../helpers/value-objects/asyncHandler.js";
import { createCode } from "../../services/random-code-generator.js";
import { sendEmail } from "../../services/mailSender.js";

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
  const code = createCode();

  const user = new User<IUser>({
    email,
    name,
    token,
    tokenExpiresAt,
    code,
    isDeleted: false,
    createdAt: new Date(Date.now()),
  });

  await user.save();

  await sendEmail(email, "yeni kayıt", "signup", {
    name: user.name,
    email: user.email,
    code: code,
    token: token,
  });

  return res.status(200).json({ email, token });
}

async function setPassword(req: TypedRequestBody<SetPassword>, res: Response, _next: NextFunction) {
  const { email, token, password, code } = req.body;
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

  if (user?.code !== code) {
    return res.status(400).json({ error: "invalid code" });
  }

  const { encryptedText, salt } = encrypt(password);

  await user.updateOne({
    password: encryptedText,
    salt,
    token: null,
    tokenExpiresAt: null,
    code: null,
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
  const code = createCode();

  await user.updateOne({ token, tokenExpiresAt, code, updatedAt: new Date(Date.now()) });

  await sendEmail(email, "şifre sıfırlama", "forgotten-password", {
    name: user.name,
    code: code,
    email: user.email,
    token: token,
  });

  return res.status(200).json({ email, token });
}

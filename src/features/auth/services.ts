import { createHash } from "crypto";
import { createJwtToken } from "../../services/jwt.js";
import { decrypt, encrypt } from "../../services/crypt.js";
import { IUser, User } from "./schema.js";
import { Result } from "../../abstracts/commons.js";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  ForgottenPasswordRequest,
  ForgottenPasswordResponse,
  SetPasswordRequest,
  SetPasswordResponse,
} from "./models.js";
import { createCode } from "../../services/random-code-generator.js";
import { sendEmail } from "../../services/mail-sender.js";
import { EMAIL_TEMPLATES } from "../../services/enums/email-templates.js";

const thirtyMinutesInMiliseconds = 30 * 60 * 1000;
const thirtyMinutesInSeconds = 30 * 60;
const tenMinutesInMiliseconds = 10 * 60 * 1000;

const createToken = (email: string) =>
  createHash("sha256")
    .update(email + Date.now())
    .digest("hex");

export const signIn = async (request: SignInRequest): Promise<Result<SignInResponse>> => {
  const { email, password } = request;
  const expiresIn = new Date(Date.now() + thirtyMinutesInMiliseconds);

  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result(400, "user not found");
  }

  if (password !== decrypt(user?.password || "", user?.salt || "")) {
    return new Result(400, "incorrect password");
  }

  const token = createJwtToken(user._id.toString(), email, thirtyMinutesInSeconds);
  const data = { email, token, expiresIn } as SignInResponse;
  return new Result(200, data);
};

export const signUp = async (request: SignUpRequest): Promise<Result<SignUpResponse>> => {
  const { email, name } = request;

  const isExist = await User.findOne<IUser>({ email: email, isDeleted: false });
  if (isExist) {
    return new Result(400, "email already exist");
  }

  const token = createToken(email);
  const tokenExpiresAt = new Date(Date.now() + tenMinutesInMiliseconds);
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

  await sendEmail({
    to: email,
    subject: "yeni kayıt",
    template: EMAIL_TEMPLATES.SIGNUP,
    context: {
      name: name,
      email: email,
      code: code,
      token: token,
    },
  });

  return new Result(200, { email, token });
};

export const setPassword = async (request: SetPasswordRequest): Promise<Result<SetPasswordResponse>> => {
  const { email, token, code, password } = request;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result(400, "user not found");
  }

  if (user?.token !== token) {
    return new Result(400, "invalid token");
  }

  if (user?.tokenExpiresAt && user?.tokenExpiresAt.getTime() < Date.now()) {
    return new Result(400, "token expired");
  }

  if (user?.code !== code) {
    return new Result(400, "invalid code");
  }

  const encrypted = encrypt(password);

  if (encrypted === null) {
    return new Result(400, "password encryption failed");
  }

  await user.updateOne({
    password: encrypted?.encryptedText,
    salt: encrypted?.salt,
    token: null,
    tokenExpiresAt: null,
    code: null,
    updatedAt: new Date(Date.now()),
  });

  return new Result(200, {});
};

export const forgotPassword = async (request: ForgottenPasswordRequest): Promise<Result<ForgottenPasswordResponse>> => {
  const { email } = request;
  const user = await User.findOne({ email: email, isDeleted: false });

  if (!user) {
    return new Result(400, "user not found");
  }

  const token = createToken(email);
  const tokenExpiresAt = new Date(Date.now() + tenMinutesInMiliseconds);
  const code = createCode();

  await user.updateOne({ token, tokenExpiresAt, code, updatedAt: new Date(Date.now()) });

  await sendEmail({
    to: email,
    subject: "sifre sıfırlama",
    template: EMAIL_TEMPLATES.FORGOTTEN_PASSWORD,
    context: {
      name: user.name,
      code: code,
      email: user.email,
      token: token,
    },
  });

  const data = { email, token } as ForgottenPasswordResponse;
  return new Result(200, data);
};

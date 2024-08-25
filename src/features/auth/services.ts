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
import { status } from "../../helpers/response.js";

const thirtyMinutesInMilliseconds = 30 * 60 * 1000;
const thirtyMinutesInSeconds = 30 * 60;
const tenMinutesInMilliseconds = 10 * 60 * 1000;

const createToken = (email: string) =>
  createHash("sha256")
    .update(email + Date.now())
    .digest("hex");

export const signInAsync = async (request: SignInRequest): Promise<Result<SignInResponse>> => {
  const { email, password } = request;
  const expiresIn = new Date(Date.now() + thirtyMinutesInMilliseconds);

  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result(status.NotFound, "user not found");
  }

  if (password !== decrypt(user?.password || "", user?.salt || "")) {
    return new Result(status.BadRequest, "incorrect password");
  }

  const token = createJwtToken(user._id.toString(), email, thirtyMinutesInSeconds);
  const data = { email, token, expiresIn } as SignInResponse;
  return new Result(status.Ok, data);
};

export const signUpAsync = async (request: SignUpRequest): Promise<Result<SignUpResponse>> => {
  const { email, name } = request;

  const isExist = await User.findOne<IUser>({ email: email, isDeleted: false });
  if (isExist) {
    return new Result(status.BadRequest, "email already exist");
  }

  const token = createToken(email);
  const tokenExpiresAt = new Date(Date.now() + tenMinutesInMilliseconds);
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

  return new Result(status.Ok, { email, token });
};

export const setPasswordAsync = async (request: SetPasswordRequest): Promise<Result<SetPasswordResponse>> => {
  const { email, token, code, password } = request;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result(status.NotFound, "user not found");
  }

  if (user?.token !== token) {
    return new Result(status.BadRequest, "invalid token");
  }

  if (user?.tokenExpiresAt && user?.tokenExpiresAt.getTime() < Date.now()) {
    return new Result(status.BadRequest, "token expired");
  }

  if (user?.code !== code) {
    return new Result(status.BadRequest, "invalid code");
  }

  const encrypted = encrypt(password);

  if (encrypted === null) {
    return new Result(status.InternalServerError, "password encryption failed");
  }

  await user.updateOne({
    password: encrypted?.encryptedText,
    salt: encrypted?.salt,
    token: null,
    tokenExpiresAt: null,
    code: null,
    updatedAt: new Date(Date.now()),
  });

  return new Result(status.Ok, {});
};

export const forgotPasswordAsync = async (
  request: ForgottenPasswordRequest,
): Promise<Result<ForgottenPasswordResponse>> => {
  const { email } = request;
  const user = await User.findOne({ email: email, isDeleted: false });

  if (!user) {
    return new Result(status.NotFound, "user not found");
  }

  const token = createToken(email);
  const tokenExpiresAt = new Date(Date.now() + tenMinutesInMilliseconds);
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
  return new Result(status.Ok, data);
};

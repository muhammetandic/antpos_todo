import express, { Router, Request, Response, NextFunction } from "express";
import { createToken } from "../../services/jwt.js";
import { User } from "./schema.js";
import { createHash, getRandomValues } from "crypto";
import { MongoDbError } from "../../value-objects/errors.js";
import { SignUp } from "./models.js";
import { TypedRequestBody } from "../../value-objects/request.js";

export const authRouter: Router = express.Router();

authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.post("/confirmemail", confirmEmail);
authRouter.post("/createpassword", createPassword);
authRouter.post("/changepassword", changePassword);

function signin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const expireDuration = 60 * 60 * 1000;
  const expiresIn = new Date(Date.now() + expireDuration);

  const token = createToken(email, password, expireDuration);
  res.status(200).json({ email, token, expiresIn });
  next();
}

async function signup(req: TypedRequestBody<SignUp>, res: Response, next: NextFunction) {
  const { email, name } = req.body;
  const token = createHash("sha256")
    .update(getRandomValues(new Uint8Array(16)))
    .digest("hex");
  const user = new User({ email, name, token, isDeleted: false, createdAt: Date.now() });
  try {
    await user.save();
  } catch (err) {
    next(new MongoDbError(err));
    return;
  }
  res.status(200).json({ email, name, token });
  next();
}

function confirmEmail(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  res.status(200).json({ email });
  next();
}

function createPassword(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  res.status(200).json({ email, password });
  next();
}

function changePassword(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  res.status(200).json({ email, password });
  next();
}

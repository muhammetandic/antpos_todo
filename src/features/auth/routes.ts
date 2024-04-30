import express, { Router, Request, Response, NextFunction } from "express";
import { createToken } from "../../services/jwt.js";

export const authRouter: Router = express.Router();

authRouter.post("/signin", signin);
authRouter.post("/signup", signup);

function signin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const token = createToken(email, password);
  console.log(email, password);
  res.status(200).json({ email, token });
  next();
}

function signup(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  console.log(email, password);
  res.status(200).json({});
  next();
}

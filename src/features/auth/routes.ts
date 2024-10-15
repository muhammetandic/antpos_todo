import express, { Router, Response } from "express";
import { SignInRequest, SignUpRequest, SetPasswordRequest, ForgottenPasswordRequest } from "./models.js";
import { forgotPasswordAsync, setPasswordAsync, signInAsync, signUpAsync } from "./services.js";
import { TypedRequestBody } from "../../helpers/request.js";

export const authRoutes: Router = express.Router();

authRoutes.post("/signin", async (req: TypedRequestBody<SignInRequest>, res: Response) => {
  const request = req.body;
  const result = await signInAsync(request);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  if (request.authType === "cookie") {
    res.status(result.status).cookie("token", result.data?.token).json({ success: true });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

authRoutes.post("/signup", async (req: TypedRequestBody<SignUpRequest>, res: Response) => {
  const request = req.body;
  const result = await signUpAsync(request);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

authRoutes.post("/setpassword", async (req: TypedRequestBody<SetPasswordRequest>, res: Response) => {
  const request = req.body;
  const result = await setPasswordAsync(request);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

authRoutes.post("/forgotpassword", async (req: TypedRequestBody<ForgottenPasswordRequest>, res: Response) => {
  const request = req.body;
  const result = await forgotPasswordAsync(request);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

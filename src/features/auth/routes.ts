import express, { Router, Response } from "express";
import { SignInRequest, SignUpRequest, SetPasswordRequest, ForgottenPasswordRequest } from "./models.js";
import { forgotPasswordAsync, setPasswordAsync, signInAsync, signUpAsync } from "./services.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { TypedRequestBody } from "../../helpers/request.js";

export const authRoutes: Router = express.Router();

authRoutes.post(
  "/signin",
  asyncHandler(async (req: TypedRequestBody<SignInRequest>, res: Response) => {
    const request = req.body;
    const result = await signInAsync(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    if (request.authType === "cookie") {
      return res.status(result.status).cookie("token", result.data?.token).json({ success: true });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

authRoutes.post(
  "/signup",
  asyncHandler(async (req: TypedRequestBody<SignUpRequest>, res: Response) => {
    const request = req.body;
    const result = await signUpAsync(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

authRoutes.post(
  "/setpassword",
  asyncHandler(async (req: TypedRequestBody<SetPasswordRequest>, res: Response) => {
    const request = req.body;
    const result = await setPasswordAsync(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

authRoutes.post(
  "/forgotpassword",
  asyncHandler(async (req: TypedRequestBody<ForgottenPasswordRequest>, res: Response) => {
    const request = req.body;
    const result = await forgotPasswordAsync(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

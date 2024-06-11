import express, { Router, Response, NextFunction } from "express";
import { SignInRequest, SignUpRequest, SetPasswordRequest, ForgottenPasswordRequest } from "./models.js";
import { TypedRequestBody } from "../../helpers/value-objects/request.js";
import { asyncHandler } from "../../helpers/value-objects/asyncHandler.js";
import { signIn, signUp, forgotPassword, setPassword } from "./services.js";

export const authRouter: Router = express.Router();

authRouter.post(
  "/signin",
  asyncHandler(async (req: TypedRequestBody<SignInRequest>, res: Response, _next: NextFunction) => {
    const request = req.body;
    const result = await signIn(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    if (request.authType === "cookie") {
      return res.status(result.status).cookie("token", result.data?.token).json({ success: true });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

authRouter.post(
  "/signup",
  asyncHandler(async (req: TypedRequestBody<SignUpRequest>, res: Response, _next: NextFunction) => {
    const request = req.body;
    const result = await signUp(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

authRouter.post(
  "/setpassword",
  asyncHandler(async (req: TypedRequestBody<SetPasswordRequest>, res: Response, _next: NextFunction) => {
    const request = req.body;
    const result = await setPassword(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

authRouter.post(
  "/forgotpassword",
  asyncHandler(async (req: TypedRequestBody<ForgottenPasswordRequest>, res: Response, _next: NextFunction) => {
    const request = req.body;
    const result = await forgotPassword(request);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

import express, { Router } from "express";
import { todoRouter } from "./features/todo/routes.js";
import { authRouter } from "./features/auth/routes.js";
import { authMiddleware } from "./middlewares/auth.js";

export const router = express.Router();
const apiRouter: Router = express.Router();

apiRouter.use(authMiddleware);
apiRouter.use("/todos", todoRouter);

router.use("/auth", authRouter);
router.use("/api", apiRouter);

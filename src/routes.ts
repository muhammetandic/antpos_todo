import express, { Router } from "express";
import { todoRouter } from "./features/todo/routes.js";
import { authRouter } from "./features/auth/routes.js";
import { jwtMiddleware } from "./middlewares/jwt.js";

export const router = express.Router();
const apiRouter: Router = express.Router();

apiRouter.use(jwtMiddleware);
apiRouter.use("/todo", todoRouter);

router.use("/auth", authRouter);
router.use("/api", apiRouter);

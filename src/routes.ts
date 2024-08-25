import express, { Router } from "express";
import { todoRoutes } from "./features/todo/routes.js";
import { authRoutes } from "./features/auth/routes.js";
import { authMiddleware } from "./middlewares/auth.js";
import { addressRoutes } from "./features/address/routes.js";

export const router = express.Router();
const apiRoutes: Router = express.Router();

apiRoutes.use(authMiddleware);
apiRoutes.use("/todos", todoRoutes);
apiRoutes.use("/addresses", addressRoutes);

router.use("/auth", authRoutes);
router.use("/api", apiRoutes);

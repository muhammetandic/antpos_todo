import express, { Router, Response, Request } from "express";
import { createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo, toggleTodo } from "./services.js";
import { AuthenticatedRequest } from "../../middlewares/auth.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { TypedRequestBody } from "../../helpers/request.js";
import { TodoDto } from "./models.js";

export const todoRoutes: Router = express.Router();

todoRoutes.post(
  "/",
  asyncHandler(async (req: TypedRequestBody<TodoDto>, res: Response) => {
    const request = req.body;
    const user = (req as AuthenticatedRequest).user;

    const result = await createTodo(request, user.id);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

todoRoutes.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    const result = await getAllTodos(user.id);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

todoRoutes.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    const result = await getTodoById(user.id, req.params.id);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

todoRoutes.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    const result = await updateTodo(user.id, req.params.id, req.body);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

todoRoutes.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    const result = await deleteTodo(user.id, req.params.id);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

todoRoutes.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    const result = await toggleTodo(user.id, req.params.id);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

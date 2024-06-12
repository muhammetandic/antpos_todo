import express, { Router, Response, Request } from "express";
import { asyncHandler } from "../../helpers/value-objects/asyncHandler.js";
import { TypedRequestBody } from "../../helpers/value-objects/request.js";
import { CreateTodoRequest } from "./models.js";
import { createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo, toggleTodo } from "./services.js";
import { AuthenticatedRequest } from "../../middlewares/auth.js";

export const todoRouter: Router = express.Router();

todoRouter.post(
  "/",
  asyncHandler(async (req: TypedRequestBody<CreateTodoRequest>, res: Response) => {
    const request = req.body;
    const user = (req as AuthenticatedRequest).user;

    const result = await createTodo(request, user.id);

    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

todoRouter.get(
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

todoRouter.get(
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

todoRouter.put(
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

todoRouter.delete(
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

todoRouter.patch(
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

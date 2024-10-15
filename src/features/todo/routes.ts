import express, { Router, Response, Request } from "express";
import { createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo, toggleTodo } from "./services.js";
import { AuthenticatedRequest } from "../../middlewares/auth.js";

export const todoRoutes: Router = express.Router();

todoRoutes.post("/", async (req: Request, res: Response) => {
  const request = req.body;
  const user = (req as AuthenticatedRequest).user;

  const result = await createTodo(request, user.id);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).send({ success: true, data: result.data });
});

todoRoutes.get("/", async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;

  const result = await getAllTodos(user.id);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).json({ success: true, data: result.data });
});

todoRoutes.get("/:id", async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;

  const result = await getTodoById(user.id, req.params.id);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).json({ success: true, data: result.data });
});

todoRoutes.put("/:id", async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;

  const result = await updateTodo(user.id, req.params.id, req.body);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).json({ success: true, data: result.data });
});

todoRoutes.delete("/:id", async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;

  const result = await deleteTodo(user.id, req.params.id);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

todoRoutes.put("/:id", async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;

  const result = await toggleTodo(user.id, req.params.id);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

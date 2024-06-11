import express, { Router } from "express";

export const todoRouter: Router = express.Router();

todoRouter.post("/", createTodo);
todoRouter.get("/", getTodos);
todoRouter.get("/:id", getTodo);
todoRouter.put("/:id", updateTodo);
todoRouter.delete("/:id", deleteTodo);
todoRouter.patch("/:id", toggleTodo);

function createTodo() { }

function getTodos() { }

function getTodo() { }

function updateTodo() { }

function deleteTodo() { }

function toggleTodo() { }

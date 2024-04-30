import express, { Router } from "express";

export const todoRouter: Router = express.Router();

todoRouter.get("/", (req, res) => {
  res.json({ ok: true });
});

import { NextFunction, Request, Response } from "express";

export async function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.log(`[${err.name}]: ${err.message}`);
  return res.status(500).json({ type: err.name, error: err.message });
}

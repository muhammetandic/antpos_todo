import { NextFunction, Request, Response } from "express";
import { status } from "../helpers/response.js";

export async function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.log(`[${err.name}]: ${err.message}`);
  return res.status(status.InternalServerError).json({ type: err.name, error: err.message });
}

import { NextFunction, Request, Response } from "express";
import { MongoDbError } from "../value-objects/errors.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof MongoDbError) {
    console.log(`[${err.name}]: ${err.message}`);
    res.status(500).json({ type: err.name, error: err.message });
  } else {
    next();
  }
}

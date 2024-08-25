import { Router } from "express";
import { ModelCustomer } from "./model.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { TypedRequestBody } from "../../helpers/request.js";

export const customersRouter: Router = Router();

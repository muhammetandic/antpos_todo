import { Router, Response, Request } from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { TypedRequestBody } from "../../helpers/request.js";
import { AddressDto } from "./model.js";
import { AuthenticatedRequest } from "../../middlewares/auth.js";
import {
  createAddressAsync,
  getAddressByIdAsync,
  getAllAddressesAsync,
  removeAddressAsync,
  updateAddressAsync,
} from "./services.js";

export const addressRoutes: Router = Router();

addressRoutes.post(
  "/",
  asyncHandler(async (req: TypedRequestBody<AddressDto>, res: Response) => {
    const dto = req.body;
    const user = (req as AuthenticatedRequest).user;

    const result = await createAddressAsync(user.id, dto);
    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

addressRoutes.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await getAllAddressesAsync();
    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

addressRoutes.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await getAddressByIdAsync(req.params.id);
    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

addressRoutes.put(
  "/:id",
  asyncHandler(async (req: TypedRequestBody<AddressDto>, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const dto = req.body;

    const result = await updateAddressAsync(user.id, req.params.id, dto);
    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

addressRoutes.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    const result = await removeAddressAsync(user.id, req.params.id);
    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }

    return res.status(result.status).json({ success: true, data: result.data });
  }),
);

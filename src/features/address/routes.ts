import { Router, Response, Request } from "express";
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

addressRoutes.post("/", async (req: TypedRequestBody<AddressDto>, res: Response) => {
  const dto = req.body;
  const user = (req as AuthenticatedRequest).user;

  const result = await createAddressAsync(user.id, dto);
  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).json({ success: true, data: result.data });
});

addressRoutes.get("/", async (req: Request, res: Response) => {
  const result = await getAllAddressesAsync();
  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

addressRoutes.get("/:id", async (req: Request, res: Response) => {
  const result = await getAddressByIdAsync(req.params.id);
  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).json({ success: true, data: result.data });
});

addressRoutes.put("/:id", async (req: TypedRequestBody<AddressDto>, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const dto = req.body;

  const result = await updateAddressAsync(user.id, req.params.id, dto);
  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).json({ success: true, data: result.data });
});

addressRoutes.delete("/:id", async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;

  const result = await removeAddressAsync(user.id, req.params.id);
  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  res.status(result.status).json({ success: true, data: result.data });
});

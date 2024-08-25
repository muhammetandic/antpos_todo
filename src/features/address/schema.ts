import { model, Schema } from "mongoose";
import { IAuditable, ISoftDeleted } from "../../abstracts/base-schemes.js";

export interface IAddress extends ISoftDeleted, IAuditable {
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  district: string;
  city: string;
  country: string;
  identityNumber: string;
}

const addressSchema = new Schema<IAddress>({
  phone: { type: String, required: true },
  email: { type: String, required: false, lowercase: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false },
  district: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  identityNumber: { type: String, required: true },
  isDeleted: { type: Boolean, required: true, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

export const Address = model<IAddress>("Address", addressSchema);

import { Schema, model } from "mongoose";
import { ISoftDeleted, IAuditable } from "../../abstracts/base-schemes.js";

export interface IUser extends ISoftDeleted, IAuditable {
  email: string;
  phone?: string;
  name: string;
  password?: string;
  salt?: string;
  token?: string;
  tokenExpiresAt?: Date;
  code?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, index: true, unique: true, lowercase: true },
  phone: { type: String, required: false },
  name: { type: String, required: true },
  password: { type: String, required: false },
  salt: { type: String, required: false },
  token: { type: String, required: false },
  tokenExpiresAt: { type: Date, required: false },
  code: { type: String, required: false },
  isDeleted: { type: Boolean, required: true, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

export const User = model<IUser>("User", userSchema);

import { Schema, model } from "mongoose";

export interface IUser {
  email: string;
  phone?: string;
  name: string;
  password?: string;
  salt?: string;
  token?: string;
  tokenExpiresAt?: Date;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, index: true, unique: true, lowercase: true },
  phone: { type: String, required: false },
  name: { type: String, required: true },
  password: { type: String, required: false },
  salt: { type: String, required: false },
  token: { type: String, required: false },
  tokenExpiresAt: { type: Date, required: false },
  isDeleted: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false },
});

export const User = model<IUser>("User", userSchema);

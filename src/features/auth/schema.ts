import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  phone: string;
  name: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

import { Schema, model } from "mongoose";
import { ISoftDeleted, IAuditable } from "../../abstracts/base-schemes.js";

export interface ITodo extends ISoftDeleted, IAuditable {
  title: string;
  description?: string;
  isCompleted: boolean;
}

const todoScheme = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  isCompleted: { type: Boolean, required: false, default: false },
  isDeleted: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedAt: { type: Date, required: false, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

export const Todo = model<ITodo>("Todo", todoScheme);

import { CreateTodoRequest, CreateTodoResponse, UpdateTodoRequest, EmptyResponse } from "./models.js";
import { Result } from "../../abstracts/commons.js";
import { Todo, ITodo } from "./scheme.js";

export const createTodo = async (
  request: CreateTodoRequest,
  currentUser: string,
): Promise<Result<CreateTodoResponse>> => {
  const { title, description, isCompleted } = request;

  const todo = new Todo<ITodo>({
    title,
    description,
    isCompleted,
    isDeleted: false,
    createdAt: new Date(Date.now()),
    createdBy: currentUser,
  });

  await todo.save();
  const data = { id: todo._id.toString() } as CreateTodoResponse;
  return new Result(201, data);
};

export const getAllTodos = async (currentUser: string): Promise<Result<ITodo[]>> => {
  const todos = await Todo.find({ createdBy: currentUser, isDeleted: false });
  return new Result(200, todos);
};

export const getTodoById = async (currentUser: string, id: string): Promise<Result<ITodo>> => {
  const todo = await Todo.findOne({ _id: id, createdBy: currentUser, isDeleted: false });

  if (!todo) {
    return new Result(404, "Todo not found");
  }
  return new Result(200, todo);
};

export const updateTodo = async (
  currentUser: string,
  id: string,
  request: UpdateTodoRequest,
): Promise<Result<EmptyResponse>> => {
  const { title, description, isCompleted } = request;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, createdBy: currentUser, isDeleted: false },
    { title, description, isCompleted, updatedBy: currentUser, updatedAt: new Date(Date.now()) },
    { new: true },
  );

  if (!todo) {
    return new Result(404, "Todo not found");
  }
  return new Result(200, {});
};

export const deleteTodo = async (currentUser: string, id: string): Promise<Result<EmptyResponse>> => {
  const todo = await Todo.findOneAndUpdate(
    { _id: id, createdBy: currentUser, isDeleted: false },
    { isDeleted: true, updatedBy: currentUser, updatedAt: new Date(Date.now()) },
    { new: true },
  );

  if (!todo) {
    return new Result(404, "Todo not found");
  }
  return new Result(200, {});
};

export const toggleTodo = async (currentUser: string, id: string): Promise<Result<EmptyResponse>> => {
  const todo = await Todo.findOne({ _id: id, createdBy: currentUser, isDeleted: false });

  if (!todo) {
    return new Result(404, "Todo not found");
  }

  todo.isCompleted = !todo.isCompleted;
  todo.updatedBy = currentUser;
  todo.updatedAt = new Date(Date.now());
  await todo.save();

  return new Result(200, {});
};

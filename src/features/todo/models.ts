export type CreateTodoRequest = {
  title: string;
  description?: string;
  isCompleted: boolean;
};

export type CreateTodoResponse = {
  id: string;
};

export type UpdateTodoRequest = {
  title: string;
  description?: string;
  isCompleted: boolean;
};

export type EmptyResponse = Record<string, never>;

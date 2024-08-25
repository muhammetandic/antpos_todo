export type TodoDto = {
  title: string;
  description?: string;
  isCompleted: boolean;
};

export type CreateTodoResponse = {
  id: string;
};

export type EmptyResponse = Record<string, never>;

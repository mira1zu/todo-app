import { client } from './axios';
import Todo, { TodoPatch } from '../types/Todo';

export const getTodos = () => client.get<Todo[]>('/todos');

export const createTodo = (todo: Omit<Todo, 'id'>) => client.post<Todo>(
  '/todos',
  todo,
);

export const patchTodo = (todo: TodoPatch) => client.patch<Todo>(
  `/todos/${todo.id}`,
  todo,
);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

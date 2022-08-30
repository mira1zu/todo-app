import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';

import * as todosApi from '../../api/todos';

import Todo, { TodoPatch } from '../../types/Todo';
import LoadingStatus from '../../enums/LoadingStatus';
import type { RootState } from '../../app/store';

export interface TodoPageState {
  todos: Todo[];
  status: `${LoadingStatus}`;
}

const initialState: TodoPageState = {
  todos: [],
  status: LoadingStatus.Idle,
};

export const fetchTodos = createAsyncThunk(
  'todoPage/fetchTodos',
  async () => {
    const response = await todosApi.getTodos();

    return response;
  },
);

export const addTodo = createAsyncThunk(
  'todoPage/addTodo',
  async (todo: Omit<Todo, 'id'>) => {
    const response = await todosApi.createTodo(todo);

    return response;
  },
);

export const updateTodo = createAsyncThunk(
  'todoPage/updateTodo',
  async (todo: TodoPatch) => {
    const response = await todosApi.patchTodo(todo);

    return response;
  },
);

export const removeTodo = createAsyncThunk(
  'todoPage/removeTodo',
  async (todoId: number) => {
    await todosApi.deleteTodo(todoId);

    return todoId;
  },
);

export const todoPageSlice = createSlice({
  name: 'todoPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.todos = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id,
        );

        state.todos[index] = action.payload;
      })
      .addCase(removeTodo.fulfilled, (state, action: PayloadAction<number>) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addMatcher(
        isFulfilled(fetchTodos, addTodo, updateTodo, removeTodo),
        (state) => {
          state.status = LoadingStatus.Idle;
        },
      )
      .addMatcher(
        isPending(fetchTodos, addTodo, updateTodo, removeTodo),
        (state) => {
          state.status = LoadingStatus.Loading;
        },
      )
      .addMatcher(
        isRejected(fetchTodos, addTodo, updateTodo, removeTodo),
        (state) => {
          state.status = LoadingStatus.Failed;
        },
      );
  },
});

export const selectTodos = (state: RootState) => (
  state.todos
);

export default todoPageSlice.reducer;

/// <reference path="../../typings/tsd.d.ts" />

import { createAction, Action } from 'redux-actions';

import { Todo, IRecord } from '../models/todos';
import * as types from '../constants/ActionTypes';

const addTodo = createAction<Todo>(
  types.ADD_TODO,
  (text: string) => ({ text, completed: false })
);

const deleteTodo = createAction<Todo>(
  types.DELETE_TODO,
  (todo: Todo) => todo
);

const editTodo = createAction<Todo>(
  types.EDIT_TODO,
  (todo: IRecord<Todo>, newText: string) => todo.set('text', newText)
);

const completeTodo = createAction<Todo>(
  types.COMPLETE_TODO,
  (todo: Todo) => todo
)

const completeAll = createAction<void>(
  types.COMPLETE_ALL,
  () => {}
)

const clearCompleted = createAction<void>(
  types.CLEAR_COMPLETED,
  () => {}
);

export {
  addTodo,
  deleteTodo,
  editTodo,
  completeTodo,
  completeAll,
  clearCompleted
}

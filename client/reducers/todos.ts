/// <reference path="../../typings/tsd.d.ts" />

import { handleActions, Action } from 'redux-actions';
import * as Immutable from 'immutable';

import { Todo, TodoList, TodoRecord } from '../models/todos';
import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL,
  CLEAR_COMPLETED
} from '../constants/ActionTypes';

const initialState = Immutable.List([new TodoRecord({
  text: 'Use Redux with TypeScript',
  completed: false,
  id: 0
})]);

export default handleActions<TodoList>({
  [ADD_TODO]: (state: TodoList, action: Action) : TodoList => {
    var newRecord = new TodoRecord({
      id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
      completed: action.payload.completed,
      text: action.payload.text
    });
    return state.unshift(newRecord);
  },
  
  [DELETE_TODO]: (state: TodoList, action: Action): TodoList => {
    return state.filter(todo => todo.id !== action.payload.id).toList();
  },
  
  [EDIT_TODO]: (state: TodoList, action: Action): TodoList => {
    return state.map(todo =>
      todo.id === action.payload.id
        ? todo.set('text', action.payload.text)
        : todo
    ).toList();
  },
  
  [COMPLETE_TODO]: (state: TodoList, action: Action): TodoList => {
    return state.map(todo =>
      todo.id === action.payload.id
        ? todo.set('completed', !todo.completed)
        : todo
    ).toList();
  },
  
  [COMPLETE_ALL]: (state: TodoList, action: Action): TodoList => {
    const areAllMarked = state.every(todo => todo.completed);
    return state.map(todo => todo.set('completed', !areAllMarked)).toList();
  },

  [CLEAR_COMPLETED]: (state: TodoList, action: Action): TodoList => {
    return state.filter(todo => todo.completed === false).toList();
  }
}, initialState);

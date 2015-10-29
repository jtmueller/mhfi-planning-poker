/// <reference path="../../typings/tsd.d.ts" />

import * as Immutable from 'immutable';

export interface Todo {
  id?: number;
  text: string;
  completed: boolean;
};

export type IRecord<T> = Immutable.Record.IRecord<T>

/// An immutable list of immutable Todo items.
export type TodoList = Immutable.List<IRecord<Todo>>;

/// Instantiating this constructor generates an immutable Todo record wrapper.
export const TodoRecord = Immutable.Record<Todo>({ text:'', completed: false, id: -1 }, "Todo");

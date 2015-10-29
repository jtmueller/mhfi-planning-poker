/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import * as classNames from 'classnames';
import {
  TableRow,
  TableRowColumn,
  FontIcon,
  Styles
} from 'material-ui';

import { Todo } from '../models/todos';
import TodoTextInput from './TodoTextInput';

interface TodoItemProps {
  todo: Todo;
  editTodo: Function;
  deleteTodo: Function;
  completeTodo: Function;
  key?: any;
}

class TodoItem extends React.Component<TodoItemProps, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  handleDoubleClick() {
    this.setState({ editing: true });
  }

  handleSave(todo:Todo, text) {
    if (text.length === 0) {
      this.props.deleteTodo(todo);
    } else {
      this.props.editTodo(todo, text);
    }
    this.setState({ editing: false });
  }
  
  style = {
    removeBtn: {
      cursor: 'pointer',
      textAlign: 'right'
    },
    completed: {
      textDecoration: 'line-through',
      color: 'silver'
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.todo !== nextProps.todo 
      || this.state.editing !== nextState.editing;
  }

  render() {
    const {todo, completeTodo, deleteTodo} = this.props;

    let element;
    if (this.state.editing) {
      element = (
        <TableRow selected={todo.completed} key={todo.id} rowNumber={todo.id}>
          <TableRowColumn>
            <TodoTextInput text={todo.text}
                           editing={this.state.editing}
                           onSave={text => this.handleSave(todo, text)}/>
          </TableRowColumn>
          <TableRowColumn/>
        </TableRow>
      );
    } else {
      element = (
        <TableRow selected={todo.completed} key={todo.id} rowNumber={todo.id}>
          <TableRowColumn>
            <span 
              style={todo.completed ? this.style.completed : null} 
              onDoubleClick={this.handleDoubleClick.bind(this)}>
              {todo.text}
            </span>
          </TableRowColumn>
          <TableRowColumn>
            <div onClick={() => deleteTodo(todo)} style={this.style.removeBtn}>
              <FontIcon className="material-icons" 
                color={Styles.Colors.red700}>clear</FontIcon>
            </div>
          </TableRowColumn>
        </TableRow>
      );
    }

    return element;
  }
}

//          <input className="toggle"
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() => completeTodo(todo)} />

export default TodoItem;

/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {
  CardText,
  Table,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableBody
} from 'material-ui';

import { Todo, TodoList } from '../models/todos';
import TodoItem from './TodoItem';
import Footer from './Footer';
import TodoTextInput from './TodoTextInput';

import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE
} from '../constants/TodoFilters';

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: (todo:Todo) => !todo.completed,
  [SHOW_COMPLETED]: (todo:Todo) => todo.completed
};

interface MainSectionProps {
  todos: TodoList;
  actions: any;
};

class MainSection extends React.Component<MainSectionProps, any> {
  constructor(props, context) {
    super(props, context);
    this.state = { filter: SHOW_ALL };
  }

  handleClearCompleted() {
    const atLeastOneCompleted = this.props.todos.some(todo => todo.completed);
    if (atLeastOneCompleted) {
      this.props.actions.clearCompleted();
    }
  }

  handleShow(filter) {
    this.setState({ filter });
  }

  renderFooter(completedCount: number) {
    const { todos } = this.props;
    const { filter } = this.state;
    const activeCount = todos.size - completedCount;
    
    if (todos.size > 0) {
      return (
        <Footer completedCount={completedCount}
                activeCount={activeCount}
                filter={filter}
                onClearCompleted={this.handleClearCompleted.bind(this)}
                onShow={this.handleShow.bind(this)} />
      );
    }
  }
  
  handleSave(text) {
    if (text.length !== 0) {
      this.props.actions.addTodo(text);
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.todos !== nextProps.todos 
      || this.state.filter !== nextState.filter;
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;

    const filteredTodos = todos.filter(TODO_FILTERS[filter]);
    const completedCount = todos.reduce((count: number, todo): number =>
      todo.completed ? count + 1 : count,
      0
    );

    return (
      <Table selectable={true} multiSelectable={true} fixedHeader={true} fixedFooter={true}>
        <TableHeader
          enableSelectAll={todos.size > 0} 
          selectAllSelected={todos.size > 0 && todos.size === completedCount}
          onSelectAll={() => {console.log('selectall'); actions.completeAll()}}>
          <TableRow>
            <TableHeaderColumn>
              <TodoTextInput
                newTodo
                onSave={this.handleSave.bind(this)}
                placeholder="What needs to be done?" />
            </TableHeaderColumn>
            <TableHeaderColumn/>
          </TableRow>
        </TableHeader>
        <TableBody 
          onRowSelection={selected => console.log(selected)}
          deselectOnClickaway={false} selectable={true} 
          multiSelectable={true} displayRowCheckbox={true}>
          {filteredTodos.map(todo =>
            <TodoItem
              key={todo.id}
              todo={todo}
              { ...actions }/>
          )}
        </TableBody>
        {this.renderFooter(completedCount)}
      </Table>
    );
  }
}

export default MainSection;

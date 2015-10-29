/// <reference path="../../typings/tsd.d.ts" />

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import { Paper } from 'material-ui';

import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import { TodoList } from '../models/todos';

interface AppProps {
  todos?: TodoList;
  dispatch?: Redux.Dispatch;
}

class App extends React.Component<AppProps, any> {
  render() {
    const { todos, dispatch } = this.props;
    const actions = bindActionCreators(TodoActions, dispatch);

    return (
      <Paper zDepth={1} style={{margin:50, padding:20}}>
        <Header />
        <MainSection
          todos={todos}
          actions={actions}/>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  todos: state.todos
});

export default connect(mapStateToProps)(App);

/// <reference path="../../typings/tsd.d.ts" />

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import { Paper } from 'material-ui';

import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as PokerActions from '../actions/pokerActions';
import { IRecord, AppState } from '../models/pokerModels';

interface AppProps {
  state?: AppState;
  dispatch?: Redux.Dispatch;
}

class App extends React.Component<AppProps, any> {
  render() {
    const { state, dispatch } = this.props;
    const actions = bindActionCreators(PokerActions, dispatch);

    return (
      <Paper zDepth={1} style={{margin:50, padding:20}}>
        <MainSection
          state={state}
          actions={actions}/>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({ state: state.state });

export default connect(mapStateToProps)(App);

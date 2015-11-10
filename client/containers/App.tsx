/// <reference path="../../typings/tsd.d.ts" />

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';

import MainSection from '../components/MainSection';
import * as PokerActions from '../actions/pokerActions';
import { IRecord, AppState } from '../models/pokerModels';

interface AppProps {
  appState?: AppState;
  dispatch?: Redux.Dispatch;
}

class App extends React.Component<AppProps, any> {
  render() {
    const { appState, dispatch } = this.props;
    const actions = bindActionCreators(PokerActions, dispatch);

    return (
      <div style={{ marginLeft:'20%', marginRight:'20%', marginTop:15 }}>
        <MainSection
          appState={appState}
          actions={actions} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ appState: state.state });

export default connect(mapStateToProps)(App);

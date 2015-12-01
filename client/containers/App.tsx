/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import {
  Grid, Row, Col
} from 'react-bootstrap';

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
      <div style={{ marginTop: 10 }}>
        <Grid>
          <Row>
            <Col xsOffset={1} xs={10} smOffset={2} sm={8} mdOffset={2} md={8}>
              <MainSection
                appState={appState}
                actions={actions} />
            </Col> 
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({ appState: state.state });

export default connect(mapStateToProps)(App);

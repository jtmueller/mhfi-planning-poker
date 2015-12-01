/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import * as React from 'react';
import {
  Panel, Button
} from 'react-bootstrap';

import { AppState } from '../models/pokerModels';
import SessionSelector from './SessionSelector';
import SessionPanel from './SessionPanel';

interface MainSectionProps {
  appState: AppState;
  actions: any;
}

class MainSection extends React.Component<MainSectionProps, any> {
  
  // Not doing shouldComponentUpdate here because several child components use React component state
  // that this component does not have access to.
  // However, if all component state were part of the global app-state, a top-level shouldComponentUpdate
  // would be possible. Not sure if this would be advisable or worth the effort since it could conflict
  // with third-party code.
  
  private renderSession() {
    const { currentSession, currentUser, users } = this.props.appState;
    
    return (
      <SessionPanel
        currentSession={currentSession}
        currentUser={currentUser}
        users={users}
        actions={this.props.actions} />
    );
  }
  
  private renderSessionSelect() {
    const { currentUser, sessions } = this.props.appState;
    const { addSession, joinSession } = this.props.actions;
    return (
      <SessionSelector
        currentUser={currentUser}
        sessions={sessions} 
        addSession={addSession}
        joinSession={joinSession} />
    );
  }
  
  private renderLogin() {
    const { login } = this.props.actions;
    return (
      <Panel bsStyle="primary" bsSize="md" 
        header={<h3><small>Planning Poker</small><br/><strong>Authentication</strong></h3>}>
        <span style={{ marginRight: 10 }}>Please sign in:</span> 
        <Button bsStyle="danger" onClick={login}>Google</Button>
      </Panel>
    );
  }

  render() {
    const { currentUser, currentSession } = this.props.appState;
    
    if (!currentUser.userId) {
      return this.renderLogin();
    }
      
    if (!currentSession.sessionId) {
      return this.renderSessionSelect();
    }
      
    return this.renderSession();
  }
}

export default MainSection;

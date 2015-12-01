/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import * as React from 'react';
import {
  ButtonToolbar, Button, DropdownButton, 
  MenuItem, Modal
} from 'react-bootstrap';

import { IRecord, User, Session } from '../models/pokerModels';

interface SessionFooterProps {
  currentSession: IRecord<Session>;
  currentUser: IRecord<User>;
  isAdmin: boolean;
  actions: any;
}

interface SessionFooterState {
  removeSessionDialogVisible: boolean;
}

class SessionFooter extends React.Component<SessionFooterProps, SessionFooterState> {
  state = {
    removeSessionDialogVisible: false
  };
  
  constructor(props, context) {
    super(props, context);
    this.closeRemoveSessionDialog = this.closeRemoveSessionDialog.bind(this);
    this.removeSession = this.removeSession.bind(this);
  }
  
  private handleAdminSelect(eventKey: string) {
    const { clearVotes, revealVotes } = this.props.actions;
    const { currentSession } = this.props;
    switch (eventKey) {
      case 'remove':
        this.showRemoveSessionDialog();
        break;
    
      case 'reveal':
        revealVotes(currentSession.sessionId);
        break;
        
      case 'clear':
        clearVotes(currentSession.sessionId);
        break;
    }
  }
  
  private removeSession() {
      const { currentSession, actions } = this.props;
      actions.removeSession(currentSession.sessionId);
      this.closeRemoveSessionDialog();
  }
  
  private closeRemoveSessionDialog() {
    this.setState({ removeSessionDialogVisible: false });
  }
  
  private showRemoveSessionDialog() {
    this.setState({ removeSessionDialogVisible: true });
  }
  
  private renderRemoveDialog() {
    return (
      <Modal bsSize="small" show={this.state.removeSessionDialogVisible} onHide={this.closeRemoveSessionDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Session?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove this session? Any users logged into the room will have a pie thrown in their face.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeRemoveSessionDialog}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.removeSession}>Remove Session</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  shouldComponentUpdate(nextProps: SessionFooterProps, nextState: SessionFooterState) {
    return this.props.currentSession !== nextProps.currentSession ||
      this.props.currentUser !== nextProps.currentUser ||
      this.props.isAdmin !== nextProps.isAdmin ||
      this.state.removeSessionDialogVisible !== nextState.removeSessionDialogVisible;
  }
  
  render() {
    const { isAdmin, currentSession, currentUser } = this.props;
    const { leaveSession } = this.props.actions;
    
    return (
      <div>
        <ButtonToolbar className="pull-right">
          <Button bsSize="small" onClick={() => leaveSession(currentSession.sessionId, currentUser.userId)}>
            Leave Session
          </Button>
          { isAdmin ?
            <DropdownButton id="sessionAdmin" title="Session Admin" 
              bsSize="small" bsStyle="primary" pullRight
              onSelect={(event, eventKey) => this.handleAdminSelect(eventKey)}>
              <MenuItem eventKey="reveal">Reveal Votes</MenuItem>
              <MenuItem eventKey="clear">Clear Votes</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="remove">Remove Session</MenuItem>
            </DropdownButton> 
            : null }
        </ButtonToolbar>
        <div className="clearfix" />
        {this.renderRemoveDialog()}
      </div>	
    );
  }
}

export default SessionFooter;

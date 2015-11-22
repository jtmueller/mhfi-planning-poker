/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {
  Panel, Well, ListGroup, ListGroupItem,
  Glyphicon, Badge, Input, Button, DropdownButton, 
  MenuItem, ButtonToolbar, Modal
} from 'react-bootstrap';

import { IRecord, AppState, User } from '../models/pokerModels';
import SessionSelector from './SessionSelector';
import UserListItem from './UserListItem';

interface MainSectionProps {
  appState: AppState;
  actions: any;
}

interface MainSesionState {
  removeSessionDialogVisible: boolean;
}

class MainSection extends React.Component<MainSectionProps, MainSesionState> {
  state = {
    removeSessionDialogVisible: false
  };
  
  constructor(props, context) {
    super(props, context);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.closeRemoveSessionDialog = this.closeRemoveSessionDialog.bind(this);
    this.removeSession = this.removeSession.bind(this);
  }
  
  shouldComponentUpdate(nextProps: MainSectionProps, nextState) {
    return this.props.appState !== nextProps.appState ||
      this.state.removeSessionDialogVisible !== nextState.removeSessionDialogVisible; 
  }
  
  private handleDescChange(e) {
    const { sessionId, name } = this.props.appState.currentSession;
    let desc = e.target.value;
    this.props.actions.editSession(sessionId, name, desc);
  }
  
  private renderDesc() {
    const { currentSession, currentUser } = this.props.appState;
    
    if (currentSession.adminUser === currentUser.userId) {
      return (
        <Input type="textarea" 
          label="Description" 
          value={currentSession.desc}
          placeholder="Please enter a description." 
          onChange={this.handleDescChange} />
      );
    }
    
    return <span>{currentSession.desc}</span>;
  }
  
  private renderSession() {
    const { currentSession, currentUser, users } = this.props.appState;
    const { setVote } = this.props.actions;
    
    let votesRevealed = currentSession.votesRevealed || users.every(u => u.vote != null);
    
    return (
      <Panel bsStyle="primary" bsSize="md" 
        header={<h3>{currentSession.name}</h3>} 
        footer={this.renderFooter()}>
        { this.renderDesc() }
        <ListGroup fill>
          { users.map((u:User) => 
              <UserListItem key={u.userId} user={u} setVote={setVote}
                session={currentSession} votesRevealed={votesRevealed}
                isCurrentUser={ u.userId === currentUser.userId } />) }
        </ListGroup>
      </Panel>
    );
  }
  
  private removeSession() {
      const { currentSession } = this.props.appState;
      const { removeSession } = this.props.actions;
      removeSession(currentSession.sessionId);
      this.closeRemoveSessionDialog();
  }
  
  private closeRemoveSessionDialog() {
    this.setState({ removeSessionDialogVisible: false });
  }
  
  private showRemoveSessionDialog() {
    this.setState({ removeSessionDialogVisible: true });
  }
  
  private handleAdminSelect(eventKey: string) {
    const { clearVotes, revealVotes } = this.props.actions;
    const { currentSession } = this.props.appState;
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
  
  private renderRemoveDialog(key: number) {
    return (
      <Modal key={key} bsSize="small" show={this.state.removeSessionDialogVisible} onHide={this.closeRemoveSessionDialog}>
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
  
  private renderFooter() {
    const { currentSession, currentUser } = this.props.appState;
    const { leaveSession } = this.props.actions;
    let isAdmin = currentSession.adminUser === currentUser.userId;
        
    return [
      <ButtonToolbar key={0} className="pull-right">
        <Button bsSize="small" onClick={() => leaveSession(currentSession.sessionId, currentUser.userId)}>
          Leave Session
        </Button>
        { isAdmin ?
          <DropdownButton key={1} id="sessionAdmin" title="Session Admin" 
            bsSize="small" bsStyle="primary" 
            onSelect={(event, eventKey) => this.handleAdminSelect(eventKey)}>
            <MenuItem eventKey="reveal">Reveal Votes</MenuItem>
            <MenuItem eventKey="clear">Clear Votes</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="remove">Remove Session</MenuItem>
          </DropdownButton> 
          : null }
      </ButtonToolbar>,
      <div key={2} className="clearfix" />,
      this.renderRemoveDialog(3)
    ];
  }
  
  private renderSessionSelect() {
    const { currentUser, sessionNames } = this.props.appState;
    const { addSession, joinSession } = this.props.actions;
    return (
      <SessionSelector
        currentUser={currentUser}
        sessions={sessionNames} 
        addSession={addSession}
        joinSession={joinSession} />
    );
  }

  render() {
    const { currentUser, currentSession } = this.props.appState;
    const { login } = this.props.actions;
    
    if (!currentUser.userId) {
      return (
        <Well>
          <span style={{ marginRight: 10 }}>Please sign in:</span> 
          <Button bsStyle="danger" onClick={login}>Google</Button>
        </Well>
      );
    }
      
    if (!currentSession.sessionId)
      return this.renderSessionSelect();
      
    return this.renderSession();
  }
}

export default MainSection;

/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import * as React from 'react';
import {
  Panel, ListGroup, Input
} from 'react-bootstrap';

import { IRecord, User, Session, UserList } from '../models/pokerModels';
import UserListItem from './UserListItem';
import SessionFooter from './SessionFooter';

interface SessionPanelProps {
  currentSession: IRecord<Session>;
  currentUser: IRecord<User>;
  users: UserList;
  actions: any;
}

class SessionPanel extends React.Component<SessionPanelProps, any> {
  constructor(props, context) {
    super(props, context);
    this.handleDescChange = this.handleDescChange.bind(this);
  }
  
  // Not doing shouldComponentUpdate here because the panel doesn't
  // know if the footer has a dialog open or not. However, the footer
  // and each list item implement shouldComponentUpdate, so that's okay.
  // However, if the visible state of the dialog were part of the overall
  // application state instead of part of the footer state, it would be 
  // possible to have a top-level shouldComponentUpdate.
  
  private handleDescChange(e) {
    const { sessionId, name } = this.props.currentSession;
    let desc = e.target.value;
    this.props.actions.editSession(sessionId, name, desc);
  }
  
  private renderDesc() {
    const { currentSession, currentUser } = this.props;
    
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
  
  private renderFooter() {
    const { currentSession, currentUser } = this.props;
        
    return (
      <SessionFooter
        isAdmin={currentSession.adminUser === currentUser.userId}
        currentSession={currentSession}
        currentUser={currentUser}
        actions={this.props.actions} />
    );
  }
  
  render() {
    const { currentSession, currentUser, users } = this.props;
    const { setVote } = this.props.actions;
    
    let votesRevealed = currentSession.votesRevealed || users.every(u => u.vote && u.vote !== -100);
    
    return (
      <Panel bsStyle="primary" bsSize="md" 
        header={<h3><small>Planning Poker</small><br/><strong>{currentSession.name}</strong></h3>} 
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
}

export default SessionPanel;
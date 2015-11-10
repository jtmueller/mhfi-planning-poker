/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {
  Panel, Well, ListGroup, ListGroupItem,
  Glyphicon, Badge, Input, Button, ButtonToolbar
} from 'react-bootstrap';

import { IRecord, AppState, User } from '../models/pokerModels';
import SessionSelector from './SessionSelector';
import UserListItem from './UserListItem';

interface MainSectionProps {
  appState: AppState;
  actions: any;
}

class MainSection extends React.Component<MainSectionProps, any> {
  constructor(props, context) {
    super(props, context);
    this.handleDescChange = this.handleDescChange.bind(this);
  }
  
  // shouldComponentUpdate(nextProps: MainSectionProps, nextState) {
  //   return this.props.appState !== nextProps.appState; 
  // }
  
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
    return (
      <Panel bsStyle="primary" bsSize="md" 
        header={<h3>{currentSession.name}</h3>} 
        footer={this.renderFooter()}>
        { this.renderDesc() }
        <ListGroup fill>
          { users.toJS().map((u:User) => 
              <UserListItem key={u.userId} user={u} isCurrentUser={ u.userId === currentUser.userId } />) }
        </ListGroup>
      </Panel>
    );
  }
  
  private renderFooter() {
    const { currentSession, currentUser } = this.props.appState;
    const { leaveSession } = this.props.actions;
    let isAdmin = currentSession.adminUser === currentUser.userId;
    
    return [
      <ButtonToolbar key={0} className="pull-right">
        { isAdmin ? [
          <Button key="reveal" bsStyle="success" bsSize="small">Reveal Votes</Button>,
          <Button key="clear" bsStyle="danger" bsSize="small">Clear Votes</Button> 
        ] : [] }
        <Button bsSize="small" onClick={() => leaveSession(currentSession.sessionId, currentUser.userId)}>
          Leave Session
        </Button>
      </ButtonToolbar>,
      <div key={1} className="clearfix" />
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
    
    if (!currentUser.userId)
      return <Well>Please sign in.</Well>;
      
    if (!currentSession.sessionId)
      return this.renderSessionSelect();
      
    return this.renderSession();
  }
}

export default MainSection;

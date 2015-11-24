/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {
  Panel, Button, ListGroup, ListGroupItem, 
  Input
} from 'react-bootstrap';

import {
  IRecord, Session, User, SessionList
} from '../models/pokerModels'

interface SelectorProps {
  addSession: (name:string, desc:string, user:User) => Session;
  joinSession: (sessionId:string, user:User) => void;
  sessions: SessionList;
  currentUser: IRecord<User>;
}

interface SelectorState {
  newSessionName?: string;
  selectedSession?: string;
}

class SessionSelector extends React.Component<SelectorProps, SelectorState> {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      newSessionName: '',
      selectedSession: ''
    };
    
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  
  shouldComponentUpdate(nextProps: SelectorProps, nextState: SelectorState) {
    return this.state.selectedSession !== nextState.selectedSession ||
      this.state.newSessionName !== nextState.newSessionName ||
      this.props.sessions !== nextProps.sessions ||
      this.props.currentUser !== nextProps.currentUser;
  }
  
  private handleDialogSubmit(e) {
    const { newSessionName, selectedSession } = this.state;
    if (newSessionName) {
      this.props.addSession(newSessionName, '', this.props.currentUser);
    }
    else if (selectedSession) {
      this.props.joinSession(selectedSession, this.props.currentUser);
    }
  }
  
  private handleKeyDown(e) {
    if (e.keyCode === 13) {
      const { newSessionName } = this.state;
      this.props.addSession(newSessionName, '', this.props.currentUser);
      e.preventDefault();
    }
  }
  
  private handleNameChange(e) {
    this.setState({ newSessionName: e.target.value, selectedSession:'' });
  }
    
  selectSession(sessionId: string) {
    if (this.state.selectedSession === sessionId) {
      // double-click: join
      this.props.joinSession(sessionId, this.props.currentUser);
    }
    else {
      // single-click: select
      this.setState({ selectedSession: sessionId });
    }
  }
  
  render() {
    const { sessions } = this.props;
    const { selectedSession, newSessionName } = this.state;
    
    let footerItems = [     
      <Button key={0}
        className="pull-right"
        onClick={this.handleDialogSubmit} 
        disabled={ !newSessionName && !selectedSession }
        bsStyle="primary">Join</Button>,
      <div key={1} className="clearfix" />
    ];
        
    return (
      <Panel bsStyle="primary" 
        header={<h3><small>Planning Poker</small><br /><strong>Join or Create a Session</strong></h3>}
        footer={footerItems}>
        { sessions.size === 0 ? null :
          <ListGroup>
            { sessions.map(s =>
                <ListGroupItem key={s.sessionId}
                  active={s.sessionId === selectedSession} 
                  onClick={() => this.selectSession(s.sessionId)}>
                  { s.name }
                </ListGroupItem>) }
          </ListGroup> }
        <Input
          type="text"
          value={newSessionName}
          placeholder="Session Name"
          label="Create a New Session"
          onChange={this.handleNameChange}
          onKeyDown={this.handleKeyDown} />
      </Panel>
    );
  }
}

export default SessionSelector;

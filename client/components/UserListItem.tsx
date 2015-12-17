/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import * as React from 'react';
import {
  ListGroupItem, Glyphicon, Badge, Button,
  DropdownButton, MenuItem
} from 'react-bootstrap';

import { 
  IRecord, User, Session, StoryPoints
} from '../models/pokerModels';

interface UserListItemProps {
  session: Session;
  user: User;
  isCurrentUser: boolean;
  key?: string;
  votesRevealed: boolean;
  setVote: (sessionId:string, userId:string, vote:number) => void;
}

class UserListItem extends React.Component<UserListItemProps, any> {
  
  shouldComponentUpdate(nextProps: UserListItemProps, nextState) {
    return this.props.user !== nextProps.user ||
      this.props.votesRevealed !== nextProps.votesRevealed ||
      this.props.session !== nextProps.session;
  }
  
  private badgeStyle(vote: number) {
    let backgroundColor = '';
    let color = '';
    switch (vote) {
      case 1:
        backgroundColor = '#4dd0e1';
        break;
      case 2:
        backgroundColor = '#4d6bcac';
        break;
      case 3:
        backgroundColor = '#81C784';
        break;
      case 5:
        backgroundColor = '#DCE775';
        color = 'slategray';
        break;
      case 8:
        backgroundColor = '#FFF176';
        color = 'slategray';
        break;
      case 13:
        backgroundColor = '#FFC107';
        break;
      case 20:
        backgroundColor = '#FFB74D';
        break;
      case 40:
        backgroundColor = '#F57C00';
        break;
      case 100:
        backgroundColor = '#f44336';
        break;
    }
    
    return { backgroundColor, color };
  }
  
  private renderVote(user:User) {
    const { votesRevealed } = this.props;
    if (!votesRevealed) {
      return !user.vote || user.vote === -100
        ? <Badge>?</Badge>
        : <Badge><Glyphicon glyph="ok" /></Badge>;
    }
    
    if (!user.vote || user.vote === -100)
      return <Badge>?</Badge>;
      
    if (user.vote === -1)
      return <Badge><Glyphicon glyph="ban-circle" /></Badge>;
    
    return <span className="badge" style={this.badgeStyle(user.vote)}>{user.vote}</span>;
  }
  
  private renderVoteButton() {
    return (
      <DropdownButton title="Vote!" id="vote"
        bsSize="small" bsStyle="warning" pullRight
        onSelect={(event, eventKey) => this.handleVote(eventKey)}>
        { StoryPoints.map(x => 
            <MenuItem key={x} eventKey={x}>
              { x === -1 
                ? <Badge><Glyphicon glyph="ban-circle" /></Badge> 
                : <span className="badge" style={this.badgeStyle(x)}>{x}</span> }
            </MenuItem>) }
      </DropdownButton> 
    );
  }
  
  private handleVote(vote: number) {
    const { setVote, session, user } = this.props;
    this.props.setVote(session.sessionId, user.userId, vote);
  }
  
  render() {
    const { user, isCurrentUser } = this.props;
    return (
      <ListGroupItem>
        <img src={user.avatarUrl} className="img-circle" style={{ width:30, height:30, marginRight:10 }} />
        { user.name }
        <span style={{ float:'right', fontSize:18, marginTop: isCurrentUser ? 0 : 5 }}>
          { isCurrentUser && (!user.vote || user.vote === -100)
            ? this.renderVoteButton()
            : this.renderVote(user) }
        </span>
      </ListGroupItem>
    );
  }
}

export default UserListItem;
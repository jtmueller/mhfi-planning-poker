/// <reference path="../../typings/tsd.d.ts" />

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
  private renderVote(user:User) {
    const { votesRevealed } = this.props;
    if (!votesRevealed || user.vote == null)
      return <Badge>?</Badge>;
      
    if (user.vote === -1)
      return <Badge><Glyphicon glyph="ban-circle" /></Badge>;
    
    return <Badge>{user.vote}</Badge>
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
                : <Badge>{x}</Badge> }
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
          { isCurrentUser && user.vote == null
            ? this.renderVoteButton()
            : this.renderVote(user) }
        </span>
      </ListGroupItem>
    );
  }
}

export default UserListItem;
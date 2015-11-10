/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {
  ListGroupItem, Glyphicon, Badge, Button
} from 'react-bootstrap';

import { IRecord, User } from '../models/pokerModels';

interface UserListItemProps {
  user: User;
  isCurrentUser: boolean;
  key?: string;
}

class UserListItem extends React.Component<UserListItemProps, any> {
  private renderVote(user:User) {
    // TODO: app-state for whether votes have been revealed 
    if (user.vote == null)
      return <Glyphicon glyph="question-sign" />;
      
    if (user.vote === -1)
      return <Glyphicon glyph="ban-circle" />;
    
    return <Badge>{user.vote}</Badge>
  }
  
  render() {
    const { user, isCurrentUser } = this.props;
    return (
      <ListGroupItem>
        <img src={user.avatarUrl} className="img-circle" style={{ width:30, height:30, marginRight:10 }} />
        { user.name }
        <span style={{ float:'right', fontSize:18, marginTop: isCurrentUser ? 0 : 5 }}>
          { isCurrentUser 
            ? <Button bsStyle="warning" bsSize="small">Vote!</Button> 
            : this.renderVote(user) }
        </span>
      </ListGroupItem>
    );
  }
}

export default UserListItem;
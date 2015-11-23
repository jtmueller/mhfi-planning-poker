/// <reference path="../../typings/tsd.d.ts" />

import { handleActions, Action } from 'redux-actions';
import * as Immutable from 'immutable';

import { 
  IRecord, User, Session, AppState,
  UserRecord, SessionRecord, AppRecord,
  SessionNames, UserList
} from '../models/pokerModels';

import { 
  SessionAction, 
  UserAction,
  VoteAction
} from '../constants/ActionTypes';

const initialState: IRecord<AppState> = new AppRecord();

export default handleActions<AppState>({
  
  [SessionAction.Add]: (state:IRecord<AppState>, action:Action) => {
    const { session, prevSessionId } = action.payload;
    
    return <any>state.update('sessionNames', (sns:SessionNames) => {
      let lastIndex = prevSessionId ? sns.findIndex(sn => sn.sessionId === prevSessionId) : -1;
      //console.log(lastIndex, session.name);
      
      if (lastIndex === -1) {
        return sns.unshift(new SessionRecord(session));
      }
      else {
        return sns.splice(lastIndex + 1, 0, new SessionRecord(session)).toList();
      }
    });
  },
  
  [SessionAction.Change]: (state:IRecord<AppState>, action:Action) => {
    const session: Session = action.payload;
    
    return state.withMutations(mutable => {
      mutable.update('sessionNames', (sns:SessionNames) => 
        sns.map(sn => 
          session && sn.sessionId === session.sessionId
            ? sn.merge(session) : sn
        ).toList()
      );
        
      if (session && state.currentSession.sessionId === session.sessionId) {
        mutable.update('currentSession', (curSession:IRecord<Session>) =>
          curSession.merge(session));
      }
    });
  },
  
  [SessionAction.Remove]: (state:IRecord<AppState>, action:Action) => {
    const sessionId: string = action.payload;

    return state.withMutations(mutable => {
      mutable.update('sessionNames', (sns:SessionNames) =>
        sns.filter(x => x.sessionId !== sessionId).toList());
      
      if (state.currentSession.sessionId === sessionId) {
        mutable.update('currentSession', () => new SessionRecord());
      }
    });
  },
  
  [SessionAction.Join]: (state:IRecord<AppState>, action:Action) => {
    return state.update('currentSession', (curSession:IRecord<Session>) =>
      curSession.merge(action.payload));
  },
  
  [SessionAction.Leave]: (state:IRecord<AppState>, action:Action) => {
    let newState = state.withMutations(mutable => {
      mutable.update('currentSession', () => new SessionRecord());
      mutable.update('users', () => Immutable.List([]));
    });
    
    //console.log(SessionAction.Leave, newState.toJS());
    return newState;
  },
  
  [UserAction.Add]: (state:IRecord<AppState>, action:Action) => {
    const { user, prevUserId } = action.payload;
    //console.log(UserAction.Add, user.userId);
    
    return state.update('users', (curUsers:UserList) => {
      let lastIndex = prevUserId ? curUsers.findIndex(u => u.userId === prevUserId) : -1;
      //console.log(lastIndex, session.name);
      
      if (lastIndex === -1) {
        return curUsers.unshift(new UserRecord(user));
      }
      else {
        return curUsers.splice(lastIndex + 1, 0, new UserRecord(user)).toList();
      }
    });
  },
  
  [UserAction.Change]: (state:IRecord<AppState>, action:Action) => {
    let changedUser: User = action.payload;
    
    return state.update('users', (curUsers:UserList) =>
        curUsers
          .map(u => u.userId === changedUser.userId ? u.merge(changedUser) : u)
          .toList());
  },
  
  [UserAction.Remove]: (state:IRecord<AppState>, action:Action) => {
    let removedUser: User = action.payload;
    
    let newState = state.withMutations(mutable => {
      mutable.update('users', (curUsers:UserList) =>
        curUsers.filter(u => u.userId !== removedUser.userId).toList());
        
      if (removedUser.userId === state.currentUser.userId) {
        // if we were removed from a session list, we should not have a current session
        mutable.update('currentSession', () => new SessionRecord());
      }
    });
    
    //console.log(UserAction.Remove, removedUser, newState.toJS());
    return newState;
  },
  
  [UserAction.Auth]: (state:IRecord<AppState>, action:Action) => {
    const user: User = action.payload;
    return state.update('currentUser', (curUser:IRecord<User>) =>
      curUser.merge(user));
  }
  
}, initialState);

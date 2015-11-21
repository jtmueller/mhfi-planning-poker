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
    const session: Session = action.payload;
    return <any>state.update('sessionNames', (sns:SessionNames) => 
      sns.push(new SessionRecord(session)));
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
    // return state.update('sessionNames', (sns:SessionNames) =>
    //    sns.filter(x => x.sessionId !== sessionId).toList());
    return state.withMutations(mutable => {
      mutable.update('sessionNames', (sns:SessionNames) =>
        sns.filter(x => x.sessionId !== sessionId).toList());
      
      if (state.currentSession.sessionId === sessionId) {
        mutable.update('currentSession', () => new SessionRecord());
      }
    });
  },
  
  [SessionAction.ListChange]: (state:IRecord<AppState>, action:Action) => {
    const newSessions: Session[] = action.payload;
    
    // Immutable.List.merge goes by indexes, replaces items without regard to identity
    // For now just replace all sessions instead, but may want to use more granular add/remove
    // events from Firebase instead of 'value' for better performance.
    return state.update('sessionNames', () => Immutable.List(newSessions.map(s => new SessionRecord(s))));
  },
  
  [SessionAction.Join]: (state:IRecord<AppState>, action:Action) => {
    return state.update('currentSession', (curSession:IRecord<Session>) =>
      curSession.merge(action.payload));
  },
  
  [SessionAction.Leave]: (state:IRecord<AppState>, action:Action) => {
    return state.withMutations(mutable => {
      mutable.update('currentSession', () => new SessionRecord());
      mutable.update('users', () => Immutable.List([]));
    });
  },
  
  [UserAction.ListChange]: (state:IRecord<AppState>, action:Action) => {
    const newUsers: User[] = action.payload;
    
    if (newUsers.some(value => value.userId === state.currentUser.userId)) {
      // Immutable.List.merge goes by indexes, replaces items without regard to identity
      // For now just replace all users instead, but may want to use more granular add/remove
      // events from Firebase instead of 'value' for better performance.
      return state.update('users', () => Immutable.List(newUsers.map(u => new UserRecord(u))));
    } 
    else {
      // The user list does not contain the current user, so clear the currentSession state property
      return state.withMutations(mutable => {
        mutable.update('currentSession', () => new SessionRecord());
      });
    }
  },
  
  [UserAction.Auth]: (state:IRecord<AppState>, action:Action) => {
    const user: User = action.payload;
    return state.update('currentUser', (curUser:IRecord<User>) =>
      curUser.merge(user));
  }
  
}, initialState);

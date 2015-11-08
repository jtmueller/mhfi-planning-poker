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
        sns.map(sn => sn.merge(session)).toList());
        
      if (state.currentSession.sessionId === session.sessionId) {
        mutable.update('currentSession', (curSession:IRecord<Session>) =>
          curSession.merge(session));
      }
    });
  },
  
  [SessionAction.Remove]: (state:IRecord<AppState>, action:Action) => {
    const sessionId: string = action.payload;
    return state.update('sessionNames', (sns:SessionNames) =>
       sns.filter(x => x.sessionId !== sessionId).toList());
  },
  
  [SessionAction.ListChange]: (state:IRecord<AppState>, action:Action) => {
    return state.update('sessionNames', (sns:SessionNames) =>
      sns.merge(action.payload));
  },
  
  [SessionAction.Join]: (state:IRecord<AppState>, action:Action) => {
    return state.update('currentSession', (curSession:IRecord<Session>) => {
      curSession.merge(action.payload);
    });
  },
  
  [SessionAction.Leave]: (state:IRecord<AppState>, action:Action) => {
    return state.update('currentSession', (curSession:IRecord<Session>) => {
      if (curSession.sessionId === action.payload) {
        return new SessionRecord();
      }
      return curSession;
    });
  },
  
  [UserAction.ListChange]: (state:IRecord<AppState>, action:Action) => {
    return state.update('users', (users:UserList) =>
      users.merge(action.payload));
  }
  
}, initialState);

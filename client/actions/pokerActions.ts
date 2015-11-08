/// <reference path="../../typings/tsd.d.ts" />

// TODO: React-Router + integration with redux?
// https://github.com/rackt/redux/issues/291
// http://rackt.org/redux/docs/advanced/AsyncActions.html

import { createAction, Action } from 'redux-actions';
import * as Firebase from 'firebase';

import { 
  IRecord, User, Session
} from '../models/pokerModels';

import { 
  SessionAction, 
  UserAction,
  VoteAction
} from '../constants/ActionTypes';

import { store } from '../main';

interface IAction {
  type: string,
  payload?: any;
  error?: boolean;
  meta?: any;
}

type Dispatcher = (IAction) => void;

const dbRoot = new Firebase('https://mhfi-poker.firebaseio.com/');
const sessions = dbRoot.child('sessions');
const users = dbRoot.child('users');

dbRoot.authWithOAuthPopup('google', (error, authData) => {
  if (error) {
    console.error('Authentication Error', error);
  }
  else {
    console.log('Authenticated: ', authData);
    let { displayName, profileImageURL } = authData[authData.provider];
    store.dispatch({
      type: UserAction.Auth,
      payload: {
        userId: authData.uid,
        name: displayName,
        avatarUrl: profileImageURL
      }
    });
  }
});

sessions.on('value', snapshot => {
  store.dispatch({
    type: SessionAction.ListChange,
    payload: snapshot.val()
  });
});

const addSession = createAction<Session>(
  SessionAction.Add,
  (name:string, desc:string, userId:string) => {
    var newRef = sessions.push();
    
    const session: Session = {
      sessionId: newRef.key(),
      name, desc,
      lastUpdated: new Date(),
      adminUser: userId
    };
    
    newRef.set(session);
    return session;
  }
);

const editSession = createAction<Session>(
  SessionAction.Change,
  (sessionId:string, name:string, desc:string) => {
    const session = { 
      sessionId, name, desc, 
      lastUpdated: new Date() 
    };
    sessions.child(sessionId).update(session);
    
    return session;
  }
);

const removeSession = createAction(
  SessionAction.Remove,
  (sessionId:string) => {
    sessions.child(sessionId).remove();
    return sessionId;
  }
);

const joinSession = (sessionId:string, userId:string, name: string) =>
  (dispatch: Dispatcher) => {
    var sessionUsers = users.child(sessionId);
    sessionUsers.update({ [userId]: { name } });
    
    sessions.child(sessionId).once('value', snapshot => {
      dispatch({
        type: SessionAction.Join,
        payload: snapshot.val()
      });
    });
    
    sessions.child(sessionId).on('value', snapshot => {
      dispatch({
        type: SessionAction.Change,
        payload: snapshot.val()
      });
    });
      
    sessionUsers.on('value', snapshot => {
      dispatch({
        type: UserAction.ListChange,
        payload: snapshot.val()
      });
    });
    
    window.onbeforeunload = e => {
      sessionUsers.child(userId).remove();
    };
  };

const leaveSession = createAction(
  SessionAction.Leave,
  (sessionId:string, userId:string) => {
    var sessionUsers = users.child(sessionId);
    // not sure if this will work when sessionUsers is not the same instance as .on()
    sessionUsers.off('value');
    sessions.child(sessionId).off('value');
    window.onbeforeunload = null;
    sessionUsers.child(userId).remove();
    return sessionId;
  }
);

const setVote = (sessionId: string, userId: string, vote: number) =>
  (dispatch:Dispatcher) => {
    users.child(`${sessionId}/${userId}`)
      .update({ vote });
      
    dispatch({
      type: VoteAction.Set,
      payload: { userId, vote }
    })
  };
  
const clearVotes = (sessionId: string, userId: string) =>
  (dispatch:Dispatcher) => {
    // TODO
  };

export {
  addSession,
  editSession,
  removeSession,
  joinSession,
  leaveSession,
  setVote,
  clearVotes
}

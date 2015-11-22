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

sessions.on('value', snapshot => {
  let value = snapshot.val();
  store.dispatch({
    type: SessionAction.ListChange,
    payload: value ? Object.keys(value).map(k => value[k]) : []
  });
});

const login = () =>
  (dispatch:Dispatcher) => {
    const handleAuth = (authData) => {
      let { displayName, profileImageURL } = authData[authData.provider];
      dispatch({
        type: UserAction.Auth,
        payload: {
          userId: authData.uid,
          name: displayName,
          avatarUrl: profileImageURL
        }
      });
    }
    
    let auth = dbRoot.getAuth();
    if (auth) {
      handleAuth(auth);
    }
    else {
      dbRoot.authWithOAuthPopup('google', (error, authData) => {
        if (error) {
          console.error('Authentication Error', error);
        }
        else {
          //console.log('Authenticated: ', authData);
          handleAuth(authData)
        }
      });
    }
  }

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
    users.child(sessionId).remove();
    sessions.child(sessionId).remove();
    return sessionId;
  }
);

const joinSession = (sessionId:string, user:IRecord<User>) =>
  (dispatch: Dispatcher) => {
    const sessionUsers = users.child(sessionId);
    let userData = {
      [user.userId]: user.toJS()
    };
    sessionUsers.update(userData);
    
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
      let value = snapshot.val();
      dispatch({
        type: UserAction.ListChange,
        payload: value ? Object.keys(value).map(k => value[k]) : []
      });
    });
    
    window.onbeforeunload = e => {
      sessionUsers.child(user.userId).remove();
    };
  };
  
const addSession = (name:string, desc:string, user:IRecord<User>) =>
  (dispatch: Dispatcher) => {
    var newRef = sessions.push();
    
    const session: Session = {
      sessionId: newRef.key(),
      name, desc,
      lastUpdated: new Date(),
      adminUser: user.userId
    };
    
    newRef.set(session, (error) => {
      if (error) {
        console.error(error);
      }
      else {
        joinSession(session.sessionId, user)(dispatch);
      }
    });
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

const setVote = createAction(
  VoteAction.Set,
  (sessionId: string, userId: string, vote: number) => {
    users.child(`${sessionId}/${userId}`)
      .update({ vote });
      
    return { sessionId, userId, vote };
  }
);
  
const clearVotes = (sessionId: string) =>
  (dispatch:Dispatcher) => {
    users.child(sessionId)
      .transaction(current => {
        Object.keys(current).forEach(key => {
          current[key].vote = null;
        });
        return current;
      });
  };

export {
  login,
  addSession,
  editSession,
  removeSession,
  joinSession,
  leaveSession,
  setVote,
  clearVotes
}

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
const orderedSessions = sessions.orderByChild('name');
const users = dbRoot.child('users');
let curUserList: FirebaseQuery;

orderedSessions.on('child_added', (snapshot, prevSessionId) => {
  let session = snapshot.val();
  //console.log('child_added', session, prevChildKey);
  store.dispatch({
    type: SessionAction.Add,
    payload: { session, prevSessionId }
  })
});

orderedSessions.on('child_changed', (snapshot) => {
  let session = snapshot.val();
  //console.log('child_changed', session);
  store.dispatch({
    type: SessionAction.Change,
    payload: snapshot.val()
  });
});

orderedSessions.on('child_removed', (snapshot) => {
  let session = snapshot.val();
  //console.log('child_removed', session);
  store.dispatch({
    type: SessionAction.Remove,
    payload: snapshot.val().sessionId
  });
});

// orderedSessions.on('child_moved', (snapshot, prevChildKey) => {
//   let session = snapshot.val();
//   console.log('child_moved', session, prevChildKey);
// });

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
    const orderedUsers = sessionUsers.orderByChild('name');
    
    orderedUsers.on('child_added', (snapshot, prevUserId) => {
      let user = snapshot.val();
      //console.log('child_added (user)', user);
      
      dispatch({
        type: UserAction.Add,
        payload: { user, prevUserId }
      });
    });
    
    orderedUsers.on('child_changed', snapshot => {
      let user = snapshot.val();
      dispatch({
        type: UserAction.Change,
        payload: user
      });
    });
    
    orderedUsers.on('child_removed', snapshot => {
      let removedUser = snapshot.val();
      dispatch({
        type: UserAction.Remove,
        payload: removedUser
      });
    });
    
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
    
    window.onbeforeunload = e => {
      sessionUsers.child(user.userId).remove();
    };
  };
  
const addSession = (name:string, desc:string, user:IRecord<User>) =>
  (dispatch: Dispatcher) => {
    let newRef = sessions.push();
    
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
    const sessionUsers = users.child(sessionId);
    const orderedUsers = sessionUsers.orderByChild('name');
    
    // this works, even though it's not the same instance that 'on' was called from
    orderedUsers.off('child_added');
    orderedUsers.off('child_changed');
    orderedUsers.off('child_removed');
    
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
  
const clearVotes = createAction(
  VoteAction.ClearAll,
  (sessionId: string) => {
    users.child(sessionId)
      .transaction(current => {
        Object.keys(current).forEach(key => {
          // used to set this to null, but Firebase
          // doesn't send null keys, so the merge didn't
          // remove the vote client-side
          current[key].vote = -100;
        });
        return current;
      });
      
     sessions.child(sessionId).update({ votesRevealed: false });
  }
);

const revealVotes = createAction(
  VoteAction.Reveal,
  (sessionId: string) => {
    sessions.child(sessionId).update({ votesRevealed: true });
  }
);

export {
  login,
  addSession,
  editSession,
  removeSession,
  joinSession,
  leaveSession,
  setVote,
  clearVotes,
  revealVotes
}

/// <reference path="../../typings/tsd.d.ts" />

import * as Immutable from 'immutable';

export type IRecord<T> = Immutable.Record.IRecord<T>

export interface User {
  name: string;
}

/// Instantiating this constructor generates an immutable User record wrapper.
export const UserRecord = Immutable.Record<User>({ name:'' }, "User");
export type UserList = Immutable.List<IRecord<User>>;

export interface Vote {
  userName: string;
  points: number;
}

/// Instantiating this constructor generates an immutable Vote record wrapper.
export const VoteRecord = Immutable.Record<Vote>({ userName:'', points:-1 }, "Vote");
export type VoteList = Immutable.List<IRecord<Vote>>;

export interface Session {
  name: string;
  description: string;
  admin: IRecord<User>;
  users: UserList;
  votes: VoteList;
  lastUpdated: Date;
}

var defaultSession: Session = { 
  name:'', description:'', 
  admin: new UserRecord(), 
  users: Immutable.List([]), 
  votes: Immutable.List([]),
  lastUpdated: new Date()
};
/// Instantiating this constructor generates an immutable Session record wrapper.
export const SessionRecord = Immutable.Record<Session>(defaultSession, "Session");

export interface AppState {
  currentUser: IRecord<User>;
  currentSession: IRecord<Session>;
  sessionNames: Immutable.List<string>;
}
var defaultAppState: AppState = {
  currentUser: new UserRecord(),
  currentSession: new SessionRecord(),
  sessionNames: Immutable.List([])
};
export const AppRecord = Immutable.Record<AppState>(defaultAppState, "App");

/// Valid story points. Abstain = -1.
export const StoryPoints = Immutable.List<number>([-1,1,2,3,5,8,13,20,40,100]);


/// <reference path="../../typings/tsd.d.ts" />

import * as Immutable from 'immutable';

export type IRecord<T> = Immutable.Record.IRecord<T>

export interface User {
  userId: string;
  name: string;
  avatarUrl?: string;
  vote?: number;
}
const defaultUser: User = { 
  userId: '', name: '', 
  avatarUrl: '', vote: -100 
};
/// Instantiating this constructor generates an immutable User record wrapper.
export const UserRecord = Immutable.Record<User>(defaultUser, "User");
export type UserList = Immutable.List<IRecord<User>>;

export interface Session {
  sessionId: string
  name: string;
  desc: string;
  adminUser?: string;
  lastUpdated: Date;
  votesRevealed?: boolean;
}
const defaultSession: Session = { 
  sessionId: '', name:'', desc:'',
  adminUser: '', votesRevealed: false,
  lastUpdated: new Date()
};
/// Instantiating this constructor generates an immutable Session record wrapper.
export const SessionRecord = Immutable.Record<Session>(defaultSession, "Session");
export type SessionNames = Immutable.List<IRecord<{ sessionId:string, name:string, desc:string }>>;

export interface AppState {
  currentUser: IRecord<User>;
  currentSession: IRecord<Session>;
  sessionNames: SessionNames;
  users: UserList;
}
const defaultAppState: AppState = {
  currentUser: new UserRecord(),
  currentSession: new SessionRecord(),
  sessionNames: Immutable.List([]),
  users: Immutable.List([])
};
export const AppRecord = Immutable.Record<AppState>(defaultAppState, "App");

/// Valid story points. Abstain = -1.
export const StoryPoints = Immutable.List<number>([-1,1,2,3,5,8,13,20,40,100]);


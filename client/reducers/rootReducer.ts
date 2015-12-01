/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import { combineReducers } from 'redux';

import state from './pokerReducers';

const rootReducer = combineReducers({
  state: state
});

export { rootReducer };

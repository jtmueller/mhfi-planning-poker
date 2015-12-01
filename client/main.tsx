/// <reference path="../typings/tsd.d.ts" />
"use strict";

import * as React from 'react';

import {
  Store,
  compose,
  createStore,
  bindActionCreators,
  combineReducers,
  applyMiddleware
} from 'redux';
import thunk from './actions/redux-thunk';
import {
  connect,
  Provider
} from 'react-redux';
import { Action } from 'redux-actions';

import App from './containers/App';
import { rootReducer } from './reducers/rootReducer';

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const initialState = {
};

export const store: Store = createStoreWithMiddleware(rootReducer, initialState);

React.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);


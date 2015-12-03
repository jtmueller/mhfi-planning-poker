'use strict';

export default function thunkMiddleware(_ref) {
  let { dispatch, getState } = _ref;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}
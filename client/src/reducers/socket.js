import { createReducer } from './_utilities';

import { INIT_SOCKET } from '../actions/socket';

const initialState = {};

function initSocket(state, action) {
  return action.socket;
}

export default createReducer(initialState, {
  [INIT_SOCKET]: initSocket,
});

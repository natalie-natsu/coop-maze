import { createReducer } from './_utilities';

import { SET_SOCKET_ID } from '../actions/socket';
import { SET_USER_ID } from '../actions/user';

const initialState = {
  socketId: null,
  userId: null,
};

function setSocketId(state, action) {
  return { ...state, socketId: action.socketId };
}

function setUserId(state, action) {
  return { ...state, userId: action.userId };
}

export default createReducer(initialState, {
  [SET_SOCKET_ID]: setSocketId,
  [SET_USER_ID]: setUserId,
});

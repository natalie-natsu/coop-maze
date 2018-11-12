import { createReducer } from './_utilities';

import { SET_GAME_ID } from '../actions/game';
import { SET_SOCKET_ID } from '../actions/socket';
import { SET_USER_ID } from '../actions/user';

const initialState = {
  gameId: null,
  socketId: null,
  userId: null,
};

function setGameId(state, action) {
  return { ...state, gameId: action.gameId };
}

function setSocketId(state, action) {
  return { ...state, socketId: action.socketId };
}

function setUserId(state, action) {
  return { ...state, userId: action.userId };
}

export default createReducer(initialState, {
  [SET_GAME_ID]: setGameId,
  [SET_SOCKET_ID]: setSocketId,
  [SET_USER_ID]: setUserId,
});

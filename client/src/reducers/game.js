import { createReducer } from './_utilities';

import { UPDATE_GAME, UPDATE_PLAYERS } from '../actions/game';

const initialState = {};

function updateGame(state, action) {
  return { ...state, ...action.game };
}

function updateUsers(state, action) {
  const { users } = action;
  return users ? { ...state, users } : state;
}

export default createReducer(initialState, {
  [UPDATE_GAME]: updateGame,
  [UPDATE_PLAYERS]: updateUsers,
});

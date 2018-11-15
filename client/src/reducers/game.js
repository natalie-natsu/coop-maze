import { createReducer } from './_utilities';

import { UPDATE_GAME } from '../actions/game';

const initialState = {};

function updateGame(state, action) {
  return { ...state, ...action.game };
}

export default createReducer(initialState, {
  [UPDATE_GAME]: updateGame,
});

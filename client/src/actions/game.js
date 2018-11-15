export const SET_GAME_ID = 'SET_GAME_ID';
export const UPDATE_GAME = 'UPDATE_GAME';

export const setGameId = gameId => ({
  type: SET_GAME_ID,
  gameId,
});

export const updateGame = game => ({
  type: UPDATE_GAME,
  game,
});

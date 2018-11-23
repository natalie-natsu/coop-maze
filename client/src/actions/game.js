export const SET_GAME_ID = 'SET_GAME_ID';
export const UPDATE_GAME = 'UPDATE_GAME';
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';

export const setGameId = gameId => ({
  type: SET_GAME_ID,
  gameId,
});

export const updateGame = game => ({
  type: UPDATE_GAME,
  game,
});

export const updatePlayers = players => ({
  type: UPDATE_PLAYERS,
  users: players,
});

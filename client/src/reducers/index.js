import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { reducer as burgerMenu } from 'redux-burger-menu';

import { RESET_APP } from '../actions/app';

import global from './global';
import entities from './entities';
import form from './form';
import game from './game';
import pages from './pages';
import socket from './socket';

const appReducer = combineReducers({
  burgerMenu,
  entities,
  form,
  game,
  global,
  pages,
  socket,
});

const rootReducer = (state, action) => {
  let newState = state;

  if (action.type === RESET_APP) {
    if (storage && storage.removeItem) {
      Object.keys(state).forEach((key) => {
        storage.removeItem(`persist:${key}`);
      });
    }
    newState = undefined;
  }
  return appReducer(newState, action);
};

export default rootReducer;

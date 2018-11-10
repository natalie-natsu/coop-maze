import { reducer as formReducer } from 'redux-form';

export default formReducer.plugin({
  // 'sign-in-form': (state, action) => {
  //     switch (action.type) {
  //     case SIGN_OUT:
  //     case SUCCESS_SIGN_IN: return undefined;
  //     default: return state;
  //     }
  // },
});

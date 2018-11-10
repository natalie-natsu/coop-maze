/**
 * Handle errors in a global way
 */
export default (/* store */) => next => (action) => {
  if (action.error) {
    switch (action.error.message) {
      default:
        break;
    }
  }

  return next(action);
};

import { createStore, applyMiddleware, bindActionCreators, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import actions from './actions';
import selectors from './selectors';
import buildApi from './builder';

function bindStateSelectors(unboundSelectors, state) {
  return Object.entries(unboundSelectors).reduce((accum, [key, selector]) => {
    // eslint-disable-next-line no-param-reassign
    accum[key] = (...args) => selector(state.getState(), ...args);
    return accum;
  }, {});
}

// eslint-disable-next-line import/prefer-default-export
export function configure(config) {
  const api = buildApi(config);

  const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'API' })
    : compose;

  const store = createStore(
    api.reducer,
    api.initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware)),
  );

  Object.assign(actions, bindActionCreators(api.actions, store.dispatch));
  Object.assign(selectors, bindStateSelectors(api.selectors, store));

  return {
    store,
    actions,
    selectors,
  };
}

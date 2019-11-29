import { combineReducers } from 'redux';

function startBehaviour(state) {
  return {
    ...state,
    isFetching: true,
  };
}

function endBehaviour(state, { error, payload }) {
  return {
    ...state,
    isFetching: false,
    lastFetched: Date.now(),
    lastError: error ? payload : null,
  };
}

export function buildActionBehaviours(actionFunc) {
  return {
    [actionFunc.startActionType]: startBehaviour,
    [actionFunc.endActionType]: endBehaviour,
  };
}

export function buildReducer(behaviours) {
  const entryReducers = Object.entries(behaviours).reduce((accum, [entryKey, entryBehaviours]) => {
    // eslint-disable-next-line no-param-reassign
    accum[entryKey] = (state, action) => {
      const behaviour = entryBehaviours[action.type];
      return behaviour ? behaviour(state, action) : state || {};
    };
    return accum;
  }, {});
  return combineReducers(entryReducers);
}

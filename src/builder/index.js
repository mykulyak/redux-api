import assert from 'assert';

import { camelCase } from '../util';
import { getOperationConfig } from '../operations';
import buildActionFunc from './actions';
import { buildActionBehaviours, buildReducer } from './reducers';
import buildActionSelectors from './selectors';

export default function configure(config) {
  const resultActions = {};
  const resultBehaviours = {};
  const resultSelectors = {};
  const resultInitialState = {};

  const { entries } = config;

  Object.entries(entries).forEach(([entryKey, entryConfig]) => {
    const { actions, cache } = entryConfig;

    resultInitialState[entryKey] = {
      isFetching: false,
      lastFetched: null,
      lastError: null,
    };

    actions.forEach(operKey => {
      const operConfig = getOperationConfig(operKey);

      const actionFunc = buildActionFunc(operConfig, entryKey, entryConfig, config);
      const actionName = actionFunc.actionKey;
      assert(!(actionName in resultActions), `Duplicate API action '${actionName}'`);
      resultActions[actionName] = actionFunc;

      const actionBehaviours = buildActionBehaviours(
        actionFunc,
        operConfig,
        entryKey,
        entryConfig,
        config,
      );
      Object.entries(actionBehaviours).forEach(() => {
        resultBehaviours[entryKey] = {
          ...resultBehaviours[entryKey],
          ...actionBehaviours,
        };
      });

      const actionSelectors = buildActionSelectors(
        actionName,
        operConfig,
        entryKey,
        entryConfig,
        config,
      );
      Object.entries(actionSelectors).forEach(([selectorName, selector]) => {
        assert(!(selectorName in resultSelectors), `Duplicate API selector ${selectorName}`);
        resultSelectors[selectorName] = selector;
      });

      if (!operConfig.mutation) {
        // generate cancel action
        const cancelActionName = camelCase(`cancel_${actionName}`);

        resultActions[cancelActionName] = () => {
          global.console.warn(cancelActionName);
        };
      }
    });

    if (cache) {
      const clearCacheActionName = camelCase(`clear_${entryKey}_cache`);
      resultActions[clearCacheActionName] = () => ({
        type: 'CLEAR_CACHE',
        payload: [entryKey],
      });
    }
  });

  resultActions.clearCache = (...entryNames) => ({
    type: 'CLEAR_CACHE',
    payload: entryNames,
  });

  return {
    actions: resultActions,
    selectors: resultSelectors,
    reducer: buildReducer(resultBehaviours),
  };
}

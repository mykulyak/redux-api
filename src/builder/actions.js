import { uniqueRequestId } from '../util';

export default function buildActionFunc(operConfig, entryKey, entryConfig, config) {
  const actionName =
    typeof operConfig.name === 'string' ? operConfig.name : operConfig.name(entryKey, entryConfig);
  const startActionType = operConfig.startActionType(entryKey);
  const endActionType = operConfig.endActionType(entryKey);

  const actionFunc = (...args) => {
    return dispatch => {
      const requestId = uniqueRequestId();

      dispatch({
        type: startActionType,
        payload: operConfig.startActionPayload(args),
        meta: {
          requestId,
          timestamp: Date.now(),
        },
        error: false,
      });

      const callUrl = operConfig.callUrl(args, operConfig, entryConfig, config);
      const callParams = operConfig.callParams(args, operConfig, entryConfig, config);

      return config
        .requestAdapter(callUrl, callParams)
        .then(response => {
          dispatch({
            type: endActionType,
            payload: response,
            meta: {
              requestId,
              timestamp: Date.now(),
            },
          });
          return response;
        })
        .catch(error => {
          dispatch({
            type: endActionType,
            payload: error,
            meta: {
              requestId,
              timestamp: Date.now(),
            },
            error: true,
          });
          return Promise.reject(error);
        });
    };
  };

  actionFunc.actionKey = actionName;
  actionFunc.startActionType = startActionType;
  actionFunc.endActionType = endActionType;

  return actionFunc;
}

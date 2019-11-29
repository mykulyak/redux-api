import { upperFirst } from '../util';

function isPendingSelector(state, entryKey) {
  try {
    return !!state[entryKey].isFetching;
  } catch (err) {
    return true;
  }
}

function isFailedSelector(state, entryKey) {
  try {
    const { lastFetched, isFetching, lastError } = state[entryKey];
    return lastFetched != null && !isFetching && lastError != null;
  } catch (err) {
    return false;
  }
}

function isSucceededSelector(state, entryKey) {
  try {
    const { lastFetched, isFetching, lastError } = state[entryKey];
    return lastFetched != null && !isFetching && lastError == null;
  } catch (err) {
    return false;
  }
}

export default function buildActionSelectors(actionName, operConfig, entryKey) {
  const ucfActionName = upperFirst(actionName);
  const result = {};
  result[`is${ucfActionName}Pending`] = state => isPendingSelector(state, entryKey);
  result[`is${ucfActionName}Failed`] = state => isFailedSelector(state, entryKey);
  result[`is${ucfActionName}Succeeded`] = state => isSucceededSelector(state, entryKey);
  return result;
}

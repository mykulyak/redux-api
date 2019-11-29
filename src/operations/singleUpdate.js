import { constCase, camelCase, formatQueryString, formatRequestBody } from '../util';

// updateSingleEntity({ p1, p2, ... })

export function name(entryKey) {
  return camelCase(`update_${entryKey}`);
}

export const mutation = true;

export function callUrl(actionParams, actionConfig, { url }, { rootUrl }) {
  const queryString = formatQueryString(actionParams[0], actionConfig);
  return `${rootUrl}${url}${queryString}`;
}

export function callParams(actionParams, actionConfig) {
  const requestBody = formatRequestBody(actionParams[0], actionConfig);
  return {
    method: 'put',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(requestBody),
  };
}

export function startActionType(entryKey) {
  return constCase(`update_${entryKey}_start`);
}

export function startActionPayload() {
  return null;
}

export function endActionType(entryKey) {
  return constCase(`update_${entryKey}_end`);
}

export function endActionPayload() {
  return null;
}

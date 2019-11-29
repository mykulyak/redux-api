import { constCase, camelCase, formatQueryString, formatRequestBody } from '../util';

// deleteSingleEntity({ p1, p2, ... })

export function name(entryKey) {
  return camelCase(`delete_${entryKey}`);
}

export const mutation = true;

export function callUrl(actionParams, actionConfig, { url }, { rootUrl }) {
  const queryString = formatQueryString(actionParams[0], actionConfig);
  return `${rootUrl}${url}${queryString}`;
}

export function callParams(actionParams, actionConfig) {
  const requestBody = formatRequestBody(actionParams[0], actionConfig);
  return {
    method: 'delete',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(requestBody),
  };
}

export function startActionType(entryKey) {
  return constCase(`delete_${entryKey}_start`);
}

export function startActionPayload() {
  return null;
}

export function endActionType(entryKey) {
  return constCase(`delete_${entryKey}_end`);
}

export function endActionPayload() {
  return null;
}

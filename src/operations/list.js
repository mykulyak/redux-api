import { constCase, camelCase, formatQueryString } from '../util';

// readEntityList({ p1, p2 ... })

export function name(entryKey) {
  return camelCase(`read_${entryKey}_list`);
}

export const mutation = false;

export function callUrl(actionParams, actionConfig, { url }, { rootUrl }) {
  const queryString = formatQueryString(actionParams, actionConfig);
  return `${rootUrl}${url}${queryString}`;
}

export function callParams() {
  return {
    method: 'get',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: null,
  };
}

export function startActionType(entryKey) {
  return constCase(`read_${entryKey}_list_start`);
}

export function startActionPayload() {
  return null;
}

export function endActionType(entryKey) {
  return constCase(`read_${entryKey}_list_end`);
}

export function endActionPayload(actionParams, responseBody) {
  return responseBody;
}

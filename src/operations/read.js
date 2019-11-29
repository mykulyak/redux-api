import { constCase, camelCase, formatQueryString } from '../util';

// readEntity(id, { p1, p2, ... })

export function name(entryKey) {
  return camelCase(`read_${entryKey}`);
}

export const mutation = false;

export function callUrl([entityId, extraParams], actionConfig, { url }, { rootUrl }) {
  const queryString = formatQueryString(extraParams, actionConfig);
  return `${rootUrl}${url}/${entityId}${queryString}`;
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
  return constCase(`read_${entryKey}_start`);
}

export function startActionPayload() {
  return null;
}

export function endActionType(entryKey) {
  return constCase(`read_${entryKey}_end`);
}

export function endActionPayload() {
  return '';
}

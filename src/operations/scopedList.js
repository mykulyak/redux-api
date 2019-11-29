import { constCase, camelCase, formatQueryString } from '../util';

// readScopedEntityList(scopeId, { p1, p2, ... })

export function name(entryKey) {
  return camelCase(`read_${entryKey}_list`);
}

export const mutation = false;

export function callUrl([scopeId, extraParams], actionConfig, { url }, { rootUrl }) {
  const queryString = formatQueryString(extraParams, actionConfig);
  const baseUrl = `${rootUrl}${url}`.replace(':scopeId', scopeId);
  return `${baseUrl}${queryString}`;
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
  return constCase(`list_${entryKey}_start`);
}

export function startActionPayload() {
  return null;
}

export function endActionType(entryKey) {
  return constCase(`list_${entryKey}_end`);
}

export function endActionPayload() {
  return null;
}

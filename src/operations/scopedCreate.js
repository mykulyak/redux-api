import { constCase, camelCase, formatQueryString, formatRequestBody } from '../util';

// createScopedEntity(scopeId, { p1, p2, ... })

export function name(entryKey) {
  return camelCase(`create_${entryKey}`);
}

export const mutation = true;

export function callUrl([scopeId, extraParams], actionConfig, { url }, { rootUrl }) {
  const queryString = formatQueryString(extraParams, actionConfig);
  const baseUrl = `${rootUrl}${url}`.replace(':scopeId', scopeId);
  return `${baseUrl}${queryString}`;
}

export function callParams([, extraParams], actionConfig) {
  const requestBody = formatRequestBody(extraParams, actionConfig);
  return {
    method: 'post',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(requestBody),
  };
}

export function startActionType(entryKey) {
  return constCase(`create_${entryKey}_start`);
}

export function startActionPayload() {
  return null;
}

export function endActionType(entryKey) {
  return constCase(`create_${entryKey}_end`);
}

export function endActionPayload() {
  return null;
}

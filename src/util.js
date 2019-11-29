export const uniqueRequestId = (() => {
  let nextId = 0;
  return function uniqueId() {
    nextId += 1;
    return `request-${nextId}`;
  };
})();

export function camelCase(str) {
  return str
    .split(/[-_]/g)
    .filter(Boolean)
    .map((s, i) => {
      return i > 0 ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
    })
    .join('');
}

function transformDeep(obj, func) {
  if (Array.isArray(obj)) {
    return obj.map(elem => transformDeep(elem, func));
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((accum, [key, value]) => {
      accum[func(key)] = transformDeep(value, func); // eslint-disable-line no-param-reassign
      return accum;
    }, {});
  }
  return obj;
}

export const camelCaseDeep = obj => transformDeep(obj, camelCase);

export function constCase(str) {
  return str.replace(/([a-z])([A-Z])/g, (m, m1, m2) => `${m1}_${m2}`).toUpperCase();
}

export function snakeCase(str) {
  return str.replace(/([a-z])([A-Z])/g, (m, m1, m2) => `${m1}_${m2.toLowerCase()}`);
}

export const snakeCaseDeep = obj => transformDeep(obj, snakeCase);

export function upperFirst(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function formatQueryString(actionParams, { queryStringParams = [] }) {
  if (!actionParams) {
    return '';
  }
  const result = Object.entries(actionParams)
    .reduce((memo, [paramName, paramValue]) => {
      if (queryStringParams.includes(paramName)) {
        memo.append(paramName, Array.isArray(paramValue) ? paramValue.join(',') : paramValue);
      }
      return memo;
    }, new global.URLSearchParams())
    .toString();
  return result ? `?${result}` : result;
}

export function formatRequestBody(actionParams, { queryStringParams = [] }) {
  if (!actionParams) {
    return null;
  }
  return Object.entries(actionParams).reduce((memo, [key, value]) => {
    if (!queryStringParams.includes(key)) {
      if (!memo) {
        return { [key]: value };
      }
      memo[key] = value; // eslint-disable-line no-param-reassign
    }
    return memo;
  }, null);
}

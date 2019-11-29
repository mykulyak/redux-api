import { expect } from 'chai';

import { snakeCase, formatQueryString, formatRequestBody } from './util';

it('snakeCase', () => {
  expect(snakeCase('domainValue')).to.equal('domain_value');
});

describe('formatQueryString', () => {
  it('without params returns an empty string', () => {
    expect(formatQueryString([], {})).to.equal('');
  });

  it('filters query stirng params', () => {
    expect(
      formatQueryString({ s1: 'a', s2: 'b', p1: 'c' }, { queryStringParams: ['s1', 's2'] }),
    ).to.equal('?s1=a&s2=b');
  });

  it('formats list parameters', () => {
    expect(formatQueryString({ s: [1, 2, 3, 4] }, { queryStringParams: ['s'] })).to.equal(
      '?s=1%2C2%2C3%2C4',
    );
  });
});

describe('formatRequestBody', () => {
  it('without params returns null', () => {
    expect(formatRequestBody({}, {})).to.equal(null);
  });

  it('filters out query params', () => {
    expect(
      formatRequestBody(
        {
          qs: 'a',
          rb: 'b',
        },
        { queryStringParams: ['qs'] },
      ),
    ).to.deep.equal({ rb: 'b' });
  });
});

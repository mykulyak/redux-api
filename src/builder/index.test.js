import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { expect } from 'chai';
import { registerMiddlewares, registerInitialStoreState } from 'redux-actions-assertions';
import { registerAssertions } from 'redux-actions-assertions/chai';

import sinon from 'sinon';

import buildApi from './index';

const CONFIG = {
  rootUrl: 'http://api.organizer.com',
  // requestAdapter: (...args) => Promise.resolve({}),
  responseAdapter: null,
  entries: {
    auth: {
      url: '/auth',
      actions: [
        { extends: 'single-create', name: 'login' },
        { extends: 'single-delete', name: 'logout' },
      ],
    },
    settings: {
      url: '/settings',
      actions: ['single-read', 'single-update'],
      cache: 3600,
    },
    calendar: {
      url: '/calendars',
      actions: ['list', 'read', 'create', 'update', 'delete'],
      cache: {
        lifetime: 600,
        dependants: ['calendarEvent'],
      },
    },
    calendarEvent: {
      url: '/calendars/:scopeId/events',
      actions: [
        {
          extends: 'scoped-list',
          queryStringParams: ['limit'],
        },
        'scoped-create',
      ],
      cache: {
        lifetime: 600,
        dependants: ['event'],
      },
    },
    event: {
      url: '/events',
      actions: ['read', 'update', 'delete'],
      cache: {
        lifetime: 600,
        dependants: [],
      },
    },
  },
};

let adapterMock;
let builder;
let store;

beforeEach(() => {
  registerAssertions();

  adapterMock = sinon.fake.resolves([1, 2]);
  builder = buildApi({ ...CONFIG, requestAdapter: adapterMock });
  store = createStore(state => state || {}, {}, applyMiddleware(thunkMiddleware));
});

it('properly generates action names', () => {
  const { actions } = builder;

  expect(actions.login).to.be.instanceof(Function);
  expect(actions.logout).to.be.instanceof(Function);
  expect(actions.readSettings).to.be.instanceof(Function);
  expect(actions.updateSettings).to.be.instanceof(Function);
  expect(actions.readCalendarList).to.be.instanceof(Function);
  expect(actions.createCalendar).to.be.instanceof(Function);
  expect(actions.readCalendar).to.be.instanceof(Function);
  expect(actions.updateCalendar).to.be.instanceof(Function);
  expect(actions.deleteCalendar).to.be.instanceof(Function);
  expect(actions.readCalendarEventList).to.be.instanceof(Function);
  expect(actions.createCalendarEvent).to.be.instanceof(Function);
  expect(actions.readEvent).to.be.instanceof(Function);
  expect(actions.updateEvent).to.be.instanceof(Function);
  expect(actions.deleteEvent).to.be.instanceof(Function);
  expect(actions.cancelReadSettings).to.be.instanceof(Function);
  expect(actions.cancelReadCalendarList).to.be.instanceof(Function);
  expect(actions.cancelReadCalendar).to.be.instanceof(Function);
  expect(actions.cancelReadCalendarEventList).to.be.instanceof(Function);
  expect(actions.cancelReadEvent).to.be.instanceof(Function);
  expect(actions.clearSettingsCache).to.be.instanceof(Function);
  expect(actions.clearCalendarCache).to.be.instanceof(Function);
  expect(actions.clearCalendarEventCache).to.be.instanceof(Function);
  expect(actions.clearEventCache).to.be.instanceof(Function);
  expect(actions.clearCache).to.be.instanceof(Function);
});

registerMiddlewares([thunkMiddleware]);
registerInitialStoreState({});

describe('list operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.readCalendarList()).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/calendars`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'get',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: null,
      });

      done();
    });
  });

  it('dispatches start and end actions with correct parameters', done => {
    expect(builder.actions.readCalendarList()).to.dispatch.actions(
      [{ type: 'READ_CALENDAR_LIST_START' }, { type: 'READ_CALENDAR_LIST_END' }],
      done,
    );
  });
});

describe('read operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.readCalendar(134)).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/calendars/134`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'get',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: null,
      });
      done();
    });
  });

  it('dispatches start and end actions', done => {
    expect(builder.actions.readCalendar(134)).to.dispatch.actions(
      [{ type: 'READ_CALENDAR_START' }, { type: 'READ_CALENDAR_END' }],
      done,
    );
  });
});

describe('create operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.createCalendar({ name: 'New calendar' })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/calendars`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'post',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({ name: 'New calendar' }),
      });

      done();
    });
  });

  it('dispatches start and end actions', done => {
    expect(builder.actions.createCalendar({ name: 'New calendar' })).to.dispatch.actions(
      [{ type: 'CREATE_CALENDAR_START' }, { type: 'CREATE_CALENDAR_END' }],
      done,
    );
  });
});

describe('update operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.updateCalendar(123, { name: 'Updated' })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/calendars/123`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'put',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({ name: 'Updated' }),
      });
      done();
    });
  });

  it('dispatches start and end actions', done => {
    expect(builder.actions.updateCalendar(123, { name: 'Updated calendar' })).to.dispatch.actions(
      [{ type: 'UPDATE_CALENDAR_START' }, { type: 'UPDATE_CALENDAR_END' }],
      done,
    );
  });
});

describe('delete operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.deleteCalendar(123, { all: true })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/calendars/123`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'delete',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({ all: true }),
      });
      done();
    });
  });

  it('dispatches start and end actions', done => {
    expect(builder.actions.deleteCalendar(123)).to.dispatch.actions(
      [{ type: 'DELETE_CALENDAR_START' }, { type: 'DELETE_CALENDAR_END' }],
      done,
    );
  });
});

describe('single-create operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.login({ login: 'a', password: 'b' })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/auth`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'post',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          login: 'a',
          password: 'b',
        }),
      });
      done();
    });
  });
});

describe('single-delete operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.logout({ source: 'other' })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/auth`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'delete',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          source: 'other',
        }),
      });
      done();
    });
  });
});

describe('single-read operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.readSettings()).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/settings`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'get',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: null,
      });
      done();
    });
  });
});

describe('single-update operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.updateSettings({ limit: 10 })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/settings`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'put',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({ limit: 10 }),
      });
      done();
    });
  });
});

describe('scoped-list operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.readCalendarEventList(12, { limit: 10 })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/calendars/12/events?limit=10`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'get',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: null,
      });
      done();
    });
  });
});

describe('scoped-create operation', () => {
  it('calls adapter with correct arguments', done => {
    store.dispatch(builder.actions.createCalendarEvent(12, { title: 'Meeting' })).finally(() => {
      expect(adapterMock.callCount).to.equal(1);

      const mockCall = adapterMock.getCall(0);
      expect(mockCall.args[0]).to.equal(`${CONFIG.rootUrl}/calendars/12/events`);
      expect(mockCall.args[1]).to.deep.equal({
        method: 'post',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          title: 'Meeting',
        }),
      });
      done();
    });
  });
});

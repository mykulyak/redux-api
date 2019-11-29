import * as listTemplate from './list';
import * as readTemplate from './read';
import * as createTemplate from './create';
import * as updateTemplate from './update';
import * as deleteTemplate from './delete';
import * as singleCreateTemplate from './singleCreate';
import * as singleReadTemplate from './singleRead';
import * as singleUpdateTemplate from './singleUpdate';
import * as singleDeleteTemplate from './singleDelete';
import * as scopedListTemplate from './scopedList';
import * as scopedCreateTemplate from './scopedCreate';

const registeredOperations = {
  list: listTemplate,
  read: readTemplate,
  create: createTemplate,
  update: updateTemplate,
  delete: deleteTemplate,
  'single-create': singleCreateTemplate,
  'single-read': singleReadTemplate,
  'single-update': singleUpdateTemplate,
  'single-delete': singleDeleteTemplate,
  'scoped-list': scopedListTemplate,
  'scoped-create': scopedCreateTemplate,
};

// eslint-disable-next-line import/prefer-default-export
export function getOperationConfig(operKey) {
  let operConfig = null;
  if (typeof operKey === 'string') {
    operConfig = registeredOperations[operKey];
  } else {
    const { extends: baseOper, ...rest } = operKey;
    operConfig = { ...registeredOperations[baseOper], ...rest };
  }
  return operConfig;
}

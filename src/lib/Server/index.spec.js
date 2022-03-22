/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

const Server = require('.');

test('Should config the tag modules', () => {
  const options = {};
  Server(options);

  const context = { $mongo: { $db: { collection: () => ({ findOne: () => Promise.resolve({ tags: [] }) }) } } };
  options.modules.tags.fetch.exec(context, { domainId: 'test' });

  expect(options.modules.tags).not.toBeNull();
  expect(options.modules.tags.fetch).not.toBeNull();
  expect(options.modules.tags.save).not.toBeNull();
});

test('Should config the tag modules without developer tags', async () => {
  const options = {};
  Server(options);

  const context = { $mongo: { $db: { collection: () => ({ findOne: () => Promise.resolve({ tags: [] }) }) } } };
  const tags = await options.modules.tags.fetch.exec(context, { domainId: 'test' });

  expect(tags.length).toEqual(0);
});

test('Should config the tag modules with developer tags', async () => {
  const configuredTags = [{ id: 'testTag', slug: '/testTag', values: [{ id: 'testValue', slug: '/testValue' }] }];
  const options = {};
  Server(options, configuredTags);

  const context = { $mongo: { $db: { collection: () => ({ findOne: () => Promise.resolve({ tags: [] }) }) } } };
  const tags = await options.modules.tags.fetch.exec(context, { domainId: 'test' });

  expect(tags.length).toEqual(1);
  expect(tags[0].id).toBe('testTag');
  expect(tags[0].slug).toBe('/testTag');
  expect(tags[0].values[0].id).toBe('testValue');
  expect(tags[0].values[0].slug).toBe('/testValue');
});

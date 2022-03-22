/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

const Server = require('.');

test('Should return no tags if none configured and no developer tags are defined', async () => {
  const options = {};
  Server(options);

  const context = { $mongo: { $db: { collection: () => ({ findOne: () => Promise.resolve({ tags: [] }) }) } } };
  const tags = await options.modules.tags.fetch.exec(context, { domainId: 'test' });

  expect(tags.length).toEqual(0);
});

test('Should return developer tags with configured tags', async () => {
  const developerTags = [{ id: 'testTag', slug: '/testTag', values: [{ id: 'testValue', slug: '/testValue' }] }];
  const savedTags = [{ id: 'savedTag', slug: '/savedTag', values: [{ id: 'savedValue', slug: '/savedValue' }] }];
  const options = {};
  Server(options, developerTags);

  const context = { $mongo: { $db: { collection: () => ({ findOne: () => Promise.resolve({ tags: savedTags }) }) } } };
  const tags = await options.modules.tags.fetch.exec(context, { domainId: 'test' });

  expect(tags.length).toEqual(2);

  expect(tags[0].id).toBe('testTag');
  expect(tags[0].slug).toBe('/testTag');
  expect(tags[0].isDev).toBe(true);
  expect(tags[0].values[0].id).toBe('testValue');
  expect(tags[0].values[0].slug).toBe('/testValue');

  expect(tags[1].id).toBe('savedTag');
  expect(tags[1].slug).toBe('/savedTag');
  expect(tags[1].values[0].id).toBe('savedValue');
  expect(tags[1].values[0].slug).toBe('/savedValue');
});

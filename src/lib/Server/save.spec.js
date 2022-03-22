const Server = require('.');

const developerTags = [{ id: 'testTag', slug: '/testTag', values: [{ id: 'testValue', slug: '/testValue' }] }];
const savedTags = [{ id: 'savedTag', slug: '/savedTag', values: [{ id: 'savedValue', slug: '/savedValue' }] }];

test('Should save configured tags excluding developer tags', async () => {
  const options = {};
  Server(options, developerTags);

  const mockUpdate = jest.fn(() => ({}));
  const mockCollection = jest.fn(() => ({ updateOne: mockUpdate }));

  const context = {
    $mongo: {
      $db: { collection: mockCollection },
    },
  };
  await options.modules.tags.save.exec(context, { domainId: 'test', tags: [...developerTags, ...savedTags] });

  const updateArgs = mockUpdate.mock.calls[0];
  const [filter, { tags }, updateOptions] = updateArgs;
  expect(filter._id).toBe('tags_test');
  expect(updateOptions.upsert).toBe(true);
  expectTag(tags[0], savedTags[0]);
});

const expectTag = (actualTag, expectedTag) => {
  expect(actualTag.id).toBe(expectedTag.id);
  expect(actualTag.slug).toBe(expectedTag.slug);
  actualTag.values.forEach((tag, index) => expectValue(tag, expectedTag.values[index]));
};

const expectValue = (actualValue, excpectedTagValue) => {
  expect(actualValue.id).toBe(excpectedTagValue.id);
};

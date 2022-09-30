import keyBy from 'lodash/keyBy';
// eslint-disable-next-line no-undef
module.exports = () => ({
  exec({ $mongo: { $db } }, { domainId, tagFilters }) {
    const query = {};
    if (domainId && domainId !== 'undefined') query.domainId = domainId;

    if (tagFilters && !tagFilters.selected.length) {
      if (tagFilters.include.length) query.tags = { $in: tagFilters.include };

      if (tagFilters.exclude.length) query.tags = { ...(query.tags || {}), $nin: tagFilters.exclude };
    }

    if (tagFilters && tagFilters.selected.length) {
      query._id = { $in: tagFilters.selected };
    }
    let promise = $db.collection('pages').find(query);

    if (!tagFilters.ignoreLimit) promise.limit(Number(tagFilters.limit) || 8);

    if (!tagFilters.ignoreSort) promise = sortLookup(promise, tagFilters.sort);

    return promise.toArray().then((items) => {
      if (!tagFilters.ignoreSort) return items;

      const _keyedItems = keyBy(items, '_id');
      return tagFilters.selected.map((s) => {
        return _keyedItems[s];
      });
    });
  },
});

const sortLookup = (promise, key = 'name (a-z)') => {
  switch (key.sortType) {
    case 'string':
      return promise.collation({ locale: 'en' }).sort(key.fields);

    default:
      return promise.sort(key.fields);
  }
};

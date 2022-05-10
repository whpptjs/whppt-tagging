// eslint-disable-next-line no-undef
module.exports = () => ({
  exec({ $mongo: { $db } }, { domainId, tagFilters, headerFilter, pageIndex = 0, size = 20 }) {
    const query = {
      'header.heading': { $exists: true, $ne: '' },
    };
    if (domainId && domainId !== 'undefined') query.domainId = domainId;

    if (tagFilters) {
      if (tagFilters.include.length) query.tags = { ...(query.tags || {}), $all: tagFilters.include };

      if (tagFilters.exclude.length) query.tags = { ...(query.tags || {}), $nin: tagFilters.exclude };
    }

    if (headerFilter) {
      query['header.heading'].$regex = headerFilter;
      query['header.heading'].$options = 'i';
    }
    // TODO: Look at all page type collections
    return $db
      .collection('pages')
      .find(query)
      .sort({ 'header.heading': 1 })
      .skip(pageIndex * size)
      .limit(size)
      .toArray();
  },
});

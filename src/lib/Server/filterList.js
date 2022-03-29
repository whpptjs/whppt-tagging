// eslint-disable-next-line no-undef
module.exports = () => ({
  exec({ $mongo: { $db } }, { domainId, tagFilters, pageIndex = 0, size = 20 }) {
    console.log('🚀 ~ FilterList ~ domainId', domainId);
    console.log('🚀 ~ FilterList ~ tagFilter', tagFilters);

    const query = {};
    if (domainId && domainId !== 'undefined') query.domainId = domainId;

    if (tagFilters) {
      if (tagFilters.include.length) query.tags = { ...(query.tags || {}), $all: tagFilters.include };

      if (tagFilters.exclude.length) query.tags = { ...(query.tags || {}), $nin: tagFilters.exclude };
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

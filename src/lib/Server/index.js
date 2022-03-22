/* eslint-disable functional/immutable-data */

const Fetch = require('./fetch');
const Save = require('./save');

module.exports = (options, developerTags) => {
  options.modules = options.modules || {};
  options.modules.tags = { fetch: Fetch(developerTags || []), save: Save(developerTags || []) };
  return options;
};

/* eslint-disable no-undef */

const Fetch = require('./fetch');
const FilterList = require('./filterList');
const FilterListSelected = require('./filterListSelected');
const Save = require('./save');

module.exports = (options, developerTags) => {
  options.modules = options.modules || {};
  options.modules.tags = {
    fetch: Fetch(developerTags || []),
    save: Save(developerTags || []),
    filterList: FilterList(),
    filterListSelected: FilterListSelected(),
  };
  return options;
};

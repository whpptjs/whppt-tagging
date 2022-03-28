module.exports = (developerTags) => ({
  exec({ $mongo: { $db } }, { domainId }) {
    return $db
      .collection('site')
      .findOne({ _id: `tags_${domainId}` })
      .then((settings) => {
        if (!settings) return combineTags(developerTags, []);
        return combineTags(developerTags, settings.tags);
      });
  },
});

const combineTags = (developerTags, customTags) => {
  return [...developerTags.map((t) => ({ ...t, isDev: true })), ...customTags];
};

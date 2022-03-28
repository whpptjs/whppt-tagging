module.exports = (developerTags) => ({
  exec({ $mongo: { $db } }, { domainId, tags }) {
    const developerTagIds = developerTags.map((t) => t.id);
    const customTags = tags.filter((t) => !developerTagIds.includes(t.id));
    return $db
      .collection('site')
      .updateOne({ _id: `tags_${domainId}` }, { $set: { tags: customTags } }, { upsert: true });
  },
});

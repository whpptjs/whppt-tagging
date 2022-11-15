module.exports = (developerTags) => ({
  exec({ $mongo: { $db, $dbPub, $startTransaction } }, { domainId, tags }) {
    const developerTagIds = developerTags.map((t) => t.id);
    const customTags = tags.filter((t) => !developerTagIds.includes(t.id));
    return $startTransaction((session) => {
      return $db
        .collection('site')
        .updateOne({ _id: `tags_${domainId}` }, { $set: { tags: customTags } }, { session, upsert: true })
        .then(() => {
          return $dbPub
            .collection('site')
            .updateOne({ _id: `tags_${domainId}` }, { $set: { tags: customTags } }, { session, upsert: true });
        });
    });
  },
});

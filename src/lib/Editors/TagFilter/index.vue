<template>
  <div>
    <div class="my-2">
      <h3 class="text-white">Filter Component By</h3>
    </div>
    <included-tags :tags="tags" class="mb-5"></included-tags>
    <excluded-tags :tags="tags" class="mb-5"></excluded-tags>
    <selections></selections>
  </div>
</template>

<script>
import { flatMap, map } from 'lodash';
import { mapState } from 'vuex';
import IncludedTags from './Include';
import ExcludedTags from './Exclude';
import Selections from './Selections';

export default {
  name: 'TagFilter',
  components: {
    IncludedTags,
    ExcludedTags,
    Selections,
  },
  computed: {
    ...mapState('whppt/config', ['domain']),
  },
  data() {
    return {
      tags: [],
      loading: false,
    };
  },
  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loading = true;
      return this.$axios.$get(`/api/tags/fetch?domainId=${this.domain._id}`).then((categories) => {
        this.tags = flatMap(categories, (c) => {
          return map(c.values, (v) => ({ id: `${c.id}:${v.id}`, name: `${c.id} - ${v.id}` }));
        });
        console.log('🚀 ~ file: index.vue ~ line 43 ~ this.tags=flatMap ~ this.tags', this.tags);
        this.loading = false;
      });
    },
  },
};
</script>

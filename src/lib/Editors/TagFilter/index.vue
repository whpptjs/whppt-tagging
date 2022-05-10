<template>
  <div>
    <div class="my-2 whppt-tagging-editor">
      <h4 class="text-white">Filter Component By</h4>
    </div>
    <included-tags :tags="tags" class="mb-5" @changed="$refs.selections.debouncedLoadItems()"></included-tags>
    <excluded-tags :tags="tags" class="mb-5" @changed="$refs.selections.debouncedLoadItems()"></excluded-tags>
    <!-- <dates class="mb-5"></dates> -->
    <selections ref="selections"></selections>
  </div>
</template>

<script>
import { flatMap, map } from 'lodash';
import { mapState } from 'vuex';

import Dates from './Dates.vue';
import ExcludedTags from './Exclude.vue';
import IncludedTags from './Include.vue';
import Selections from './Selections.vue';

export default {
  name: 'TagFilter',
  components: {
    IncludedTags,
    ExcludedTags,
    Dates,
    Selections,
  },
  data() {
    return {
      tags: [],
      loading: false,
    };
  },
  computed: {
    ...mapState('whppt/config', ['domain']),
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
        this.loading = false;
      });
    },
  },
};
</script>

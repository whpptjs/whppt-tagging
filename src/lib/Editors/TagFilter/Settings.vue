<template>
  <div>
    <div class="my-4">
      <whppt-checkbox
        :value="selectedContentValue.ignoreLimit"
        :label="'Show all items'"
        class="mb-3"
        @change="check()"
      />
      <whppt-input
        v-if="!selectedContentValue.ignoreLimit"
        id="SelectionsLimitNumber"
        :value="selectedContentValue.limit"
        label="No of items to show?"
        type="number"
        placeholder="Default is 8"
        @change="setLimit"
      ></whppt-input>
    </div>

    <div class="my-4">
      <whppt-checkbox
        :value="selectedContentValue.ignoreSort"
        :label="'Manual Sort'"
        class="mb-3"
        @change="checkSortManual()"
      />
      <whppt-select
        v-if="!selectedContentValue.ignoreSort"
        :value="selectedContentValue.sort"
        label="Sort By"
        :items="getSortByItems"
        @change="setSort"
      />
    </div>
  </div>
</template>

<script>
import WhpptCheckbox from '@whppt/nuxt/lib/components/ui/components/Checkbox.vue';
import WhpptInput from '@whppt/nuxt/lib/components/ui/components/Input.vue';
import WhpptSelect from '@whppt/nuxt/lib/components/ui/components/Select.vue';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'TagFilter',
  components: {
    WhpptCheckbox,
    WhpptInput,
    WhpptSelect,
  },
  data() {
    return {
      sortByItems: [
        {
          text: 'Publish Date (earliest)',
          sortType: 'date',
          fields: {
            publishDate: 1,
          },
        },
        {
          text: 'Publish Date (latest)',
          sortType: 'date',
          fields: {
            publishDate: -1,
          },
        },
      ],
    };
  },
  computed: {
    ...mapState('whppt/editor', ['selectedComponent']),
    selectedContentValue() {
      return this.selectedComponent.value;
    },
    getSortByItems() {
      const sort =
        this.selectedComponent.options && this.selectedComponent.options.sortBy
          ? this.selectedComponent.options.sortBy
          : this.sortByItems;

      return sort.map((s) => {
        return {
          text: s.text,
          value: s,
        };
      });
    },
  },

  methods: {
    ...mapActions('whppt/editor', ['setSelectedComponentState']),
    setSort(sort) {
      this.setSelectedComponentState({ value: sort, path: 'sort' });
    },
    setLimit(amount) {
      this.setSelectedComponentState({ value: amount, path: 'limit' });
    },
    check() {
      if (!this.selectedContentValue.ignoreLimit) this.setSelectedComponentState({ value: undefined, path: 'limit' });
      this.setSelectedComponentState({ value: !this.selectedContentValue.ignoreLimit, path: 'ignoreLimit' });
    },
    checkSortManual() {
      this.setSelectedComponentState({ value: !this.selectedContentValue.ignoreSort, path: 'ignoreSort' });
    },
  },
};
</script>

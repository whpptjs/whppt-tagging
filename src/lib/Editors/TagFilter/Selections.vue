<template>
  <div>
    <div class="my-2">
      <h4 class="text-white">Selections</h4>
      <div class="my-4">
        <label for="SelectionsFilter">Filter Selections</label>
        <whppt-input id="SelectionsFilter" v-model="filterValue"></whppt-input>
      </div>
      <div v-for="(item, index) in filteredItems" :key="`${item.name}_selected_${index}`">
        <div v-if="isSelected(item)" class="flex items-center w-full mb-2">
          <whppt-checkbox :value="isSelected(item)" :label="item.name || 'Checkbox Label'" @change="check(item)" />
        </div>
      </div>
      <div v-for="(item, index) in filteredItems" :key="`${item.name}_${index}`">
        <div v-if="!isSelected(item)" class="flex items-center w-full mb-2">
          <whppt-checkbox :value="isSelected(item)" :label="item.name || 'Checkbox Label'" @change="check(item)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WhpptCheckbox from '@whppt/nuxt/lib/components/ui/components/Checkbox';
import WhpptInput from '@whppt/nuxt/lib/components/ui/components/Input';
import { debounce, filter, find, sortBy, toLower, without } from 'lodash';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'TagFilterSelections',
  components: { WhpptCheckbox, WhpptInput },
  data() {
    return {
      loading: false,
      filterValue: '',
      items: [],
    };
  },
  computed: {
    ...mapState('whppt/config', ['domain']),
    ...mapState('whppt/editor', ['selectedComponent']),
    selectedContentValue() {
      console.log(
        '🚀 ~ file: Selections.vue ~ line 38 ~ selectedContentValue ~ this.selectedComponent.value',
        this.selectedComponent.value
      );
      return this.selectedComponent.value || {};
    },
    filteredItems() {
      const filteredItems = filter(this.items, (i) => toLower(i.name).includes(toLower(this.filterValue)));
      return sortBy(filteredItems, 'name');
    },
  },
  created() {
    this.debouncedLoadItems = debounce(this.loadItems, 500);
  },
  mounted() {
    this.filterTags();
    this.debouncedLoadItems();
  },
  methods: {
    ...mapActions('whppt/editor', ['pushSelectedComponentState', 'setSelectedComponentState']),

    loadItems() {
      this.loading = true;
      return this.$axios
        .$post(`/api/teamMembers/list`, {
          domainId: this.domain._id,
          tagFilters: this.selectedContentValue,
        })
        .then((items) => {
          this.items = items;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    filterTags() {},
    isSelected(value) {
      return find(this.selectedContentValue && this.selectedContentValue.selected, (s) => s === value._id);
    },
    check(value) {
      if (find(this.selectedContentValue && this.selectedContentValue.selected, (p) => p === value._id)) {
        const removed = without(this.selectedContentValue && this.selectedComponent.value['selected'], value._id);
        this.setSelectedComponentState({ value: removed, path: 'selected' });
        return;
      }
      this.pushSelectedComponentState({
        path: 'selected',
        value: value._id,
      });
    },
    watch: {
      selectedContentValue: function () {
        console.log('Watch value');
        this.debouncedLoadItems();
      },
    },
  },
};
</script>

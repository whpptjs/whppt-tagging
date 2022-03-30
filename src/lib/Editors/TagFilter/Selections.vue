<template>
  <div>
    <div class="my-2">
      <h4 class="text-white">Selections</h4>
      <div class="my-4">
        <label for="SelectionsFilter">Filter Selections</label>
        <whppt-input id="SelectionsFilter" v-model="filterValue"></whppt-input>
      </div>
      <div class="flex flex-col space-y-3">
        <div>Selected Pages ({{ selectedItems.length }}):</div>
        <div v-if="selectedItems.length" class="flex flex-col space-y-3">
          <div v-for="item in selectedItems" :key="`${item._id}`">
            <whppt-checkbox
              :value="true"
              :label="(item.header && item.header.heading) || 'Missing Header'"
              @change="check(item)"
            />
          </div>
        </div>
        <div v-if="!selectedItems.length" class="text-sm pl-6">No items selected</div>
        <div>Filtered Pages:</div>
        <div v-for="item in unSelectedItems" :key="`${item._id}`">
          <whppt-checkbox
            :value="false"
            :label="(item.header && item.header.heading) || 'Missing Header'"
            @change="check(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WhpptCheckbox from '@whppt/nuxt/lib/components/ui/components/Checkbox.vue';
import WhpptInput from '@whppt/nuxt/lib/components/ui/components/Input.vue';
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
    selectedItems() {
      return this.filteredItems.filter((i) => this.isSelected(i));
    },
    unSelectedItems() {
      return this.filteredItems.filter((i) => !this.isSelected(i));
    },
    filteredItems() {
      const filteredItems = filter(this.items, (i) => toLower(i.name).includes(toLower(this.filterValue)));
      return sortBy(filteredItems, 'header.heading');
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
        .$post(`/api/tags/filterList`, {
          domainId: this.domain._id,
          tagFilters: this.selectedComponent.value,
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
      return find(this.selectedComponent.value && this.selectedComponent.value.selected, (s) => s === value._id);
    },
    check(value) {
      if (find(this.selectedComponent.value && this.selectedComponent.value.selected, (p) => p === value._id)) {
        const removed = without(this.selectedComponent.value && this.selectedComponent.value['selected'], value._id);
        this.setSelectedComponentState({ value: removed, path: 'selected' });
        return;
      }
      this.pushSelectedComponentState({
        path: 'selected',
        value: value._id,
      });
    },
  },
};
</script>

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
import { mapState, mapActions } from 'vuex';
import { find, without, filter, toLower, sortBy } from 'lodash';
import WhpptCheckbox from '@whppt/nuxt/lib/components/ui/components/Checkbox';
import WhpptInput from '@whppt/nuxt/lib/components/ui/components/Input';

export default {
  name: 'TagFilterSelections',
  components: { WhpptCheckbox, WhpptInput },
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

  data() {
    return {
      loading: false,
      filterValue: '',
      items: [
        { _id: 'test', name: 'Test 1' },
        { _id: 'test2', name: 'Test 1qe' },
        { _id: 'test3', name: 'Test eqwed1' },
        { _id: 'test4', name: 'Test dd1' },
        { _id: 'test5', name: 'Test 1' },
        { _id: 'test6', name: 'Testcc 1' },
        { _id: 'test7', name: 'Test zzzzz1' },
      ],
    };
  },
  mounted() {
    this.filterTags();
  },
  methods: {
    ...mapActions('whppt/editor', ['pushSelectedComponentState', 'setSelectedComponentState']),

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
  },
};
</script>

<template>
  <div>
    <div class="my-2">
      <h3 class="text-white">Selections</h3>
      <whppt-input id="SelectionsFilter" v-model="filterValue"></whppt-input>
      <div v-for="item in items" :key="item" class="flex items-center w-full">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TagFilterSelections',

  computed: {
    ...mapState('whppt/config', ['domain']),
  },
  data() {
    return {
      loading: false,
      filterValue: '',
      items: [{ _id: 'test', name: 'Test 1' }],
    };
  },
  mounted() {
    this.filterTags();
  },
  methods: {
    filterTags() {},
  },
};
</script>

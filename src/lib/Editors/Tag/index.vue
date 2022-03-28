<template>
  <div>
    <h3 class="text-white">Page Tags</h3>
    <div class="mb-5">
      <whppt-autocomplete :value="value" :items="tags" itemText="id" itemValue="id" label="Tags" @select="selectTag" />
    </div>
    <div>
      <whppt-table
        :items="selectedContentValue"
        :headers="headers"
        :page="1"
        :per-page="20"
        :total="selectedContentValue.length"
      >
        <template v-slot:item.id="{ item }">
          {{ item }}
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="flex items-center justify-end">
            <whppt-button v-if="!item.published" flat @click="removeItem(item)">
              <trash />
            </whppt-button>
          </div>
        </template>
      </whppt-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { flatMap, map, without } from 'lodash';
import WhpptAutocomplete from '@whppt/nuxt/lib/components/ui/components/Autocomplete.vue';
import WhpptTable from '@whppt/nuxt/lib/components/ui/components/Table.vue';
import WhpptButton from '@whppt/nuxt/lib/components/ui/components/Button.vue';

import Trash from '@whppt/nuxt/lib/components/icons/Trash';

export default {
  name: 'Tag',
  components: {
    WhpptAutocomplete,
    WhpptTable,
    Trash,
    WhpptButton,
  },
  data() {
    return {
      categories: [],
      loading: false,
      value: '',
      headers: [
        { text: 'Name', align: 'start', value: 'id' },
        { text: 'Actions', align: 'start', value: 'actions' },
      ],
    };
  },
  computed: {
    ...mapState('whppt/config', ['domain']),
    ...mapState('whppt/editor', ['selectedComponent']),
    selectedContentValue() {
      return this.selectedComponent.value[this.selectedComponent.property];
    },
    tags() {
      return flatMap(this.categories, (c) => {
        return map(c.values, (v) => ({ id: `${c.id}:${v.id}`, name: `${c.id} - ${v.id}` }));
      });
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    ...mapActions('whppt/editor', ['pushSelectedComponentState', 'setSelectedComponentState']),
    removeItem(item) {
      console.log('🚀 ~ file: index.vue ~ line 76 ~ removeItem ~ item', item);
      if (window.confirm('Are you sure?')) {
        const removed = without(this.selectedComponent.value[this.selectedComponent.property], item);
        console.log('🚀 ~ file: index.vue ~ line 78 ~ removeItem ~ removed', removed);

        this.setSelectedComponentState({ value: removed, path: this.selectedComponent.property });
      }
    },
    selectTag(value) {
      console.log(
        '🚀 ~ file: index.vue ~ line 54 ~ selectTag ~ this.selectedComponent.property',
        this.selectedComponent.property
      );
      this.pushSelectedComponentState({
        path: this.selectedComponent.property,
        value: value.id,
      });
    },
    load() {
      this.loading = true;
      return this.$axios.$get(`/api/tags/fetch?domainId=${this.domain._id}`).then((categories) => {
        console.log('🚀 ~ file: index.vue ~ line 49 ~ returnthis.$axios.$get ~ categories', categories);
        this.categories = categories;
        this.loading = false;
      });
    },
  },
};
</script>

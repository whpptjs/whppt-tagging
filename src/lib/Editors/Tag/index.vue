<template>
  <div>
    <h3 class="text-white">Page Tags</h3>
    <div class="mb-5">
      <whppt-autocomplete
        :value="value"
        :items="tags"
        item-text="id"
        item-value="id"
        label="Tags"
        @select="selectTag"
      />
    </div>
    <div>
      <whppt-table
        :items="selectedContentValue"
        :headers="headers"
        :page="1"
        :per-page="20"
        :total="selectedContentValue.length"
      >
        <template #item.id="{ item }">
          {{ item }}
        </template>
        <template #item.actions="{ item }">
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
import Trash from '@whppt/nuxt/lib/components/icons/Trash.vue';
import WhpptAutocomplete from '@whppt/nuxt/lib/components/ui/components/Autocomplete.vue';
import WhpptButton from '@whppt/nuxt/lib/components/ui/components/Button.vue';
import WhpptTable from '@whppt/nuxt/lib/components/ui/components/Table.vue';
import { flatMap, map, without } from 'lodash';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'TagEditor',
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
      if (window.confirm('Are you sure?')) {
        const removed = without(this.selectedComponent.value[this.selectedComponent.property], item);

        this.setSelectedComponentState({ value: removed, path: this.selectedComponent.property });
      }
    },
    selectTag(value) {
      this.pushSelectedComponentState({
        path: this.selectedComponent.property,
        value: value.id,
      });
    },
    load() {
      this.loading = true;
      return this.$axios.$get(`/api/tags/fetch?domainId=${this.domain._id}`).then((categories) => {
        this.categories = categories;
        this.loading = false;
      });
    },
  },
};
</script>

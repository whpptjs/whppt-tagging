<template>
  <div>
    <h4 class="text-white">Tags to include</h4>
    <div class="mb-5">
      <whppt-autocomplete
        :value="includeValue"
        :items="tags"
        itemText="id"
        itemValue="id"
        label="Select Tags to include"
        @select="addTag($event, 'include')"
      />
    </div>
    <div>
      <div>Current Included Tags:</div>
      <div class="flex flex-wrap items-center">
        <div
          v-for="includedTag in selectedContentValue.include"
          :key="includedTag"
          class="bg-white rounded-full text-black px-4 flex items-center mr-2 mb-2"
        >
          <p class="mr-2">
            {{ includedTag }}
          </p>
          <button @click="removeTag(includedTag, 'include')"><close /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { without, find } from 'lodash';
import { mapState, mapActions } from 'vuex';

import WhpptAutocomplete from '@whppt/nuxt/lib/components/ui/components/Autocomplete.vue';
import Close from '@whppt/nuxt/lib/components/icons/Close.vue';
export default {
  name: 'TagFilter',
  components: {
    WhpptAutocomplete,
    Close,
  },
  props: {
    tags: { type: Array, default: () => [] },
  },
  computed: {
    ...mapState('whppt/config', ['domain']),
    ...mapState('whppt/editor', ['selectedComponent']),
    selectedContentValue() {
      return this.selectedComponent.value;
    },
  },
  data() {
    return {
      includeValue: '',
    };
  },

  methods: {
    ...mapActions('whppt/editor', ['pushSelectedComponentState', 'setSelectedComponentState']),
    removeTag(tag, path) {
      if (window.confirm('Are you sure?')) {
        const removed = without(this.selectedComponent.value[path], tag);
        this.setSelectedComponentState({ value: removed, path });
      }
    },
    addTag(value, path) {
      if (find(this.selectedContentValue[path], (p) => p === value.id)) return;
      this.pushSelectedComponentState({
        path: path,
        value: value.id,
      });
    },
  },
};
</script>

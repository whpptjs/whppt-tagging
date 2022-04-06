<template>
  <div>
    <div class="mb-2">
      <whppt-autocomplete
        :value="includeValue"
        :items="tags"
        item-text="id"
        item-value="id"
        label="Select Tags to include"
        @select="addTag($event, 'include')"
      />
    </div>
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
        <button @click="removeTag(includedTag, 'include')"><close class="w-4" /></button>
      </div>
    </div>
  </div>
</template>

<script>
import Close from '@whppt/nuxt/lib/components/icons/Close.vue';
import WhpptAutocomplete from '@whppt/nuxt/lib/components/ui/components/Autocomplete.vue';
import { find, without } from 'lodash';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'TagFilter',
  components: {
    WhpptAutocomplete,
    Close,
  },
  props: {
    tags: { type: Array, default: () => [] },
  },
  data() {
    return {
      includeValue: '',
    };
  },
  computed: {
    ...mapState('whppt/config', ['domain']),
    ...mapState('whppt/editor', ['selectedComponent']),
    selectedContentValue() {
      return this.selectedComponent.value;
    },
  },

  methods: {
    ...mapActions('whppt/editor', ['pushSelectedComponentState', 'setSelectedComponentState']),
    removeTag(tag, path) {
      if (window.confirm('Are you sure?')) {
        const removed = without(this.selectedComponent.value[path], tag);
        this.setSelectedComponentState({ value: removed, path });
        this.$emit('changed');
      }
    },
    addTag(value, path) {
      if (find(this.selectedContentValue[path], (p) => p === value.id)) return;
      this.pushSelectedComponentState({
        path: path,
        value: value.id,
      });
      this.$emit('changed');
    },
  },
};
</script>

<template>
  <div>
    <div class="mb-2">
      <whppt-autocomplete
        :value="excludeValue"
        :items="tags"
        item-text="id"
        item-value="id"
        label="Select Tags to exclude"
        @select="addTag($event, 'exclude')"
      />
    </div>
    <div>
      <div>Current Excluded Tags:</div>
      <div class="flex flex-wrap items-center">
        <div
          v-for="excludedTag in selectedContentValue.exclude"
          :key="excludedTag"
          class="bg-white rounded-full text-black px-4 flex items-center mr-2 mb-2"
        >
          <p class="mr-2">
            {{ excludedTag }}
          </p>
          <button @click="removeTag(excludedTag, 'exclude')"><close /></button>
        </div>
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
      excludeValue: '',
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

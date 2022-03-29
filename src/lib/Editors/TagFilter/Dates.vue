<template>
  <div>
    <div class="my-2">
      <h4 class="text-white">Date Filter</h4>
      <div class="flex items-center justify-between">
        <div class="mr-2">
          <label class="editor-label">From</label>
          <whppt-datepicker
            id="timelineItemDatePickerFrom"
            :value="selectedContentValue.from"
            @input="selectDate($event, 'from')"
          />
        </div>
        <div class="ml-2">
          <label class="editor-label">To</label>
          <whppt-datepicker
            id="timelineItemDatePickerTo"
            :value="selectedContentValue.to"
            @input="selectDate($event, 'to')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WhpptDatepicker from '@whppt/nuxt/lib/components/ui/components/Datepicker.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'TagFilterSelections',
  components: { WhpptDatepicker },
  computed: {
    ...mapState('whppt/editor', ['selectedComponent']),

    selectedContentValue() {
      return this.selectedComponent.value;
    },
  },
  methods: {
    ...mapActions('whppt/editor', ['setSelectedComponentState']),

    selectDate(value, path) {
      this.setSelectedComponentState({
        path,
        value: value,
      });
    },
  },
};
</script>

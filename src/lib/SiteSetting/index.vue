<template>
  <div>
    <h3>Website Tags</h3>
    <div>
      <div class="flex flex-wrap">
        <whppt-tabs v-if="!loading" ref="editorTabs" :active-tab="tab" @changed="tabChanged">
          <div v-for="category in categories" :key="category.id" class="w-full">
            <whppt-tab :id="category.id" :name="category.id"> </whppt-tab>
          </div>
          <div v-if="!loading" class="w-full">
            <whppt-tab id="addNew" name="Add New"> </whppt-tab>
          </div>
        </whppt-tabs>
      </div>
      <div v-if="activeCategory" class="mt-5">
        <div class="flex mb-5 items-end">
          <div class="w-1/2 pr-2">
            <label for="chat-department">Category Name</label>
            <whppt-input id="item-name" v-model="activeCategory.id" class="w-full" disabled></whppt-input>
          </div>
          <div class="w-1/2 pl-2">
            <label for="chat-department">Category Slug</label>
            <whppt-input id="item-slug" v-model="activeCategory.slug" class="w-full"></whppt-input>
          </div>
          <div class="ml-5">
            <whppt-button @click="save">Save</whppt-button>
          </div>
        </div>
        <div class="flex mb-5 items-end">
          <div class="w-1/2 pr-2">
            <label for="chat-department">New Tag Name</label>
            <whppt-input id="item-name" v-model="newTag.id" class="w-full"></whppt-input>
          </div>
          <div class="w-1/2 pl-2">
            <label for="chat-department">New Tag Slug</label>
            <whppt-input id="item-slug" v-model="newTag.slug" class="w-full"></whppt-input>
          </div>
          <div class="ml-5">
            <whppt-button @click="addNewTag">Add New Tag</whppt-button>
          </div>
        </div>

        <whppt-table
          :items="activeCategory.values"
          :headers="headers"
          :page="1"
          :per-page="20"
          :total="activeCategory.values.length"
        >
          <template #item.slug="{ item }">
            <whppt-input id="new-item-slug" v-model="item.slug"></whppt-input>
          </template>
          <template #item.actions="{ item }">
            <div class="flex items-center justify-end">
              <whppt-button v-if="!item.published" flat class="mr-5" @click="save">
                <save />
              </whppt-button>
              <whppt-button v-if="!item.published" flat @click="removeValue(item.id)">
                <trash />
              </whppt-button>
            </div>
          </template>
        </whppt-table>
      </div>
      <div v-else>
        <div class="flex mb-5">
          <div class="w-1/2 pr-2">
            <label for="chat-department">Name</label>
            <whppt-input id="new-category-name" v-model="newItem.id" class="w-full"></whppt-input>
          </div>
          <div class="w-1/2 pl-2">
            <label for="chat-department">Slug</label>
            <whppt-input id="new-category-slug" v-model="newItem.slug" class="w-full"></whppt-input>
          </div>
        </div>
        <whppt-button @click="saveNew">Save</whppt-button>
      </div>
    </div>
  </div>
</template>

<script>
import Save from '@whppt/nuxt/lib/components/icons/Save';
import Trash from '@whppt/nuxt/lib/components/icons/Trash';
import WhpptButton from '@whppt/nuxt/lib/components/ui/components/Button.vue';
import WhpptInput from '@whppt/nuxt/lib/components/ui/components/Input.vue';
import WhpptTab from '@whppt/nuxt/lib/components/ui/components/Tab.vue';
import WhpptTable from '@whppt/nuxt/lib/components/ui/components/Table.vue';
import WhpptTabs from '@whppt/nuxt/lib/components/ui/components/Tabs.vue';
import { findIndex, remove } from 'lodash';
import { mapState } from 'vuex';
// import WhpptSelect from '@whppt/nuxt/lib/components/ui/components/Select.vue';
// import WhpptCard from '@whppt/nuxt/lib/components/ui/components/Card.vue';

export default {
  name: 'TagSettings',
  components: {
    WhpptTable,
    WhpptTabs,
    WhpptTab,
    WhpptInput,
    Trash,
    WhpptButton,
    Save,
  },
  data() {
    return {
      newTag: { id: '', slug: '' },
      newItem: { id: '', slug: '', values: [] },
      headers: [
        { text: 'Name', align: 'start', value: 'id' },
        { text: 'Slug', align: 'start', value: 'slug' },
        { text: 'Actions', align: 'start', value: 'actions' },
      ],
      showAddNewCatrgory: false,
      loading: false,
      tab: 0,
      categories: [],
    };
  },
  mounted() {
    this.load();
  },
  computed: {
    ...mapState('whppt/config', ['domain']),

    activeCategory() {
      return this.categories[this.tab];
    },
  },
  methods: {
    load() {
      this.loading = true;
      return this.$axios.$get(`/api/tags/fetch?domainId=${this.domain._id}`).then((categories) => {
        this.categories = categories;
        this.loading = false;
      });
    },
    setActiveTabIndex(tabId) {
      this.tab = findIndex(this.$refs.editorTabs.$children, { id: tabId }) || 0;
    },
    tabChanged(tab) {
      this.setActiveTabIndex(tab.id);
    },
    save() {
      return this.$axios
        .$post(`/api/tags/save`, {
          domainId: this.domain._id,
          tags: this.categories,
        })
        .then(() => {
          this.load();
        });
    },
    addNewTag() {
      this.activeCategory.values.push(this.newTag);
      return this.$axios
        .$post(`/api/tags/save`, {
          domainId: this.domain._id,
          tags: this.categories,
        })
        .then(() => {
          this.load().then(() => {
            this.newTag = { id: '', slug: '' };
          });
        });
    },
    saveNew() {
      this.categories.push(this.newItem);
      return this.$axios
        .$post(`/api/tags/save`, {
          domainId: this.domain._id,
          tags: this.categories,
        })
        .then(() => {
          this.load().then(() => {
            this.setActiveTabIndex(this.newItem.id);
            this.newItem = { id: '', slug: '', values: [] };
          });
        });
    },
    removeValue(id) {
      this.activeCategory.values = remove(this.activeCategory.values, (v) => v.id !== id);
      return this.$axios.$post(`/api/tags/save`, {
        domainId: this.domain._id,
        tags: this.categories,
      });
    },
  },
};
</script>

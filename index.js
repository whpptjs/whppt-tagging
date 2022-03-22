import Tag from './src/lib/Editors/Tag/index.vue';
import TagFilter from './src/lib/Editors/TagFilter/index.vue';
import Settings from './src/lib/SiteSetting/index.vue';

export default {
  name: 'Tags',
  siteSettings: {
    name: 'tags',
    label: 'Tags',
    component: Settings,
  },
  editors: [
    {
      name: 'tag',
      label: 'Tag',
      component: Tag,
    },
    {
      name: 'tagFilter',
      label: 'Tag Filter',
      component: TagFilter,
    },
  ],
};

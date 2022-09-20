import Tag from './src/lib/Editors/Tag/index.vue';
import TagFilter from './src/lib/Editors/TagFilter/index.vue';
import Settings from './src/lib/SiteSetting/index.vue';
import TagIcon from './src/lib/TagIcon.vue';

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
  menuItems: [
    {
      key: 'tag',
      label: 'Change Page Tags',
      icon: TagIcon,
      action: ({ clearSelectedContent, clearSelectedComponent, openInSideBar, selectComponent, getPage }) => {
        clearSelectedContent();
        clearSelectedComponent();
        selectComponent({
          value: { value: getPage(), property: 'tags' },
          el: document.getElementsByTagName('body')[0],
        });
        return openInSideBar('tag');
      },
      order: 410,
    },
  ],
};

import { mount } from '@vue/test-utils';
import ConnectedList from '../ConnectedList.vue';

describe('ConnectedList', () => {
  it('renders properly', () => {
    const wrapper = mount(ConnectedList, {
      props: {
        items: ['Item 1', 'Item 2', 'Item 3'],
      },
    });
    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('Item 2');
    expect(wrapper.text()).toContain('Item 3');
  });

  it('displays a message when no items are provided', () => {
    const wrapper = mount(ConnectedList, {
      props: {
        items: [],
      },
    });
    expect(wrapper.text()).toContain('No items available');
  });

  it('emits an event when an item is clicked', async () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const wrapper = mount(ConnectedList, {
      props: {
        items,
      },
    });
    const itemElements = wrapper.findAll('.item');
    await itemElements[0].trigger('click');
    expect(wrapper.emitted().itemClicked[0][0]).toBe(items[0]);
  });
});


describe('ConnectedList', () => {
  it('renders properly', () => {
    const listName = 'test';
    const wrapper = mount(ConnectedList, {
      props: {
        root: { name: listName },
        children: [],
        index: 0
      }
    })
    expect(wrapper.text()).toContain(`Routes from ${listName}`)
  })
})

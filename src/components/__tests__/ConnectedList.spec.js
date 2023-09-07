import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConnectedList from '../ConnectedList.vue';

const testProps = {
  root: {
    "id": 1,
    "name": "Paris",
    "data": { "country": "France" }
  },
  children: [
    {
      "id": 2,
      "name": "Berlin",
      "data": { "country": "Germany" }
    },
    {
      "id": 3,
      "name": "Rome",
      "data": { "country": "Italy" }
    },
  ],
  index: 1
}


describe('ConnectedList', () => {
  it('renders properly', () => {
    const wrapper = mount(ConnectedList, {
      props: testProps,
    });
    expect(wrapper.text()).toContain('Routes from Paris');
    expect(wrapper.text()).toContain('Berlin');
    expect(wrapper.text()).toContain('Rome');
  });

  it.skip('displays a message when no items are provided', () => {
    const wrapper = mount(ConnectedList, {
      props: {
        items: [],
      },
    });
    expect(wrapper.text()).toContain('No items available');
  });

  it('emits an event when an item is clicked', async () => {
    const wrapper = mount(ConnectedList, {
      props: testProps,
    });
    const itemElements = wrapper.findAll('li');
    await itemElements[0].trigger('click');
    expect(wrapper.emitted()['node-selected']).toBeTruthy();
    expect(wrapper.emitted()['node-selected'][0]).toEqual([2, 1]);
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

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
  it('renders properly with children', () => {
    const wrapper = mount(ConnectedList, {
      props: testProps, // Uses the existing testProps with children
    });
    expect(wrapper.text()).toContain('Routes from Paris'); // Checks for root name
    expect(wrapper.text()).toContain('Berlin'); // Checks for first child
    expect(wrapper.text()).toContain('Rome'); // Checks for second child
  });

  it('renders properly when children array is empty', () => {
    const listName = 'Test List';
    const wrapper = mount(ConnectedList, {
      props: {
        root: { name: listName },
        children: [], // Explicitly pass empty children array
        index: 0
      }
    });
    expect(wrapper.text()).toContain(`Routes from ${listName}`);
    // Verify that no <li> elements are rendered when children is empty
    expect(wrapper.findAll('li').length).toBe(0);
  });

  it('renders "[empty]" when root.name is not provided', () => {
    const wrapper = mount(ConnectedList, {
      props: {
        root: {}, // Root without name
        children: [],
        index: 0
      }
    });
    expect(wrapper.text()).toContain('[empty]');
  });

  // The skipped test 'displays a message when no items are provided' has been removed 
  // as the component does not display a specific message for empty children.

  it('emits "node-selected" event with correct payload when an item is clicked', async () => {
    const wrapper = mount(ConnectedList, {
      props: testProps, // Uses the existing testProps with children
    });
    const itemElements = wrapper.findAll('li');
    // Ensure there's at least one item to click
    if (itemElements.length > 0) {
      await itemElements[0].trigger('click');
      expect(wrapper.emitted()['node-selected']).toBeTruthy();
      // testProps.children[0].id is 2, testProps.index is 1
      expect(wrapper.emitted()['node-selected'][0]).toEqual([testProps.children[0].id, testProps.index]);
    } else {
      // Fail the test if there are no items to click, which shouldn't happen with testProps
      throw new Error("No items to click in the list for 'emits event' test.");
    }
  });
});

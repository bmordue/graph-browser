import { describe, it, expect, beforeEach } from 'vitest'
import GraphBrowser from '../GraphBrowser.vue'

import { mount } from '@vue/test-utils'

import testGraph from './graph.fixture.json'

describe('GraphBrowser', () => {
  let wrapper

  beforeEach(async () => {
    // Adding new test cases for various numbers of ConnectedList components
    const testContainerCounts = [1, 2, 3, 4, 5];
    testContainerCounts.forEach(containerCount => {
      describe(`with ${containerCount} ConnectedList components`, () => {
        beforeEach(async () => {
          wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount } })
          wrapper.vm.fetchGraphData = () => Promise.resolve({ data: testGraph });
          await wrapper.vm.$nextTick();
          wrapper.vm.loadGraphData()
          await wrapper.vm.$nextTick();
        });

        // Add a test case to verify rendering of correct number of ConnectedList components
        it('renders the correct number of ConnectedList components', async () => {
          expect(wrapper.findAllComponents(ConnectedList).length).toBe(containerCount);
        });

        // Existing test cases
        it('loads graph data', async () => {
          expect(wrapper.vm.$data.graph).toEqual(testGraph);
        });

        it('renders properly', async () => {
          // Expect the UI to contain the appropriate number of [empty] placeholders for unpopulated lists
          const expectedPlaceholders = '[empty]'.repeat(containerCount - 1);
          expect(wrapper.text()).toContain(`HistoryRoutes from Paris${expectedPlaceholders}`);
        });

        // other test cases unchanged

      });
    });
    wrapper.vm.fetchGraphData = () => Promise.resolve({ data: testGraph });
    await wrapper.vm.$nextTick();
    wrapper.vm.loadGraphData()
    await wrapper.vm.$nextTick();
  })

  it('loads graph data', async () => {
    expect(wrapper.vm.$data.graph).toEqual(testGraph);
  })

  it('renders properly', async () => {
    expect(wrapper.text()).toContain('HistoryRoutes from ParisBerlinRome[empty]');
  })

  it('updates nodeHistory correctly when a node in the highest index list is clicked', async () => {
    await wrapper.findAll('ul').at(0).find('li').trigger('click')
    await wrapper.findAll('ul').at(1).find('li').trigger('click')

    const highestIndexList = wrapper.findAll('ul').at(2);
    const nodeToClick = highestIndexList.find('li');
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();

    const { nodeHistory } = wrapper.vm.$data;
    expect(nodeHistory).toEqual([{
      "data": {
        "country": "Germany",
      },
      "id": 2,
      "name": "Berlin",
    },
    {
      "data": {
        "country": "France",
      },
      "id": 1,
      "name": "Paris",
    },
    {
      "data": {
        "country": "Germany",
      },
      "id": 2,
      "name": "Berlin",
    }]);
  })

  it('updates nodeHistory correctly when a node in a lower index list is clicked', async () => {
    const lowerIndexList = wrapper.findAll('ul').at(0);
    const nodeToClick = lowerIndexList.find('li');
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();


    const { nodeHistory } = wrapper.vm.$data;
    expect(nodeHistory).toEqual([{
      "data": {
        "country": "Germany",
      },
      "id": 2,
      "name": "Berlin",
    },]);
  })

  it('updates nodeHistory correctly when the same node is clicked multiple times', async () => {
    const lowerIndexList = wrapper.findAll('ul').at(0);
    const nodeToClick = lowerIndexList.find('li');
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();

    // second click
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();


    const { nodeHistory } = wrapper.vm.$data;
    expect(nodeHistory).toEqual([{
      "data": {
        "country": "Germany",
      },
      "id": 2,
      "name": "Berlin",
    },]);
  })
})

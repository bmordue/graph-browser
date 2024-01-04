import { describe, it, expect, beforeEach } from 'vitest'
import GraphBrowser from '../GraphBrowser.vue'

import { mount } from '@vue/test-utils'

import testGraph from './graph.fixture.json'

describe('GraphBrowser', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
    wrapper.vm.dataService = {fetchGraphData: () => Promise.resolve({ data: testGraph })};
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

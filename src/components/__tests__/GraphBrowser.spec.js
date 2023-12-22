import { describe, it, expect, beforeEach } from 'vitest'
import GraphBrowser from '../GraphBrowser.vue'

import { mount } from '@vue/test-utils'

import testGraph from './graph.fixture.json'

describe('GraphBrowser', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
    wrapper.vm.fetchGraphData = () => Promise.resolve({data: testGraph});
    await wrapper.vm.$nextTick();
    wrapper.vm.loadGraphData()
    await wrapper.vm.$nextTick();
  })

  it('loads graph data', async () => {
    expect(wrapper.vm.$data.graph).toEqual(testGraph);
  })

  it('renders properly', async () => {
    expect(wrapper.text()).toContain('[expected text here]');
  })

  it('updates nodeHistory correctly when a node in the highest index list is clicked', async () => {
    const highestIndexList = wrapper.findAll('ul').at(2);
    const nodeToClick = highestIndexList.find('li');
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();

    const { nodeHistory, details } = wrapper.vm.$data;
    expect(nodeHistory.someHistoryProperty).toEqual('[expected history here]');
    expect(details.someDetailsProperty).toEqual('[expected details here]');
  })

  it('updates nodeHistory correctly when a node in a lower index list is clicked', async () => {
    const lowerIndexList = wrapper.findAll('ul').at(0);
    const nodeToClick = lowerIndexList.find('li');
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();

    const { nodeHistory, details } = wrapper.vm.$data;
    expect(nodeHistory.someHistoryProperty).toEqual('[expected lower history here]');
    expect(details.someDetailsProperty).toEqual('[expected lower details here]');
  })

  it('updates nodeHistory correctly when the same node is clicked multiple times', async () => {
    const nodeToClick = wrapper.findAll('li').at(2);
    await nodeToClick.trigger('click');
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();

    const { nodeHistory, details } = wrapper.vm.$data;
    expect(nodeHistory.someHistoryProperty).toEqual('[expected repeated history here]');
    expect(details.someDetailsProperty).toEqual('[expected repeated details here]');
  })
})

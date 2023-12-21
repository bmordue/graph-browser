import { describe, it, expect } from 'vitest'
import GraphBrowser from '../GraphBrowser.vue'

import { mount } from '@vue/test-utils'

import testGraph from './graph.fixture.json'

describe('GraphBrowser', () => {

  it('loads graph data', () => {
    const wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
    wrapper.vm.fetchGraphData = () => { return Promise.resolve({data: testGraph}) } 
    wrapper.vm.loadGraphData()

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.graph).toEqual(testGraph);
  })

  it('renders properly', () => {
    const wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
    wrapper.vm.fetchGraphData = () => Promise.resolve({data: testGraph});
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('[expected text here]');
  })

  it('updates nodeHistory correctly when a node in the highest index list is clicked', async () => {
    const wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
    await wrapper.vm.$nextTick();

    const highestIndexList = wrapper.findAll('ul').at(2);
    const nodeToClick = highestIndexList.find('li');
    await nodeToClick.trigger('click');
    await wrapper.vm.$nextTick();

    const { nodeHistory, details } = wrapper.vm.$data;
    expect(nodeHistory.someHistoryProperty).toEqual('[expected history here]');
    expect(details.someDetailsProperty).toEqual('[expected details here]');
  })

  it('updates nodeHistory correctly when a node in a lower index list is clicked', () => {
    // steps similar to above, but for the first ul element
  })

  it('updates nodeHistory correctly when the same node is clicked multiple times', () => {
    // Test logic goes here
  })
})

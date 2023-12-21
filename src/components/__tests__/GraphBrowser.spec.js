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

  it('updates nodeHistory correctly when a node in the highest index list is clicked', () => {
    // mount GraphBrowser

    // query the DOM to find the third <ul> element

    // trigger a click event on any <li> element in the third <ul>

    // verify that the contents of the history and details components have changed
  })

  it('updates nodeHistory correctly when a node in a lower index list is clicked', () => {
    // steps similar to above, but for the first ul element
  })

  it('updates nodeHistory correctly when the same node is clicked multiple times', () => {
    // Test logic goes here
  })
})

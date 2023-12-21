import { describe, it, expect } from 'vitest'
import GraphBrowser from '../GraphBrowser.vue'

import { mount } from '@vue/test-utils'

import testGraph from './graph.fixture.json'

describe('GraphBrowser', () => {

  it('loads graph data', () => {
    const wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
    wrapper.vm.fetchGraphData = () => { return Promise.resolve({data: testGraph}) } 
    wrapper.vm.loadGraphData()

    expect(wrapper.text()).toContain('History[empty][empty][empty]Details')
  })

  it('renders properly', () => {
    const wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
    wrapper.vm.fetchGraphData = () => { return {data: testGraph} } 

    expect(wrapper.text()).toContain('History[empty][empty][empty]Details')
  })

  it('updates nodeHistory correctly when a node in the highest index list is clicked', () => {
    // Test logic goes here
  })

  it('updates nodeHistory correctly when a node in a lower index list is clicked', () => {
    // Test logic goes here
  })

  it('updates nodeHistory correctly when the same node is clicked multiple times', () => {
    // Test logic goes here
  })
})

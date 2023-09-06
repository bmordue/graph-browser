import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import GraphBrowser from '../GraphBrowser.vue'

describe('GraphBrowser', () => {
  it('renders properly', () => {
    const wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 1 } })
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

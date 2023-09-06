import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import GraphBrowser from '../GraphBrowser.vue'

describe('GraphBrowser', () => {
  it('renders properly', () => {
    const wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 1 } })
    expect(wrapper.text()).toContain('History[empty][empty][empty]Details')
  })
})

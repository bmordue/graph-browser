import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import NodeHistory from '../NodeHistory.vue'

describe('NodeHistory', () => {
  it('renders properly', () => {
    const wrapper = mount(NodeHistory, { props: { nodes: [] } })
    expect(wrapper.text()).toContain('History')
  })
})

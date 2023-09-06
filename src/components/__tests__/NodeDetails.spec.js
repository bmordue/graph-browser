import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import NodeDetails from '../NodeDetails.vue'

describe('NodeDetails', () => {
  it('renders properly', () => {
    const wrapper = mount(NodeDetails, { props: { node: {} } })
    expect(wrapper.text()).toContain('Details')
  })
})

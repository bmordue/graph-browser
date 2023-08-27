import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GraphBrowser from '../GraphBrowser.vue'

describe('GraphBrowser', () => {
  it('renders properly', () => {
    const wrapper = mount(GraphBrowser)
    expect(wrapper.text()).toContain('Graph Browser')
  })
})

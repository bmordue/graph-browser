import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })

  it('renders default message when no prop is passed', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.text()).toContain('Default Message')
  })

  it('renders custom message when prop is passed', () => {
    const customMessage = 'Custom Message'
    const wrapper = mount(HelloWorld, { props: { msg: customMessage } })
    expect(wrapper.text()).toContain(customMessage)
  })
})

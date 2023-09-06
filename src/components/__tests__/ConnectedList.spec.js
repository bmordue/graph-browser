import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ConnectedList from '../ConnectedList.vue'

describe('ConnectedList', () => {
  it('renders properly', () => {
    const listName = 'test';
    const wrapper = mount(ConnectedList, {
      props: {
        root: { name: listName },
        children: [],
        index: 0
      }
    })
    expect(wrapper.text()).toContain(`Routes from ${listName}`)
  })
})

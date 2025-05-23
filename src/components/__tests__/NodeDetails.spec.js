import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import NodeDetails from '../NodeDetails.vue'

describe('NodeDetails', () => {
  it('renders properly with valid node data', () => {
    // Provide a node object that satisfies the validator in NodeDetails.vue
    const validNode = {
      id: 1, // Not strictly required by validator, but good for consistency
      name: "Test Node", // Also not in validator, but often present
      data: {
        label: "Test Label",
        NS: "Test.Namespace",
        hash: "TEST_HASH_123",
        constituents: [], // Validator requires this array
        // Adding other fields mentioned in subtask description for completeness,
        // even if not strictly in the validator snippet seen previously.
        // If these are not used by NodeDetails template, they won't harm.
        country: "Testland", 
        updated: "2024-01-01T00:00:00Z",
        created: "2024-01-01T00:00:00Z",
        user: "testuser"
      }
    };
    const wrapper = mount(NodeDetails, { props: { node: validNode } });
    expect(wrapper.text()).toContain('Details');
    // Also check if some of the data is rendered
    expect(wrapper.text()).toContain('Label: Test Label');
    expect(wrapper.text()).toContain('NS: Test.Namespace');
    expect(wrapper.text()).toContain('Hash: TEST_HASH_123');
  });

  it('renders "Details" heading even when node data might be minimal or not fully valid (though validator aims to prevent this)', () => {
    // This test reflects the original test's intent but uses a slightly more realistic (though still invalid) prop
    // to ensure the component doesn't crash and still shows "Details".
    // Note: The validator *should* prevent {} from reaching the component in real scenarios if GraphBrowser passes valid data.
    const minimalNode = { data: {} }; // This will still fail validation and show warnings
    const wrapper = mount(NodeDetails, { props: { node: minimalNode } });
    expect(wrapper.text()).toContain('Details');
  });
})

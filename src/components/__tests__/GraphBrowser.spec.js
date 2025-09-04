import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GraphBrowser from '../GraphBrowser.vue';
import testGraphData from './graph.fixture.json'; // Import the graph data

// Mock DataService
// All mock implementation details are now *inside* the factory function.
vi.mock('../DataService', () => {
  // These functions will be created each time the mock factory is evaluated by Vitest.
  // They are effectively "fresh" for each test file execution context.
  const mockGetInitialNode = vi.fn((id) => {
    const node = testGraphData.nodes.find(n => n.id === id);
    return Promise.resolve(node || {});
  });
  const mockGetNodeById = vi.fn((id) => {
    const node = testGraphData.nodes.find(n => n.id === id);
    return Promise.resolve(node || {});
  });
  const mockChildrenOf = vi.fn((nodeId) => {
    const children = testGraphData.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => testGraphData.nodes.find((node) => node.id === edge.target) || {});
    return Promise.resolve(children);
  });

  // This is the mock constructor for DataService
  const MockedDataServiceConstructor = vi.fn().mockImplementation(() => {
    // This object is what `new DataService()` will produce
    return {
      getInitialNode: mockGetInitialNode,
      getNodeById: mockGetNodeById,
      childrenOf: mockChildrenOf,
      // Store the mock functions on the instance if we need to access them from the test
      _mocks: { mockGetInitialNode, mockGetNodeById, mockChildrenOf }
    };
  });

  return { default: MockedDataServiceConstructor };
});

describe('GraphBrowser', () => {
  let wrapper;
  const startingNode = 1;

  const mountComponent = async (containerCount) => {
    wrapper = mount(GraphBrowser, {
      props: {
        startingNode,
        containerCount,
      },
    });
    
    // Clear mocks on the specific instance used by the component
    if (wrapper.vm.dataService && wrapper.vm.dataService._mocks) {
        Object.values(wrapper.vm.dataService._mocks).forEach(mockFn => mockFn.mockClear());
    }
    
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
  };

  [1, 2, 3, 4, 5].forEach((containerCount) => {
    describe(`with ${containerCount} ConnectedList components`, () => {
      beforeEach(async () => {
        await mountComponent(containerCount);
      });

      it('renders the correct number of ConnectedList components', () => {
        expect(wrapper.findAllComponents({ name: 'ConnectedList' }).length).toBe(containerCount);
      });

      it('renders properly', () => {
        // Initial state: First list shows startingNode and its children. Other lists are empty. NodeDetails shows startingNode.
        const startingNodeData = testGraphData.nodes.find(n => n.id === startingNode);
        let expectedText = `History${startingNodeData.name}Routes from ${startingNodeData.name}`;
        
        // Children of the starting node (Paris) are Berlin and Rome.
        // These will appear in the first ConnectedList.
        const childrenOfStartingNode = testGraphData.edges
          .filter(e => e.source === startingNode)
          .map(e => testGraphData.nodes.find(n => n.id === e.target)?.name)
          .join('');
        expectedText += childrenOfStartingNode;

        if (containerCount > 1) {
          expectedText += '[empty]'.repeat(containerCount - 1);
        }
        // Adjusting for the actual output of NodeDetails based on graph.fixture.json "v5" data
        // NodeDetails renders: Label: {{ node.data.label }}NS: {{ node.data.NS }}Hash: {{ node.data.hash }}Constituents:
        // (Constituents list is empty, so only the heading appears)
        expectedText += `DetailsLabel: ${startingNodeData.data.label}NS: ${startingNodeData.data.NS}Hash: ${startingNodeData.data.hash}Constituents:`;
        expect(wrapper.text()).toContain(expectedText);
      });
    });
  });

  describe('interactions with 3 ConnectedList components', () => {
    const specificContainerCount = 3;
    beforeEach(async () => {
      await mountComponent(specificContainerCount);
    });

    it('updates nodeHistory correctly when a node in the highest index list is clicked', async () => {
      const paris = testGraphData.nodes.find(n => n.id === 1);
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      const frankfurt = testGraphData.nodes.find(n => n.id === 4);
      const hamburg = testGraphData.nodes.find(n => n.id === 6);

      // Click Berlin
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).vm.$emit('node-selected', berlin.id, 0);
      await wrapper.vm.$nextTick();
      
      // Click Frankfurt
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(1).vm.$emit('node-selected', frankfurt.id, 1);
      await wrapper.vm.$nextTick();

      // Click Hamburg
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(2).vm.$emit('node-selected', hamburg.id, 2);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin, frankfurt, hamburg]);
    });

    it('updates nodeHistory correctly when a node in a lower index list is clicked', async () => {
      const paris = testGraphData.nodes.find(n => n.id === startingNode);
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      
      // Click Berlin
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).vm.$emit('node-selected', berlin.id, 0);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
    });

    it('updates nodeHistory correctly when the same node is clicked multiple times', async () => {
      const paris = testGraphData.nodes.find(n => n.id === startingNode);
      const berlin = testGraphData.nodes.find(n => n.id === 2);

      // Click Berlin
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).vm.$emit('node-selected', berlin.id, 0);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
      
      // Click Berlin again
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).vm.$emit('node-selected', berlin.id, 0);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
    });
  });
});

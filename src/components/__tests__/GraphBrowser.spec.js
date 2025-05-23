import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GraphBrowser from '../GraphBrowser.vue';
import testGraphData from './graph.fixture.json'; // Import the graph data

// Mock DataService
// All mock implementation details are now *inside* the factory function.
vi.mock('../DataService', () => {
  // These functions will be created each time the mock factory is evaluated by Vitest.
  // They are effectively "fresh" for each test file execution context.
  const mockInit = vi.fn(() => Promise.resolve());
  const mockGetNodeById = vi.fn((id) => {
    return testGraphData.nodes.find(n => n.id === id) || {};
  });
  const mockChildrenOf = vi.fn((nodeId) => {
    return testGraphData.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => testGraphData.nodes.find((node) => node.id === edge.target) || {});
  });

  // This is the mock constructor for DataService
  const MockedDataServiceConstructor = vi.fn().mockImplementation(() => {
    // This object is what `new DataService()` will produce
    return {
      graph: testGraphData, // Graph data is directly assigned
      init: mockInit,
      getNodeById: mockGetNodeById,
      childrenOf: mockChildrenOf,
      // Store the mock functions on the instance if we need to access them from the test
      // e.g. wrapper.vm.dataService.init.mockClear() - though clearing via module-level vars is also an option
      _mocks: { mockInit, mockGetNodeById, mockChildrenOf }
    };
  });

  return { default: MockedDataServiceConstructor };
});

describe('GraphBrowser', () => {
  let wrapper;
  const startingNode = 1;

  const mountComponent = async (containerCount) => {
    // Access the mocks through the instance if needed, or clear them if they were module-scoped
    // For this setup, the mocks are created fresh inside the factory for each test run,
    // but the *same mock functions* (mockInit, mockGetNodeById, mockChildrenOf within the factory scope)
    // are reused by each instance created by MockedDataServiceConstructor within a single test file run.
    // So, we need to clear them if their state (e.g., call counts) should not leak between tests.
    // To do this, we need access to them. One way is to re-import the mocked DataService.
    // Or, if we attach them to the instance as done with `_mocks`.
    
    // Let's try clearing via the instance if possible after mount.
    // This part is tricky as the mock functions are defined inside vi.mock's factory.
    // For robust clearing, it's often easier to re-import the mocked module and clear its functions.
    // However, for now, let's assume Vitest's test isolation handles some of this,
    // or we can clear them via an instance if GraphBrowser exposes dataService.

    wrapper = mount(GraphBrowser, {
      props: {
        startingNode,
        containerCount,
        listCount: containerCount, // Added missing prop
      },
    });
    
    // Clear mocks on the specific instance used by the component
    if (wrapper.vm.dataService && wrapper.vm.dataService._mocks) {
      wrapper.vm.dataService._mocks.mockInit.mockClear();
      wrapper.vm.dataService._mocks.mockGetNodeById.mockClear();
      wrapper.vm.dataService._mocks.mockChildrenOf.mockClear();
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
        let expectedText = `HistoryRoutes from ${startingNodeData.name}`;
        
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
      // const paris = testGraphData.nodes.find(n => n.id === 1); // Not added to history unless clicked
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      const frankfurt = testGraphData.nodes.find(n => n.id === 4); // Child of Berlin in testGraph.fixture.json
      const hamburg = testGraphData.nodes.find(n => n.id === 6); // Child of Frankfurt in testGraph.fixture.json

      // Click Berlin (in list 0, child of Paris)
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await wrapper.vm.$nextTick(); 
      await wrapper.vm.$nextTick(); 

      // Click Frankfurt (in list 1, child of Berlin)
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(1).findAll('li').find(li => li.text() === frankfurt.name).trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      
      // Click Hamburg (in list 2, child of Frankfurt)
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(2).findAll('li').find(li => li.text() === hamburg.name).trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // History should only contain clicked nodes
      expect(wrapper.vm.nodeHistory).toEqual([berlin, frankfurt, hamburg]);
    });

    it('updates nodeHistory correctly when a node in a lower index list is clicked', async () => {
      // const paris = testGraphData.nodes.find(n => n.id === startingNode); // Not added to history unless clicked
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      
      // Click Berlin (in list 0, child of Paris)
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // History should only contain clicked Berlin
      expect(wrapper.vm.nodeHistory).toEqual([berlin]);
    });

    it('updates nodeHistory correctly when the same node is clicked multiple times', async () => {
      // const paris = testGraphData.nodes.find(n => n.id === startingNode); // Not added to history
      const berlin = testGraphData.nodes.find(n => n.id === 2);

      // Click Berlin
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.nodeHistory).toEqual([berlin]); // History: [Berlin]
      
      // Click Berlin again
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      // History should still be [Berlin] because component logic prevents adding same consecutive node
      expect(wrapper.vm.nodeHistory).toEqual([berlin]);
    });
  });
});

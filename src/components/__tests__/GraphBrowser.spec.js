import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GraphBrowser from '../GraphBrowser.vue';

// Helper to flush pending promises
const flushPromises = () => new Promise(setImmediate);
import testGraphData from './graph.fixture.json'; // Import the graph data

// Mock DataService
vi.mock('../DataService', () => {
  const mockInit = vi.fn(() => Promise.resolve());
  const mockGetNodeById = vi.fn((id) => {
    const node = testGraphData.nodes.find(n => n.id === id);
    return Promise.resolve(node || null);
  });
  const mockChildrenOf = vi.fn((nodeId) => {
    const children = testGraphData.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => testGraphData.nodes.find((node) => node.id === edge.target) || null)
      .filter(Boolean);
    return Promise.resolve(children);
  });

  const MockedDataServiceConstructor = vi.fn().mockImplementation(() => {
    return {
      graph: testGraphData,
      init: mockInit,
      getNodeById: mockGetNodeById,
      childrenOf: mockChildrenOf,
      _mocks: { mockInit, mockGetNodeById, mockChildrenOf }
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
        // listCount: containerCount, // Removed as it's no longer a prop
      },
    });
    if (wrapper.vm.dataService && wrapper.vm.dataService._mocks) {
      wrapper.vm.dataService._mocks.mockInit.mockClear();
      wrapper.vm.dataService._mocks.mockGetNodeById.mockClear();
      wrapper.vm.dataService._mocks.mockChildrenOf.mockClear();
    }
    await wrapper.vm.$nextTick();
    await flushPromises();
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
        const startingNodeData = testGraphData.nodes.find(n => n.id === startingNode);
        let expectedText = `HistoryRoutes from ${startingNodeData.name}`;
        const childrenOfStartingNode = testGraphData.edges
          .filter(e => e.source === startingNode)
          .map(e => testGraphData.nodes.find(n => n.id === e.target)?.name)
          .join('');
        expectedText += childrenOfStartingNode;
        if (containerCount > 1) {
          expectedText += '[empty]'.repeat(containerCount - 1);
        }
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
      const paris = testGraphData.nodes.find(n => n.id === startingNode);
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      const frankfurt = testGraphData.nodes.find(n => n.id === 4);
      const hamburg = testGraphData.nodes.find(n => n.id === 6);

      wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();

      wrapper.findAllComponents({ name: 'ConnectedList' }).at(1).findAll('li').find(li => li.text() === frankfurt.name).trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();
      
      wrapper.findAllComponents({ name: 'ConnectedList' }).at(2).findAll('li').find(li => li.text() === hamburg.name).trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin, frankfurt, hamburg]);
    });

    it('updates nodeHistory correctly when a node in a lower index list is clicked', async () => {
      const paris = testGraphData.nodes.find(n => n.id === startingNode);
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      
      wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
    });

    it('updates nodeHistory correctly when the same node is clicked multiple times', async () => {
      const paris = testGraphData.nodes.find(n => n.id === startingNode);
      const berlin = testGraphData.nodes.find(n => n.id === 2);

      wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
      
      wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import axios from 'axios';
import GraphBrowser from '../GraphBrowser.vue';
import testGraphData from './graph.fixture.json';

vi.mock('axios');

// Helper function to flush promises
const flushPromises = () => new Promise(setImmediate);

describe('GraphBrowser', () => {
  let wrapper;
  const startingNodeId = 1;
  const startingNodeData = testGraphData.nodes.find(n => n.id === startingNodeId);

  const mountComponent = async (containerCount) => {
    // Mock initial API calls for component mount
    axios.get.mockImplementation((url) => {
      if (url.endsWith(`/node/${startingNodeId}`)) {
        return Promise.resolve({ data: startingNodeData });
      }
      if (url.endsWith(`/node/${startingNodeId}/children`)) {
        const children = testGraphData.edges
          .filter(e => e.source === startingNodeId)
          .map(e => testGraphData.nodes.find(n => n.id === e.target));
        return Promise.resolve({ data: children });
      }
      return Promise.resolve({ data: {} });
    });

    wrapper = mount(GraphBrowser, {
      props: {
        startingNode: startingNodeId,
        containerCount,
        listCount: containerCount,
      },
    });

    // Wait for the initial data loading to complete
    await flushPromises();
  };

  beforeEach(() => {
    // Clear all mocks before each test
    axios.get.mockClear();
  });

  [1, 2, 3, 4, 5].forEach((containerCount) => {
    describe(`with ${containerCount} ConnectedList components`, () => {
      beforeEach(async () => {
        await mountComponent(containerCount);
      });

      it('renders the correct number of ConnectedList components', () => {
        expect(wrapper.findAllComponents({ name: 'ConnectedList' }).length).toBe(containerCount);
      });

      it('renders properly after initial load', () => {
        let expectedText = `History${startingNodeData.name}`;
        
        const childrenOfStartingNode = testGraphData.edges
          .filter(e => e.source === startingNodeId)
          .map(e => testGraphData.nodes.find(n => n.id === e.target)?.name)
          .join('');
        expectedText += `Routes from ${startingNodeData.name}${childrenOfStartingNode}`;

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

    it('updates nodeHistory correctly when nodes are clicked sequentially', async () => {
      const paris = startingNodeData;
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      const frankfurt = testGraphData.nodes.find(n => n.id === 4);

      // Mock API calls for the interaction
      axios.get.mockImplementation(url => {
        if (url.endsWith('/node/2')) return Promise.resolve({ data: berlin });
        if (url.endsWith('/node/2/children')) return Promise.resolve({ data: [frankfurt] });
        if (url.endsWith('/node/4')) return Promise.resolve({ data: frankfurt });
        if (url.endsWith('/node/4/children')) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: {} });
      });

      // Click Berlin
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();

      // Click Frankfurt
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(1).findAll('li').find(li => li.text() === frankfurt.name).trigger('click');
      await flushPromises();
      
      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin, frankfurt]);
    });

    it('updates nodeHistory correctly when a node in a lower index list is clicked', async () => {
      const paris = startingNodeData;
      const berlin = testGraphData.nodes.find(n => n.id === 2);
      
      axios.get.mockImplementation(url => {
        if (url.endsWith('/node/2')) return Promise.resolve({ data: berlin });
        if (url.endsWith('/node/2/children')) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: {} });
      });

      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();

      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
    });

    it('does not add the same node to history if clicked multiple times consecutively', async () => {
      const paris = startingNodeData;
      const berlin = testGraphData.nodes.find(n => n.id === 2);

      axios.get.mockImplementation(url => {
        if (url.endsWith('/node/2')) return Promise.resolve({ data: berlin });
        if (url.endsWith('/node/2/children')) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: {} });
      });

      // Click Berlin
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();
      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
      
      // Click Berlin again in the first list
      await wrapper.findAllComponents({ name: 'ConnectedList' }).at(0).findAll('li').find(li => li.text() === berlin.name).trigger('click');
      await flushPromises();
      // History should not change
      expect(wrapper.vm.nodeHistory).toEqual([paris, berlin]);
    });
  });
});

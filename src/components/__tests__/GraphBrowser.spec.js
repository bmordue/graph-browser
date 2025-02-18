import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GraphBrowser from '../GraphBrowser.vue'

import DataService from '../DataService'

import testGraph from './graph.fixture.json'

describe('GraphBrowser', () => {
  let wrapper

  // Adding new test cases for various numbers of ConnectedList components
  const testContainerCounts = [1, 2, 3, 4, 5]
  testContainerCounts.forEach((containerCount) => {
    describe(`with ${containerCount} ConnectedList components`, () => {
      beforeEach(async () => {
        wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount } })
        const testDataService = new DataService()
        testDataService.graph = testGraph
        await wrapper.vm.$nextTick()
        wrapper.vm.initialise()
        await wrapper.vm.$nextTick()
      })

      it('renders the correct number of ConnectedList components', async () => {
        expect(wrapper.findAllComponents('ConnectedList').length).toBe(containerCount)
      })

      it('renders properly', async () => {
        // Expect the UI to contain the appropriate number of [empty] placeholders for unpopulated lists
        const expectedPlaceholders = '[empty]'.repeat(containerCount - 1)
        expect(wrapper.text()).toContain(`HistoryRoutes from Paris${expectedPlaceholders}Details`)
      })
    });

    describe('remaining tests with three ConnectedList components', () => {
      beforeEach(async () => {
        wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 3 } })
        const testDataService = new DataService()
        testDataService.graph = testGraph
        await wrapper.vm.$nextTick()
        wrapper.vm.initialise()
        await wrapper.vm.$nextTick()
      })

      it('updates nodeHistory correctly when a node in the highest index list is clicked', async () => {
        await wrapper.findAll('ul').at(0).find('li').trigger('click')
        await wrapper.findAll('ul').at(1).find('li').trigger('click')

        const highestIndexList = wrapper.findAll('ul').at(2)
        const nodeToClick = highestIndexList.find('li')
        await nodeToClick.trigger('click')
        await wrapper.vm.$nextTick()

        const { nodeHistory } = wrapper.vm.$data
        expect(nodeHistory).toEqual([
          {
            data: {
              country: 'Germany'
            },
            id: 2,
            name: 'Berlin'
          },
          {
            data: {
              country: 'France'
            },
            id: 1,
            name: 'Paris'
          },
          {
            data: {
              country: 'Germany'
            },
            id: 2,
            name: 'Berlin'
          }
        ])
      })

      it('updates nodeHistory correctly when a node in a lower index list is clicked', async () => {
        const lowerIndexList = wrapper.findAll('ul').at(0)
        const nodeToClick = lowerIndexList.find('li')
        await nodeToClick.trigger('click')
        await wrapper.vm.$nextTick()

        const { nodeHistory } = wrapper.vm.$data
        expect(nodeHistory).toEqual([
          {
            data: {
              country: 'Germany'
            },
            id: 2,
            name: 'Berlin'
          }
        ])
      })

      it('updates nodeHistory correctly when the same node is clicked multiple times', async () => {
        const lowerIndexList = wrapper.findAll('ul').at(0)
        const nodeToClick = lowerIndexList.find('li')
        await nodeToClick.trigger('click')
        await wrapper.vm.$nextTick()

        // second click
        await nodeToClick.trigger('click')
        await wrapper.vm.$nextTick()

        const { nodeHistory } = wrapper.vm.$data
        expect(nodeHistory).toEqual([
          {
            data: {
              country: 'Germany'
            },
            id: 2,
            name: 'Berlin'
          }
        ])
      })
    })
  })
})

describe('GraphBrowser with different number of lists', () => {
  it('renders properly with two lists', async () => {
    let wrapper
    const testDataService = new DataService()
    testDataService.graph = testGraph

    wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 2 } })
    wrapper.vm.dataService = testDataService
    await wrapper.vm.$nextTick()
    wrapper.vm.initialise()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('History[empty][empty]Details')
  })

  it('renders properly with four lists', async () => {
    let wrapper
    const testDataService = new DataService()
    testDataService.graph = testGraph

    wrapper = mount(GraphBrowser, { props: { startingNode: 1, containerCount: 4 } })
    wrapper.vm.dataService = testDataService
    await wrapper.vm.$nextTick()
    wrapper.vm.initialise()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('History[empty][empty][empty][empty]Details')
  })
})

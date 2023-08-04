<template>
  <div>
    <NodeHistory :nodes="nodeHistory"></NodeHistory>

    <ConnectedList v-for="(destList, i) in connectedLists" :key="i" :index="i" :children="destList.children || []"
      :root="destList.root || {}" @node-selected="selectNode">
    </ConnectedList>

    <NodeDetails :node="selectedNode"> </NodeDetails>
  </div>
</template>

<script>
import axios from 'axios'
import ConnectedList from './ConnectedList.vue'
import NodeDetails from './NodeDetails.vue'
import NodeHistory from './NodeHistory.vue'

export default {
  components: {
    ConnectedList,
    NodeDetails,
    NodeHistory
  },
  props: {
    startingNode: {
      type: Number,
      required: true
    },
    containerCount: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      graph: null,
      selectedNodeId: null,
      selectedListIndex: null,
      connectedLists: [{}, {}, {}, {}, {}],
      nodeHistory: []
    }
  },
  computed: {
    selectedNode() {
      return this.getNodeById(this.selectedNodeId)
    },
    getNode() {
      return this.getNodeById(this.selectedNodeId) || { name: 'unknown' }
    },
    getChildren() {
      return this.childrenOf(this.selectedNodeId)
    }
  },
  created() {
    this.loadGraphData()
  },
  methods: {
    loadGraphData() {
      axios
        .get('./graph.json')
        .then((response) => {
          this.graph = response.data
          this.selectedNodeId = this.startingNode
          this.connectedLists[0].root = this.getNodeById(this.selectedNodeId)
          this.connectedLists[0].children = this.childrenOf(this.selectedNodeId)
        })
        .catch((error) => {
          console.error('Error loading graph data:', error)
        })
    },
    selectNode(nodeId, listIndex) {
      // set connected lists
      if (listIndex < this.connectedLists.length - 1) {
        console.log('no shift')
        for (let i = listIndex + 1; i < this.connectedLists.length; i++) {
          console.log(`clear ${this.connectedLists[i].name}`)
          this.connectedLists[i] = {};
        }
        this.connectedLists[listIndex + 1] = {
          root: this.getNodeById(nodeId),
          children: this.childrenOf(nodeId)
        }
      } else {
        // shift everything left
        console.log('shift left')
        for (let i = 0; i < this.connectedLists.length - 1; i++) {
          this.connectedLists[i] = this.connectedLists[i + 1]
        }

        this.connectedLists[this.connectedLists.length - 1] = {
          root: this.getNodeById(nodeId),
          children: this.childrenOf(nodeId)
        }

      }

      // roll back history
      // this.nodeHistory = this.nodeHistory.slice(0, listIndex + 1);
      // logic is wrong

      if (nodeId != this.selectedNodeId) {
        this.nodeHistory.push(this.getNode)
      }
      this.selectedNodeId = nodeId
    },
    childrenOf(nodeId) {
      if (!this.graph) {
        return []
      }

      return this.graph.edges
        .filter((edge) => edge.source === nodeId)
        .map((edge) => this.graph.nodes.find((node) => node.id === edge.target))
    },
    getNodeById(nodeId) {
      if (!this.graph) {
        return {}
      }

      return this.graph.nodes.find((n) => n.id === nodeId) || {}
    }
  }
}
</script>

<template>
  <div>
    <NodeHistory :nodes="nodeHistory"></NodeHistory>
    <ConnectedList
      :children="getChildren"
      :root="getNode"
      @node-selected="selectNode"
    ></ConnectedList>
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
    }
  },
  data() {
    return {
      graph: null,
      selectedNodeId: null,
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
    this.selectedNodeId = this.startingNode
  },
  methods: {
    loadGraphData() {
      axios
        .get('/graph.json')
        .then((response) => {
          this.graph = response.data
        })
        .catch((error) => {
          console.error('Error loading graph data:', error)
        })
    },
    selectNode(nodeId) {
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

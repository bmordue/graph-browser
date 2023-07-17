<template>
  <div>
    <h2>Graph Browser</h2>
    <NodeHistory :nodes="nodeHistory"></NodeHistory>
    <ConnectedList
      :children="level1Nodes"
      :title="titleForConnections"
      :root="getNode"
      @node-selected="selectLevel2Node"
    ></ConnectedList>
    <!-- <ConnectedList
      :nodes="level2Nodes"
      title="Level 2 Nodes"
      @node-selected="selectLevel3Node"
    ></ConnectedList>
    <ConnectedList :nodes="level3Nodes" title="Level 3 Nodes"></ConnectedList> -->
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
      selectedLevel1Node: null,
      selectedLevel2Node: null,
      selectedLevel3Node: null,
      selectedNodeId: null,
      nodeHistory: []
    }
  },
  computed: {
    level1Nodes() {
      if (!this.graph || !this.selectedLevel1Node) {
        console.log('returning empty node list - lvl 1')
        return []
      }

      return this.graph.edges
        .filter((edge) => edge.source === this.selectedLevel1Node)
        .map((edge) => this.graph.nodes.find((node) => node.id === edge.target))
    },
    titleForConnections(self) {
      console.log(`destinations: ${JSON.stringify(self)}`)
      return `Destinations `//from ${this.getNodeById(nodeId).name}`
    },
    level2Nodes() {
      if (!this.graph || !this.selectedLevel1Node || !this.selectedLevel2Node) {
        console.log('returning empty node list - lvl 2')
        return []
      }

      return this.graph.edges
        .filter((edge) => edge.source === this.selectedLevel2Node)
        .map((edge) => this.graph.nodes.find((node) => node.id === edge.target))
    },
    level3Nodes() {
      if (!this.graph || !this.selectedLevel3Node) {
        console.log('returning empty node list - lvl 3')
        return []
      }

      return this.graph.edges
        .filter((edge) => edge.source === this.selectedLevel3Node)
        .map((edge) => this.graph.nodes.find((node) => node.id === edge.target))
    },
    selectedNode() {
      return this.getNodeById(this.selectedNodeId)
    },
    getNode() {
      return this.getNodeById(this.selectedNodeId) || { name: 'unknown' }
    }
  },
  created() {
    this.loadGraphData()
    this.selectedLevel1Node = this.startingNode
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
    selectLevel1Node(nodeId) {
      this.selectedNodeId = nodeId
      this.nodeHistory.push(nodeId)
      this.selectedLevel2Node = nodeId
    },
    selectLevel2Node(nodeId) {
      this.selectedNodeId = nodeId
      this.nodeHistory.push(nodeId)
      this.selectedLevel3Node = nodeId
    },
    selectLevel3Node(nodeId) {
      this.selectedNodeId = nodeId
      this.nodeHistory.push(nodeId)
      this.selectedLevel1Node = this.selectedLevel2Node
      this.selectedLevel2Node = this.selectedLevel3Node
      this.selectedLevel3Node = nodeId
    },
    childrenOf(nodeId) {
      if (!this.graph) {
        console.log('returning empty node list')
        return []
      }

      return this.graph.edges
        .filter((edge) => edge.source === nodeId)
        .map((edge) => this.graph.nodes.find((node) => node.id === edge.target))
    },
    getNodeById(nodeId) {
      if (!this.graph) {
        console.log('returning empty node object')
        return {}
      }

      return this.graph.nodes.find((n) => n.id === nodeId) || {}
    }
  }
}
</script>

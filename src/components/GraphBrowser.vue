<template>
  <div class="grid-container">
    <NodeHistory :nodes="nodeHistory" style="grid-column: 1;"></NodeHistory>
    <ConnectedList v-for="(destList, i) in connectedLists" :key="i" :index="i" :children="destList.children || []"
      :root="destList.root || {}" @node-selected="selectNode" :style="{ gridColumn: i + 2 }">
    </ConnectedList>
    <NodeDetails :node="selectedNode" :style="{ gridColumn: connectedLists.length + 2 }"> </NodeDetails>
  </div>
</template>

<script>
import DataService from './DataService'
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
      connectedLists: [{}, {}, {}],//new Array(this.containerCount).fill({}),
      nodeHistory: [],
      dataService: DataService
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
      this.dataService.fetchGraphData().then((response) => {
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

      if (this.nodeHistory.length == 0 || this.nodeHistory[this.nodeHistory.length - 1].id != nodeId) {
        this.nodeHistory.push(this.getNodeById(nodeId));
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

<style scoped>
.grid-container {
  display: grid;
  :style="{ gridTemplateColumns: `repeat(${connectedLists.length + 2}, 1fr)` }";
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>

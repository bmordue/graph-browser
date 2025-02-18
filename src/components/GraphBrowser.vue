<template>
  <div class="grid-container">
    <NodeHistory :nodes="nodeHistory" @history-item-selected="selectHistoryItem"></NodeHistory>
    <ConnectedList v-for="(destList, i) in   connectedLists  " :key="i" :index="i" :children="destList.children || []"
      :root="destList.root || {}" @node-selected="selectNode">
    </ConnectedList>
    <NodeDetails :node="selectedNode"> </NodeDetails>
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
    listCount: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      selectedNodeId: null,
      selectedListIndex: null,
      connectedLists: Array.from({ length: this.containerCount }, () => ({})),
      nodeHistory: [],
      dataService: new DataService()
    }
  },
  computed: {
    selectedNode() {
      return this.dataService.getNodeById(this.selectedNodeId)
    },
    getNode() {
      return this.dataService.getNodeById(this.selectedNodeId) || { name: 'unknown' }
    },
    getChildren() {
      return this.dataService.childrenOf(this.selectedNodeId)
    }
  },
  created() {
    this.initialise()
  },
  methods: {
    initialise() {
      this.dataService.init().then(() => {
        this.selectedNodeId = this.startingNode
        this.connectedLists[0].root = this.dataService.getNodeById(this.selectedNodeId)
        this.connectedLists[0].children = this.dataService.childrenOf(this.selectedNodeId)
      }).catch((error) => {
        console.error('Error loading graph data:', error)
      })
    },
    selectNode(nodeId, listIndex) {
      // set connected lists
      if (listIndex < this.connectedLists.length - 1) {
        for (let i = listIndex + 1; i < this.connectedLists.length; i++) {
          this.connectedLists[i] = {};
        }
        this.connectedLists[listIndex + 1] = {
          root: this.dataService.getNodeById(nodeId),
          children: this.dataService.childrenOf(nodeId)
        }
      } else {
        // shift everything left
        for (let i = 0; i < listIndex; i++) {
          this.connectedLists[i] = this.connectedLists[i + 1];
        }

        this.connectedLists[listIndex] = {
          root: this.dataService.getNodeById(nodeId),
          children: this.dataService.childrenOf(nodeId)
        }
      }

      if (this.nodeHistory.length == 0 || this.nodeHistory[this.nodeHistory.length - 1].id != nodeId) {
        this.nodeHistory.push(this.dataService.getNodeById(nodeId));
      }
      this.selectedNodeId = nodeId
    },

    selectHistoryItem(nodeId, index) {
      if (index == this.nodeHistory.length - 1) {
        return;
      }

      this.nodeHistory = this.nodeHistory.slice(0, index + 1)

      let offset = this.nodeHistory.length - this.containerCount
      if (offset < 0) {
        offset = 0
      }

      for (let i = 0; i < this.containerCount; i++) {
        if (this.nodeHistory.length > i + offset) {
          this.connectedLists[i] = {
            root: this.nodeHistory[i + offset],
            children: this.dataService.childrenOf(this.nodeHistory[i + offset].id)
          }
        } else {
          this.connectedLists[i] = {}
        }
      }

      this.selectedNodeId = nodeId
    }

  }
}
</script>

<style scoped>
.grid-container {
  display: flex;
}
</style>

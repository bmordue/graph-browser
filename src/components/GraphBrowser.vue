<template>
  <div class="grid-container">
    <NodeHistory :nodes="nodeHistory" @history-item-selected="selectHistoryItem"></NodeHistory>
    <ConnectedList v-for="(destList, i) in connectedLists" :key="i" :index="i" :children="destList.children || []"
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
  },
  data() {
    return {
      selectedNode: {},
      connectedLists: Array.from({ length: this.containerCount }, () => ({})),
      nodeHistory: [],
      dataService: new DataService()
    }
  },
  async created() {
    await this.initialise();
  },
  methods: {
    async initialise() {
      try {
        const startingNode = await this.dataService.getInitialNode(this.startingNode);
        this.selectedNode = startingNode;
        this.nodeHistory.push(startingNode);
        const children = await this.dataService.childrenOf(startingNode.id);
        this.connectedLists[0] = {
          root: startingNode,
          children: children,
        };
      } catch (error) {
        console.error('Error loading graph data:', error);
      }
    },
    async selectNode(nodeId, listIndex) {
      const node = await this.dataService.getNodeById(nodeId);
      const children = await this.dataService.childrenOf(nodeId);

      if (listIndex < this.connectedLists.length - 1) {
        for (let i = listIndex + 1; i < this.connectedLists.length; i++) {
          this.connectedLists[i] = {};
        }
        this.connectedLists[listIndex + 1] = {
          root: node,
          children: children
        }
      } else {
        for (let i = 0; i < listIndex; i++) {
          this.connectedLists[i] = this.connectedLists[i + 1];
        }

        this.connectedLists[listIndex] = {
          root: node,
          children: children
        }
      }

      if (this.nodeHistory.length == 0 || this.nodeHistory[this.nodeHistory.length - 1].id != nodeId) {
        this.nodeHistory.push(node);
      }
      this.selectedNode = node;
    },

    async selectHistoryItem(nodeId, index) {
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
          const node = this.nodeHistory[i + offset];
          const children = await this.dataService.childrenOf(node.id);
          this.connectedLists[i] = {
            root: node,
            children: children
          }
        } else {
          this.connectedLists[i] = {}
        }
      }

      this.selectedNode = this.nodeHistory[this.nodeHistory.length - 1];
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: flex;
}
</style>

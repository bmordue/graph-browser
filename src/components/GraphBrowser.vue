<template>
  <div class="grid-container">
    <div v-if="loading" class="loading">Loading...</div>
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
      selectedNodeId: this.startingNode,
      selectedNode: {},
      selectedListIndex: null,
      connectedLists: Array.from({ length: this.containerCount }, () => ({})),
      nodeHistory: [],
      dataService: new DataService(),
      loading: false
    }
  },
  created() {
    this.initialise()
  },
  methods: {
    async initialise() {
      this.loading = true;
      try {
        if (this.selectedNodeId !== null) {
          const [rootNode, children] = await Promise.all([
            this.dataService.getNodeById(this.selectedNodeId),
            this.dataService.childrenOf(this.selectedNodeId)
          ]);
          this.connectedLists[0].root = rootNode;
          this.connectedLists[0].children = children;
          this.selectedNode = rootNode;
          this.nodeHistory.push(rootNode);
        }
      } catch (error) {
        console.error('Error loading graph data:', error);
      } finally {
        this.loading = false;
      }
    },
    async selectNode(nodeId, listIndex) {
      this.loading = true;
      try {
        const [selected, children] = await Promise.all([
          this.dataService.getNodeById(nodeId),
          this.dataService.childrenOf(nodeId)
        ]);

        if (listIndex < this.connectedLists.length - 1) {
          for (let i = listIndex + 1; i < this.connectedLists.length; i++) {
            this.connectedLists[i] = {};
          }
          this.connectedLists[listIndex + 1] = {
            root: selected,
            children: children
          }
        } else {
          for (let i = 0; i < listIndex; i++) {
            this.connectedLists[i] = this.connectedLists[i + 1];
          }
          this.connectedLists[listIndex] = {
            root: selected,
            children: children
          }
        }

        if (this.nodeHistory.length === 0 || this.nodeHistory[this.nodeHistory.length - 1].id !== nodeId) {
          this.nodeHistory.push(selected);
        }
        this.selectedNodeId = nodeId;
        this.selectedNode = selected;
      } catch (error) {
        console.error(`Error selecting node ${nodeId}:`, error);
      } finally {
        this.loading = false;
      }
    },

    async selectHistoryItem(nodeId, index) {
      if (index === this.nodeHistory.length - 1) {
        return;
      }
      this.loading = true;
      try {
        this.nodeHistory = this.nodeHistory.slice(0, index + 1)
        this.selectedNodeId = nodeId
        this.selectedNode = this.nodeHistory[this.nodeHistory.length - 1];

        let offset = this.nodeHistory.length - this.containerCount
        if (offset < 0) {
          offset = 0
        }

        const promises = [];
        for (let i = 0; i < this.containerCount; i++) {
          if (this.nodeHistory.length > i + offset) {
            const node = this.nodeHistory[i + offset];
            promises.push(this.dataService.childrenOf(node.id).then(children => ({ root: node, children })));
          } else {
            promises.push(Promise.resolve({}));
          }
        }

        const results = await Promise.all(promises);
        results.forEach((result, i) => {
          this.connectedLists[i] = result;
        });

      } catch (error) {
        console.error(`Error selecting history item ${nodeId}:`, error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: flex;
}
.loading {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: lightgray;
  padding: 10px;
  border-radius: 5px;
}
</style>

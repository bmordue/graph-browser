<template>
  <div class="grid-container">
    <NodeHistory :nodes="nodeHistory" @history-item-selected="selectHistoryItem"></NodeHistory>
    <ConnectedList v-for="(destList, i) in connectedLists" :key="i" :index="i" :children="destList.children || []"
      :root="destList.root || {}" @node-selected="selectNode">
    </ConnectedList>
    <NodeDetails :node="detailedSelectedNode"> </NodeDetails> <!-- Changed from selectedNode to detailedSelectedNode -->
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
    // listCount prop removed
  },
  data() {
    return {
      selectedNodeId: this.startingNode,
      detailedSelectedNode: null, // Will store the full object of the selected node
      connectedLists: Array.from({ length: this.containerCount }, () => ({ root: null, children: [] })),
      nodeHistory: [],
      dataService: new DataService()
    }
  },
  // Computed properties that relied on synchronous DataService calls are removed or will be handled differently.
  // selectedNode is replaced by detailedSelectedNode (data property)
  // getNode and getChildren are no longer needed here as their logic will be incorporated into methods.
  async created() {
    // Initialise can now assume selectedNodeId is already set
    await this.initialise()
  },
  methods: {
    async initialise() {
      await this.dataService.init(); // Still calling init, though it's a no-op now
      if (this.selectedNodeId !== null) {
        const rootNode = await this.dataService.getNodeById(this.selectedNodeId);
        if (rootNode) {
          this.detailedSelectedNode = rootNode; // Set initial detailedSelectedNode
          const children = await this.dataService.childrenOf(this.selectedNodeId);
          this.$set(this.connectedLists, 0, { root: rootNode, children: children });
          // Add to history if not already there (e.g. on initial load)
          if (!this.nodeHistory.find(n => n.id === rootNode.id)) {
            this.nodeHistory.push(rootNode);
          }
        } else {
          console.error(`Starting node with ID ${this.selectedNodeId} not found.`);
          // Handle case where starting node isn't found, e.g., show an error or empty state
        }
      }
    },
    async selectNode(nodeId, listIndex) {
      const selectedNodeData = await this.dataService.getNodeById(nodeId);
      if (!selectedNodeData) {
        console.error(`Node with ID ${nodeId} not found during selectNode.`);
        return; // or handle error appropriately
      }
      const children = await this.dataService.childrenOf(nodeId);

      // set connected lists
      if (listIndex < this.connectedLists.length - 1) {
        // Clear lists to the right
        for (let i = listIndex + 1; i < this.connectedLists.length; i++) {
          this.$set(this.connectedLists, i, { root: null, children: [] });
        }
        this.$set(this.connectedLists, listIndex + 1, {
          root: selectedNodeData,
          children: children
        });
      } else {
        // shift everything left
        for (let i = 0; i < listIndex; i++) {
          this.$set(this.connectedLists, i, this.connectedLists[i + 1]);
        }
        this.$set(this.connectedLists, listIndex, {
          root: selectedNodeData,
          children: children
        });
      }

      if (this.nodeHistory.length === 0 || this.nodeHistory[this.nodeHistory.length - 1].id !== nodeId) {
        this.nodeHistory.push(selectedNodeData);
      }
      this.selectedNodeId = nodeId;
      this.detailedSelectedNode = selectedNodeData; // Update detailedSelectedNode
    },

    async selectHistoryItem(nodeId, historyIndex) {
      if (historyIndex === this.nodeHistory.length - 1 && this.selectedNodeId === nodeId) {
        // Avoid reprocessing if the last item in history is clicked again,
        // or if it's the current node already.
        // However, if selectedNodeId is different (e.g. after a page refresh with history), allow update.
        const currentDetailedNode = this.nodeHistory[historyIndex];
        if (this.selectedNodeId === currentDetailedNode.id) {
            this.detailedSelectedNode = currentDetailedNode; // Ensure detailed node is set
            // Potentially refresh connected lists if state is inconsistent
            // For now, assume if IDs match, state is fine or will be fixed by subsequent actions
            // return; // This return might be too aggressive if lists need repopulating
        }
      }

      const selectedNodeFromHistory = this.nodeHistory[historyIndex];
      if (!selectedNodeFromHistory) {
          console.error(`Node not found in history at index ${historyIndex}`);
          return;
      }

      this.nodeHistory = this.nodeHistory.slice(0, historyIndex + 1);
      this.selectedNodeId = selectedNodeFromHistory.id;
      this.detailedSelectedNode = selectedNodeFromHistory;


      let historyOffset = Math.max(0, this.nodeHistory.length - this.containerCount);

      for (let i = 0; i < this.containerCount; i++) {
        const historyNodeIndex = i + historyOffset;
        if (historyNodeIndex < this.nodeHistory.length) {
          const node = this.nodeHistory[historyNodeIndex];
          const children = await this.dataService.childrenOf(node.id);
          this.$set(this.connectedLists, i, {
            root: node,
            children: children || [] // Ensure children is an array
          });
        } else {
          this.$set(this.connectedLists, i, { root: null, children: [] });
        }
      }
      // Ensure the last list's root is the selected node, and its children are loaded
      // This might be redundant if the loop correctly populates the last relevant list
      const lastListIndexToUpdate = Math.min(this.containerCount -1, this.nodeHistory.length -1 - historyOffset);
      if(lastListIndexToUpdate >=0 && this.connectedLists[lastListIndexToUpdate] && this.connectedLists[lastListIndexToUpdate].root.id === selectedNodeFromHistory.id){
          // Already set by the loop
      } else if (this.nodeHistory.length > 0) {
          // Fallback or specific update if needed, though the loop should handle it.
          // This might indicate a more complex scenario if the loop isn't sufficient.
      }


      // If fewer items in history than containers, clear remaining containers
      for (let i = this.nodeHistory.length - historyOffset; i < this.containerCount; i++) {
        if (i >= 0) { // Ensure index is valid
          this.$set(this.connectedLists, i, { root: null, children: [] });
        }
      }
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: flex;
}
</style>

<template>
  <div>
    <h2>Graph Browser</h2>

    <List
      :nodes="level1Nodes"
      title="Level 1 Nodes"
      @node-selected="selectLevel1Node"
    ></List>

    <div v-if="selectedLevel1Node">
      <List
        :nodes="level2Nodes"
        title="Level 2 Nodes"
        @node-selected="selectLevel2Node"
      ></List>
    </div>

    <div v-if="selectedLevel2Node">
      <List
        :nodes="level3Nodes"
        title="Level 3 Nodes"
      ></List>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ConnectedList from "./ConnectedList.vue";

export default {
  components: {
    ConnectedList
  },
  data() {
    return {
      graph: null,
      selectedLevel1Node: null,
      selectedLevel2Node: null
    };
  },
  computed: {
    level1Nodes() {
      if (!this.graph || !this.selectedLevel1Node) {
        return [];
      }

      return this.graph.edges
        .filter(edge => edge.source === this.selectedLevel1Node)
        .map(edge => this.graph.nodes.find(node => node.id === edge.target));
    },
    level2Nodes() {
      if (!this.graph || !this.selectedLevel2Node) {
        return [];
      }

      return this.graph.edges
        .filter(edge => edge.source === this.selectedLevel2Node)
        .map(edge => this.graph.nodes.find(node => node.id === edge.target));
    },
    level3Nodes() {
      if (!this.graph || !this.selectedLevel2Node) {
        return [];
      }

      return this.graph.edges
        .filter(edge => edge.source === this.selectedLevel2Node)
        .map(edge => this.graph.nodes.find(node => node.id === edge.target));
    }
  },
  created() {
    this.loadGraphData();
  },
  methods: {
    loadGraphData() {
      axios
        .get("graph.json")
        .then(response => {
          this.graph = response.data;
        })
        .catch(error => {
          console.error("Error loading graph data:", error);
        });
    },
    selectLevel1Node(nodeId) {
      this.selectedLevel1Node = nodeId;
      this.selectedLevel2Node = null;
    },
    selectLevel2Node(nodeId) {
      this.selectedLevel2Node = nodeId;
    }
  }
};
</script>

<template>
  <div>
    <h2>Graph Browser</h2>

    <ConnectedList
      :nodes="level1Nodes"
      title="Level 1 Nodes"
      @node-selected="selectLevel2Node"
    ></ConnectedList>

    <div>
      <ConnectedList
        :nodes="level2Nodes"
        title="Level 2 Nodes"
        @node-selected="selectLevel3Node"
      ></ConnectedList>
    </div>

    <div>
      <ConnectedList
        :nodes="level3Nodes"
        title="Level 3 Nodes"
      ></ConnectedList>
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
      selectedLevel3Node: null
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
      if (!this.graph || !this.selectedLevel1Node || !this.selectedLevel2Node) {
        return [];
      }

      return this.graph.edges
        .filter(edge => edge.source === this.selectedLevel2Node)
        .map(edge => this.graph.nodes.find(node => node.id === edge.target));
    },
    level3Nodes() {
      if (!this.graph || !this.selectedLevel3Node) {
        return [];
      }

      return this.graph.edges
        .filter(edge => edge.source === this.selectedLevel3Node)
        .map(edge => this.graph.nodes.find(node => node.id === edge.target));
    }
  },
  created() {
    this.loadGraphData();
    this.selectedLevel1Node = parseInt(this.startingNode);
  },
  methods: {
    loadGraphData() {
      axios
        .get("/graph.json")
        .then(response => {
          this.graph = response.data;
        })
        .catch(error => {
          console.error("Error loading graph data:", error);
        });
    },
    selectLevel1Node(nodeId) {
      //this.selectedLevel1Node = nodeId;
      this.selectedLevel2Node = nodeId;
    },
    selectLevel2Node(nodeId) {
      this.selectedLevel3Node = nodeId;
    },
    selectLevel3Node(nodeId) {
      this.selectedLevel1Node = this.selectedLevel2Node;
      this.selectedLevel2Node = this.selectedLevel3Node;
      this.selectedLevel3Node = nodeId;
    }
  }
};
</script>

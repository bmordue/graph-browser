<template>
  <div>
    <h2>Graph Browser</h2>
    
    <div>
      <h3>Level 1 Nodes</h3>
      <ul>
        <li v-for="node in level1Nodes" :key="node.id" @click="selectLevel1Node(node.id)">
          {{ node.name }}
        </li>
      </ul>
    </div>
    
    <div v-if="selectedLevel1Node">
      <h3>Level 2 Nodes</h3>
      <ul>
        <li v-for="node in level2Nodes" :key="node.id" @click="selectLevel2Node(node.id)">
          {{ node.name }}
        </li>
      </ul>
    </div>
    
    <div v-if="selectedLevel2Node">
      <h3>Level 3 Nodes</h3>
      <ul>
        <li v-for="node in level3Nodes" :key="node.id">
          {{ node.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
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
      axios.get("graph.json")
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

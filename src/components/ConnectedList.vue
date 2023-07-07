<template>
  <div>
    <h3>{{ title }}</h3>
    <ul>
      <li v-for="node in nodes" :key="node.id" @click="selectNode(node.id)">
        {{ node.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    nodes: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    selectNode(nodeId) {
      this.$emit('node-selected', nodeId);
    }
  }
};
</script>

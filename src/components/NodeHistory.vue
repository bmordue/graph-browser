<template>
  <div style="border:1px solid blue; flex-basis: 200px">
    <h2>History</h2>
    <ol>
      <li v-for=" (node, i) in nodes" :key="node.id" @click="selectHistoryItem(node.id, i)">
        {{ node.name }}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    nodes: {
      type: Array,
      required: true
    }
  },
  methods: {
    selectHistoryItem(nodeId, itemIndex) {
      this.$emit('history-item-selected', nodeId, itemIndex)
    }
  }
};
</script>

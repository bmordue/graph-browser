<template>
  <div>
    <h2><span v-if="root.name">Routes from {{ root.name }}</span><span v-else>[empty]</span></h2>
    <ul>
      <li v-for="node in children" :key="node.id" @click="selectNode(node.id)"
        :class="node.id === this.selectedId ? 'selected' : ''">
        {{ node.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedId: null
    }
  },
  props: {
    root: {
      type: Object,
      required: true
    },
    children: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    selectNode(nodeId) {
      this.selectedId = nodeId;
      this.$emit('node-selected', nodeId, this.index);
    }
  }
};
</script>

<style>
.selected {
  font-weight: bold
}
</style>

<template>
  <div>
    <h3>Routes from {{ root.name }}</h3>
    <ul>
      <li v-for="node in children" :key="node.id" @click="selectNode(node.id)" :class="node.id === this.selectedId ? 'selected' : ''">
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
      type: Object
    },
    children: {
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
      console.log(`${this.root}`)
      this.selectedId = nodeId;
      this.$emit('node-selected', nodeId);
    }
  }
};
</script>

<style>
.selected {
  font-weight: bold
}
</style>
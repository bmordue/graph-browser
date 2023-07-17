<template>
  <div>
    <h2>History</h2>
    <ol>
      <li v-for="node in nodes" :key="node.id">
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
  }
};
</script>
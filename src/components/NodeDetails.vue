<template>
  <div style="border:1px solid blue; flex-basis: 200px">
    <h2>Details</h2>
    <div v-if="node && node.data">
      <div>Label: {{ node.data.label }}</div>
      <div>NS: {{ node.data.NS }}</div>
      <div>Hash: {{ node.data.hash }}</div>
      <div v-if="node.data.constituents">
        <h3>Constituents:</h3>
        <div v-for="constituent in node.data.constituents" :key="constituent.hash">
          <div>Hash: {{ constituent.hash }}</div>
          <div>Weight: {{ constituent.weight }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      required: true,
      validator: (node) =>
        node.data && 
        typeof node.data.label === 'string' &&
        typeof node.data.NS === 'string' && 
        typeof node.data.hash === 'string' &&
        Array.isArray(node.data.constituents)
    }
  }
}
</script>

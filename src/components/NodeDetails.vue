<template>
  <div style="border:1px solid blue; flex-basis: 200px">
    <h2>Details</h2>
    <div v-if="node && node.data">{{ node.name }} is in {{ node.data.country }}.</div>
  </div>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      required: true
    }
  }
}
</script>

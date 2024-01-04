import axios from 'axios'

export default class DataService {
  graph = null

  async init() {
    if (!this.graph) {
      this.graph = (await axios.get('./graph.json')).data
    }
  }

  childrenOf(nodeId) {
    if (!this.graph) {
      return []
    }

    return this.graph.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => this.graph.nodes.find((node) => node.id === edge.target))
  }

  getNodeById(nodeId) {
    if (!this.graph) {
      return {}
    }

    return this.graph.nodes.find((n) => n.id === nodeId) || {}
  }
}

import axios from 'axios'

export default class DataService {
  graph = null

  async init() {
    this.graph = (await axios.get('./graph.json')).data
  }

  async fetchGraphData() {
    if (!this.graph) {
      await this.init()
    }
    return Promise.resolve({ data: this.graph })
  }
}

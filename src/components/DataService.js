import axios from 'axios'

export default {
  fetchGraphData: () => {
    return axios.get('./graph.json')
  }
}

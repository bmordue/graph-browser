import axios from 'axios';

const API_BASE_URL = '/api';

export default class DataService {
  async getInitialNode(startingNode) {
    const response = await axios.get(`${API_BASE_URL}/node/${startingNode}`);
    return response.data;
  }

  async childrenOf(nodeId) {
    if (!nodeId) {
      return [];
    }
    const response = await axios.get(`${API_BASE_URL}/node/${nodeId}/children`);
    return response.data;
  }

  async getNodeById(nodeId) {
    if (!nodeId) {
      return {};
    }
    const response = await axios.get(`${API_BASE_URL}/node/${nodeId}`);
    return response.data;
  }
}

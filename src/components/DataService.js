import axios from 'axios'

const API_BASE_URL = '/api';

export default class DataService {
  async childrenOf(nodeId) {
    if (!nodeId) {
      return [];
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/node/${nodeId}/children`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching children for node ${nodeId}:`, error);
      return [];
    }
  }

  async getNodeById(nodeId) {
    if (!nodeId) {
      return {};
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/node/${nodeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching node ${nodeId}:`, error);
      return {};
    }
  }
}

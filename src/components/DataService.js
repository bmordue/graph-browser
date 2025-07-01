import axios from 'axios'

export default class DataService {
  // The graph data will now be fetched on demand from the API
  // instead of being loaded from a static file.

  async init() {
    // This method can be used for any initial setup if needed,
    // but it no longer loads the entire graph.
    // For now, it doesn't need to do anything.
    return Promise.resolve()
  }

  async childrenOf(nodeId) {
    if (nodeId === null || nodeId === undefined) {
      console.warn('DataService.childrenOf called with null or undefined nodeId');
      return [];
    }
    try {
      const response = await axios.get(`/api/node/${nodeId}/children`)
      // Adapt the API response to the structure expected by the frontend
      return response.data.map((node) => ({
        id: node.id,
        name: node.city, // Assuming 'city' from API maps to 'name' in frontend
        data: {} // Add empty data object as frontend might expect it
      }));
    } catch (error) {
      console.error(`Error fetching children for node ${nodeId}:`, error)
      return []
    }
  }

  async getNodeById(nodeId) {
    if (nodeId === null || nodeId === undefined) {
      console.warn('DataService.getNodeById called with null or undefined nodeId');
      return null; // Return null for invalid ID to be handled by caller
    }
    try {
      const response = await axios.get(`/api/node/${nodeId}`)
      if (response.data) {
        // Adapt the API response
        return {
          id: response.data.id,
          name: response.data.city, // Assuming 'city' from API maps to 'name'
          data: {} // Add empty data object
        }
      } else {
        return null; // Node not found
      }
    } catch (error) {
      console.error(`Error fetching node ${nodeId}:`, error)
      if (error.response && error.response.status === 404) {
        return null; // Node not found
      }
      // For other errors, re-throw or handle as appropriate
      // For now, returning null to minimize breaking changes in GraphBrowser.vue
      return null;
    }
  }
}

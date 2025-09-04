import request from 'supertest';
import app from '../graph.js';
import * as db from '../db.js';
import { vi, describe, it, expect, afterEach } from 'vitest';

vi.mock('../db.js');

describe('API Endpoints', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/node/:id', () => {
    it('should return a node when a valid ID is provided', async () => {
      const mockNode = { id: 1, name: 'Node 1' };
      db.getNode.mockResolvedValue(mockNode);

      const response = await request(app).get('/api/node/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNode);
      expect(db.getNode).toHaveBeenCalledWith('1');
    });

    it('should return 404 when an invalid ID is provided', async () => {
      db.getNode.mockResolvedValue(null);

      const response = await request(app).get('/api/node/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Node not found' });
    });

    it('should return 500 when there is a server error', async () => {
      db.getNode.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/node/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /api/node/:id/children', () => {
    it('should return the children of a node', async () => {
      const mockChildren = [{ id: 2, name: 'Node 2' }, { id: 3, name: 'Node 3' }];
      db.getChildren.mockResolvedValue(mockChildren);

      const response = await request(app).get('/api/node/1/children');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockChildren);
      expect(db.getChildren).toHaveBeenCalledWith('1');
    });

    it('should return an empty array when the node has no children', async () => {
      db.getChildren.mockResolvedValue([]);

      const response = await request(app).get('/api/node/1/children');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 when there is a server error', async () => {
      db.getChildren.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/node/1/children');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});

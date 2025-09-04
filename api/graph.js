import express from 'express';
import limiter from './rateLimiter.js';
import * as db from './db.js';

const PORT = 3000;

// Create the Express app
const app = express();

// Custom API endpoint for /api/node/:id
app.get('/api/node/:id', limiter, async (req, res) => {
  const id = req.params.id;
  try {
    const node = await db.getNode(id);
    if (!node) {
      res.status(404).json({ error: 'Node not found' });
    } else {
      res.json(node);
    }
  } catch (err) {
    console.error('Error fetching node:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get a list of nodes connected to node with a given id
app.get('/api/node/:id/children', limiter, async (req, res) => {
  const id = req.params.id;
  try {
    const children = await db.getChildren(id);
    res.json(children);
  } catch (err) {
    console.error('Error fetching children:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

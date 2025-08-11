const express = require('express');
const limiter = require('./rateLimiter');
const db = require('./database');

const PORT = 3000;

// Create the Express app
const app = express();

// API endpoint to get all nodes
app.get('/api/nodes', limiter, async (req, res) => {
  try {
    const nodes = await db.getNodes();
    res.json(nodes);
  } catch (err) {
    console.error('Error fetching all nodes:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for /api/node/:id
app.get('/api/node/:id', limiter, async (req, res) => {
  const id = req.params.id;
  try {
    const row = await db.getNode(id);
    if (!row) {
      res.status(404).json({ error: 'Node not found' });
    } else {
      res.json(row);
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
    const rows = await db.getChildren(id);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching children:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const limiter = require('./rateLimiter');

const PORT = 3000;

// Create a database connection
const db = new sqlite3.Database('trains.db');


// Define the resolvers
const root = {
  getNode: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM nodes WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },
  getNodes: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM nodes', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  getEdges: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM edges', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
};

// Create the Express app
const app = express();



// Custom API endpoint for /api/node/:id
app.get('/api/node/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM nodes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching node:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (!row) {
      res.status(404).json({ error: 'Node not found' });
    } else {
      res.json(row);
    }
  });
});

// get a list of nodes connected to node with a given id
app.get('/api/node/:id/children', limiter, (req, res) => {
  const id = req.params.id;
  db.all('SELECT * FROM nodes WHERE id IN (SELECT target FROM edges WHERE source = ?)', [id], (err, rows) => {
    if (err) {
      console.error('Error fetching children:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const PORT = 3000;

// Create a database connection
const db = new sqlite3.Database('trains.db');

// Create the server
const server = http.createServer((req, res) => {
  if (req.url === '/api/graph') {
    // Fetch nodes and edges from the database
    db.all('SELECT * FROM nodes', (err, nodes) => {
      if (err) {
        console.error('Error fetching nodes:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      db.all('SELECT * FROM edges', (err, edges) => {
        if (err) {
          console.error('Error fetching edges:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        const graphData = {
          nodes: nodes,
          edges: edges,
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(graphData));
      });
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

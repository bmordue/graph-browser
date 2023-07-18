# API notes

Very simple single-file server to expose the trains.db sqlite3 database over an HTTP API.

The trains.db data is created from the trains.sql file: `sqlite3 trains.db < trains.sql`

Run the server with `node graph.js`

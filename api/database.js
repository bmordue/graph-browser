const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'trains.db'));

function getNode(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM nodes WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getNodes() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM nodes', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

function getChildren(id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM nodes WHERE id IN (SELECT target FROM edges WHERE source = ?)', [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  getNode,
  getNodes,
  getChildren
};

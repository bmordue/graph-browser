import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('trains.db');

export function getNode(id) {
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

export function getChildren(id) {
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
